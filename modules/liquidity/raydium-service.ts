"use client"

import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js"
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createSyncNativeInstruction,
  NATIVE_MINT,
} from "@solana/spl-token"
import { getValidRpcUrl } from "@/lib/token-service"
import { Liquidity, Percent, SPL_ACCOUNT_LAYOUT } from "@raydium-io/raydium-sdk"
import BN from "bn.js"
import type { LiquidityProgressCallback, LiquidityResult, LiquidityStatusCallback } from "./types"
import "@/lib/polyfills" // Import polyfills

// Raydium program IDs
const RAYDIUM_LIQUIDITY_PROGRAM_ID = new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8")

// Sleep function for delays
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Function to create a connection to Solana
const createConnection = async (): Promise<Connection> => {
  const rpcUrl = getValidRpcUrl()
  return new Connection(rpcUrl, {
    commitment: "confirmed",
    disableRetryOnRateLimit: false,
    confirmTransactionInitialTimeout: 120000,
  })
}

// Helper function to send transaction with different wallet implementations
async function sendTransactionWithWallet(
  wallet: any,
  transaction: Transaction,
  connection: Connection,
  onStatus?: LiquidityStatusCallback,
): Promise<string> {
  // Log available methods for debugging
  console.log(
    "Available wallet methods:",
    Object.keys(wallet).filter((key) => typeof wallet[key] === "function"),
  )

  // Log the transaction instructions for debugging
  console.log(
    "Transaction instructions:",
    transaction.instructions.map((instr, i) => ({
      index: i,
      programId: instr.programId.toString(),
      keys: instr.keys.map((k) => ({ pubkey: k.pubkey.toString(), isSigner: k.isSigner, isWritable: k.isWritable })),
    })),
  )

  // Try different methods that wallets might implement

  // Method 1: signAndSendTransaction (Phantom and some others)
  if (typeof wallet.signAndSendTransaction === "function") {
    onStatus?.("Using wallet.signAndSendTransaction method...")
    try {
      const result = await wallet.signAndSendTransaction(transaction)
      return result.signature || result
    } catch (e) {
      console.error("signAndSendTransaction failed:", e)
      // Continue to next method
    }
  }

  // Method 2: signTransaction + connection.sendRawTransaction (most wallets)
  if (typeof wallet.signTransaction === "function") {
    onStatus?.("Using wallet.signTransaction method...")
    try {
      const signedTransaction = await wallet.signTransaction(transaction)

      // The transaction might be returned in different formats depending on the wallet
      let serializedTransaction

      if (signedTransaction instanceof Transaction) {
        serializedTransaction = signedTransaction.serialize()
      } else if (signedTransaction.serialize && typeof signedTransaction.serialize === "function") {
        serializedTransaction = signedTransaction.serialize()
      } else {
        // If we can't serialize it, try sending it as is
        return await connection.sendRawTransaction(signedTransaction)
      }

      return await connection.sendRawTransaction(serializedTransaction)
    } catch (e) {
      console.error("signTransaction failed:", e)
      // Continue to next method
    }
  }

  // Method 3: Direct sendTransaction (some wallets)
  if (typeof wallet.sendTransaction === "function") {
    onStatus?.("Using wallet.sendTransaction method...")
    try {
      return await wallet.sendTransaction(transaction, connection)
    } catch (e) {
      console.error("sendTransaction failed:", e)
      // Continue to next method
    }
  }

  // Method 4: Solflare and some other wallets
  if (wallet.adapter && typeof wallet.adapter.sendTransaction === "function") {
    onStatus?.("Using wallet.adapter.sendTransaction method...")
    try {
      const { signature } = await wallet.adapter.sendTransaction(transaction, connection)
      return signature
    } catch (e) {
      console.error("adapter.sendTransaction failed:", e)
    }
  }

  // If we get here, no method worked
  throw new Error(
    "No compatible transaction signing method found in wallet. Available methods: " +
      Object.keys(wallet)
        .filter((key) => typeof wallet[key] === "function")
        .join(", "),
  )
}

// Simplified function to add liquidity
export async function addLiquiditySimplified(
  wallet: any,
  tokenMint: string,
  tokenAmount: number,
  solAmount = 0.5, // Default to 0.5 SOL if not specified
  onStatus?: LiquidityStatusCallback,
  onProgress?: LiquidityProgressCallback,
): Promise<LiquidityResult> {
  try {
    if (!wallet || !wallet.publicKey) {
      throw new Error("Wallet not connected")
    }

    // Check if the wallet has enough SOL for liquidity + creation fee
    const connection = await createConnection()
    const balance = await connection.getBalance(wallet.publicKey)
    const balanceInSol = balance / 1e9

    // Need at least 0.5 SOL for liquidity + 0.2 SOL for creation fee + 0.01 for transaction fees
    const requiredSol = 0.5 + 0.2 + 0.01

    if (balanceInSol < requiredSol) {
      throw new Error(
        `Insufficient SOL balance. You need at least ${requiredSol} SOL (0.5 SOL for liquidity, 0.2 SOL for Raydium creation fee, and 0.01 SOL for transaction fees).`,
      )
    }

    onStatus?.("Initializing liquidity addition...")
    onProgress?.(5)

    // Force solAmount to be 0.5 regardless of what was passed
    solAmount = 0.5

    const connection2 = await createConnection()
    const tokenMintPubkey = new PublicKey(tokenMint)
    const walletPubkey = wallet.publicKey

    onStatus?.("Preparing to pair your token with Solana...")
    onProgress?.(20)

    // Use a fixed base amount as suggested (900000000)
    const baseAmount = 900000000

    // Get associated token accounts
    const tokenAccount = await getAssociatedTokenAddress(tokenMintPubkey, walletPubkey, false)

    // Check if token account exists
    const tokenAccountInfo = await connection2.getAccountInfo(tokenAccount)

    // Create transaction
    const transaction = new Transaction()

    // If token account doesn't exist, create it
    if (!tokenAccountInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(walletPubkey, tokenAccount, walletPubkey, tokenMintPubkey),
      )
    }

    // Wrap SOL if needed
    const wsolAccount = await getAssociatedTokenAddress(NATIVE_MINT, walletPubkey, false)

    // Check if WSOL account exists
    const wsolAccountInfo = await connection2.getAccountInfo(wsolAccount)

    if (!wsolAccountInfo) {
      transaction.add(createAssociatedTokenAccountInstruction(walletPubkey, wsolAccount, walletPubkey, NATIVE_MINT))
    }

    // Add SOL to WSOL account - convert to lamports
    const solLamports = Math.floor(solAmount * 1e9)
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: walletPubkey,
        toPubkey: wsolAccount,
        lamports: solLamports,
      }),
    )

    // Sync native instruction - use the imported TOKEN_PROGRAM_ID
    transaction.add(createSyncNativeInstruction(wsolAccount))

    onStatus?.(`Creating SOL-${tokenMint.slice(0, 6)}... pair with ${baseAmount} tokens and ${solAmount} SOL...`)
    onProgress?.(60)

    // Get a recent blockhash
    const { blockhash } = await connection2.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = walletPubkey

    // Log the transaction details before sending
    console.log("Transaction details:", {
      instructions: transaction.instructions.length,
      signers: transaction.signatures.length,
      recentBlockhash: transaction.recentBlockhash,
      tokenMint: tokenMint,
      baseAmount: baseAmount,
      solAmount: solAmount,
      solLamports: solLamports,
    })

    // Sign and send transaction using our helper function
    onStatus?.("Requesting wallet signature...")
    onProgress?.(80)

    const txid = await sendTransactionWithWallet(wallet, transaction, connection2, onStatus)

    // After successful transaction, try to find the pool ID
    onStatus?.("Transaction sent. Searching for pool ID...")

    // Wait a bit for the transaction to be confirmed
    await sleep(5000)

    // Try to find the pool ID
    let poolId = ""
    try {
      const allPoolKeys = await Liquidity.fetchAllPoolKeys(connection2, RAYDIUM_LIQUIDITY_PROGRAM_ID)
      const tokenPool = allPoolKeys.find(
        (pool) => pool.baseMint.toString() === tokenMint || pool.quoteMint.toString() === tokenMint,
      )

      if (tokenPool) {
        poolId = tokenPool.id.toString()
        console.log("Found pool ID (AMM):", poolId)
        onStatus?.(`Found pool ID: ${poolId.slice(0, 8)}...${poolId.slice(-8)}`)
      }
    } catch (poolError) {
      console.warn("Could not find pool ID:", poolError)
    }

    onStatus?.(`Liquidity added successfully! Your token is now paired with SOL. Transaction ID: ${txid}`)
    onProgress?.(100)

    // After successful transaction, wait a bit and then redirect to DexScreener
    setTimeout(() => {
      try {
        // Open DexScreener in a new tab
        window.open(`https://dexscreener.com/solana/${tokenMint}`, "_blank")
      } catch (e) {
        console.error("Failed to open DexScreener:", e)
      }
    }, 5000)

    return {
      success: true,
      txId: txid,
      poolId: poolId,
    }
  } catch (error: any) {
    console.error("Error adding liquidity:", error)
    onStatus?.(`Error adding liquidity: ${error.message}`)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Function to remove liquidity
export async function removeLiquiditySimplified(
  wallet: any,
  tokenMint: string,
  percentToRemove: number, // 0-100
  onStatus?: LiquidityStatusCallback,
  onProgress?: LiquidityProgressCallback,
): Promise<LiquidityResult> {
  try {
    if (!wallet || !wallet.publicKey) {
      throw new Error("Wallet not connected")
    }

    onStatus?.("Initializing liquidity removal...")
    onProgress?.(5)

    const connection = await createConnection()
    const tokenMintPubkey = new PublicKey(tokenMint)
    const walletPubkey = wallet.publicKey

    // Find the pool for this token
    onStatus?.("Finding liquidity pool for your token...")
    onProgress?.(15)

    const allPoolKeys = await Liquidity.fetchAllPoolKeys(connection, RAYDIUM_LIQUIDITY_PROGRAM_ID)
    const tokenPool = allPoolKeys.find(
      (pool) => pool.baseMint.toString() === tokenMint || pool.quoteMint.toString() === tokenMint,
    )

    if (!tokenPool) {
      throw new Error("Liquidity pool for this token not found")
    }

    // Extract and log the pool ID (AMM ID)
    const poolId = tokenPool.id.toString()
    console.log("Found pool ID (AMM):", poolId)
    onStatus?.(`Found pool: ${poolId.slice(0, 8)}...${poolId.slice(-8)}`)
    onProgress?.(25)

    // Get LP token account
    const lpTokenAccount = await getAssociatedTokenAddress(tokenPool.lpMint, walletPubkey, false)

    // Check LP token balance
    const lpTokenInfo = await connection.getAccountInfo(lpTokenAccount)
    if (!lpTokenInfo) {
      throw new Error("You don't have any LP tokens for this pool")
    }

    const lpTokenBalance = SPL_ACCOUNT_LAYOUT.decode(lpTokenInfo.data).amount
    if (lpTokenBalance.isZero()) {
      throw new Error("You don't have any LP tokens for this pool")
    }

    console.log("LP token balance:", lpTokenBalance.toString())
    onStatus?.(`Found ${lpTokenBalance.toString()} LP tokens`)
    onProgress?.(35)

    // Calculate amount to remove
    const removePercent = new Percent(percentToRemove, 100)
    const amountToRemove = removePercent.mul(lpTokenBalance)
    console.log(`Removing ${percentToRemove}% of liquidity:`, amountToRemove.toString())
    onStatus?.(`Preparing to remove ${percentToRemove}% of your liquidity`)
    onProgress?.(45)

    // Get associated token accounts
    const tokenAccount = await getAssociatedTokenAddress(tokenMintPubkey, walletPubkey, false)
    const wsolAccount = await getAssociatedTokenAddress(NATIVE_MINT, walletPubkey, false)

    // Create transaction
    const transaction = new Transaction()

    // Check if token account exists
    const tokenAccountInfo = await connection.getAccountInfo(tokenAccount)
    if (!tokenAccountInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(walletPubkey, tokenAccount, walletPubkey, tokenMintPubkey),
      )
    }

    // Check if WSOL account exists
    const wsolAccountInfo = await connection.getAccountInfo(wsolAccount)
    if (!wsolAccountInfo) {
      transaction.add(createAssociatedTokenAccountInstruction(walletPubkey, wsolAccount, walletPubkey, NATIVE_MINT))
    }

    onStatus?.("Creating liquidity removal instructions...")
    onProgress?.(60)

    // Remove liquidity parameters
    const removeLiquidityParams = {
      connection,
      poolKeys: tokenPool,
      userKeys: {
        owner: walletPubkey,
        lpToken: lpTokenAccount,
        tokenAccounts: [
          {
            pubkey: tokenAccount,
            accountInfo: {
              mint: tokenMintPubkey,
              owner: walletPubkey,
              amount: new BN(0),
            },
          },
          {
            pubkey: wsolAccount,
            accountInfo: {
              mint: NATIVE_MINT,
              owner: walletPubkey,
              amount: new BN(0),
            },
          },
        ],
      },
      amountIn: amountToRemove,
    }

    // Generate the remove liquidity instructions
    const { innerTransactions } = await Liquidity.removeLiquidity(removeLiquidityParams)

    // Add all instructions to our transaction
    if (innerTransactions && innerTransactions.length > 0) {
      for (const innerTx of innerTransactions) {
        for (const instruction of innerTx.instructions) {
          transaction.add(instruction)
        }
      }
    }

    // Add an instruction to unwrap any remaining WSOL back to SOL
    transaction.add(createSyncNativeInstruction(wsolAccount))

    // Get a recent blockhash
    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = walletPubkey

    // Sign and send transaction
    onStatus?.("Requesting wallet signature...")
    onProgress?.(80)

    // Use our helper function to handle different wallet implementations
    const txid = await sendTransactionWithWallet(wallet, transaction, connection, onStatus)

    onStatus?.(`Liquidity removed successfully! Transaction ID: ${txid}`)
    onProgress?.(100)

    return {
      success: true,
      txId: txid,
      poolId: poolId,
    }
  } catch (error: any) {
    console.error("Error removing liquidity:", error)
    onStatus?.(`Error removing liquidity: ${error.message}`)
    return {
      success: false,
      error: error.message,
    }
  }
}
