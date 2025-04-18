"use client"

// Import polyfills first
import "./polyfills"

import { Connection, PublicKey, Transaction, Keypair, SystemProgram } from "@solana/web3.js"
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createSyncNativeInstruction,
  NATIVE_MINT,
} from "@solana/spl-token"
import {
  Liquidity,
  Percent,
  Token,
  TokenAmount,
  type LiquidityPoolInfo,
  SPL_ACCOUNT_LAYOUT,
} from "@raydium-io/raydium-sdk"
import { getValidRpcUrl } from "./token-service"
import BN from "bn.js"

// Constants
const RAYDIUM_LIQUIDITY_PROGRAM_ID_V4 = new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8")
const RAYDIUM_MAINNET_PROGRAM_ID = new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8")
const SERUM_PROGRAM_ID_V3 = new PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin")
const SOL_USDC_MARKET = new PublicKey("8BnEgHoWFysVcuFFX7QztDmzuH8r5ZFvyP3sYwn1XTh6") // SOL/USDC market on Serum

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

// Function to get the SOL/USDC pool info
async function getPoolInfo(connection: Connection): Promise<LiquidityPoolInfo | null> {
  try {
    // Fetch all liquidity pools
    const allPoolKeys = await Liquidity.fetchAllPoolKeys(connection, RAYDIUM_LIQUIDITY_PROGRAM_ID_V4)

    // Find the SOL/USDC pool
    const solUsdcPool = allPoolKeys.find((pool) => pool.marketId.toString() === SOL_USDC_MARKET.toString())

    if (!solUsdcPool) {
      console.error("SOL/USDC pool not found")
      return null
    }

    // Fetch the pool info
    const poolInfo = await Liquidity.fetchInfo({
      connection,
      poolKeys: solUsdcPool,
    })

    return poolInfo
  } catch (error) {
    console.error("Error fetching pool info:", error)
    return null
  }
}

// Function to create a new liquidity pool for a token
export async function createLiquidityPool(
  wallet: any,
  tokenMint: string,
  initialTokenAmount: number,
  initialSolAmount: number,
  onStatus?: (status: string) => void,
  onProgress?: (progress: number) => void,
): Promise<{ success: boolean; txId?: string; poolId?: string; error?: string }> {
  try {
    if (!wallet || !wallet.publicKey) {
      throw new Error("Wallet not connected")
    }

    onStatus?.("Initializing liquidity pool creation...")
    onProgress?.(5)

    const connection = await createConnection()
    const tokenMintPubkey = new PublicKey(tokenMint)
    const walletPubkey = wallet.publicKey

    // Get SOL/USDC pool info to use as a reference
    onStatus?.("Fetching reference pool information...")
    onProgress?.(10)
    const solUsdcPoolInfo = await getPoolInfo(connection)

    if (!solUsdcPoolInfo) {
      throw new Error("Failed to fetch reference pool information")
    }

    // Create token objects
    const SOL = new Token(NATIVE_MINT, 9, "SOL", "Solana")
    const newToken = new Token(tokenMintPubkey, 9, "TOKEN", "Custom Token")

    // Calculate amounts - use BN directly
    const tokenAmountBN = new BN(initialTokenAmount * 10 ** 9)
    const solAmountBN = new BN(initialSolAmount * 10 ** 9)

    const tokenAmount = new TokenAmount(newToken, tokenAmountBN)
    const solAmount = new TokenAmount(SOL, solAmountBN)

    onStatus?.("Preparing liquidity pool transaction...")
    onProgress?.(20)

    // Get associated token accounts
    const tokenAccount = await getAssociatedTokenAddress(tokenMintPubkey, walletPubkey, false)

    // Check if token account exists
    const tokenAccountInfo = await connection.getAccountInfo(tokenAccount)

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
    const wsolAccountInfo = await connection.getAccountInfo(wsolAccount)

    if (!wsolAccountInfo) {
      transaction.add(createAssociatedTokenAccountInstruction(walletPubkey, wsolAccount, walletPubkey, NATIVE_MINT))
    }

    // Add SOL to WSOL account
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: walletPubkey,
        toPubkey: wsolAccount,
        lamports: solAmountBN.toNumber(),
      }),
    )

    // Sync native instruction
    transaction.add(createSyncNativeInstruction(wsolAccount))

    onStatus?.("Creating liquidity pool...")
    onProgress?.(40)

    // Generate a new keypair for the AMM account
    const ammKeypair = Keypair.generate()

    // Create pool parameters
    const createPoolParams = {
      connection,
      wallet: {
        publicKey: walletPubkey,
        signTransaction: wallet.signTransaction,
        signAllTransactions: wallet.signAllTransactions,
      },
      baseMint: tokenMintPubkey,
      quoteMint: NATIVE_MINT,
      baseAmount: tokenAmount,
      quoteAmount: solAmount,
      ammKeypair,
      poolKeys: solUsdcPoolInfo.poolKeys, // Use as reference
      initialLiquidityProvider: walletPubkey,
    }

    // Create the pool
    const { txids, poolKeys } = await Liquidity.createPool(createPoolParams)

    onStatus?.(`Liquidity pool created! Transaction ID: ${txids[0]}`)
    onProgress?.(100)

    return {
      success: true,
      txId: txids[0],
      poolId: poolKeys.id.toString(),
    }
  } catch (error: any) {
    console.error("Error creating liquidity pool:", error)
    onStatus?.(`Error creating liquidity pool: ${error.message}`)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Function to add liquidity to an existing pool
export async function addLiquidity(
  wallet: any,
  tokenMint: string,
  tokenAmount: number,
  solAmount: number,
  onStatus?: (status: string) => void,
  onProgress?: (progress: number) => void,
): Promise<{ success: boolean; txId?: string; error?: string }> {
  try {
    if (!wallet || !wallet.publicKey) {
      throw new Error("Wallet not connected")
    }

    onStatus?.("Initializing liquidity addition...")
    onProgress?.(5)

    const connection = await createConnection()
    const tokenMintPubkey = new PublicKey(tokenMint)
    const walletPubkey = wallet.publicKey

    // Find the pool for this token
    onStatus?.("Finding liquidity pool for your token...")
    onProgress?.(15)

    const allPoolKeys = await Liquidity.fetchAllPoolKeys(connection, RAYDIUM_LIQUIDITY_PROGRAM_ID_V4)
    const tokenPool = allPoolKeys.find(
      (pool) => pool.baseMint.toString() === tokenMint || pool.quoteMint.toString() === tokenMint,
    )

    if (!tokenPool) {
      throw new Error("Liquidity pool for this token not found. Please create a pool first.")
    }

    // Fetch pool info
    onStatus?.("Fetching pool information...")
    onProgress?.(25)

    const poolInfo = await Liquidity.fetchInfo({
      connection,
      poolKeys: tokenPool,
    })

    // Create token objects
    const SOL = new Token(NATIVE_MINT, 9, "SOL", "Solana")
    const newToken = new Token(tokenMintPubkey, 9, "TOKEN", "Custom Token")

    // Calculate amounts - use BN directly
    const tokenAmountBN = new BN(tokenAmount * 10 ** 9)
    const solAmountBN = new BN(solAmount * 10 ** 9)

    const addTokenAmount = new TokenAmount(newToken, tokenAmountBN)
    const addSolAmount = new TokenAmount(SOL, solAmountBN)

    onStatus?.("Preparing add liquidity transaction...")
    onProgress?.(40)

    // Get associated token accounts
    const tokenAccount = await getAssociatedTokenAddress(tokenMintPubkey, walletPubkey, false)

    // Check if token account exists
    const tokenAccountInfo = await connection.getAccountInfo(tokenAccount)

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
    const wsolAccountInfo = await connection.getAccountInfo(wsolAccount)

    if (!wsolAccountInfo) {
      transaction.add(createAssociatedTokenAccountInstruction(walletPubkey, wsolAccount, walletPubkey, NATIVE_MINT))
    }

    // Add SOL to WSOL account
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: walletPubkey,
        toPubkey: wsolAccount,
        lamports: solAmountBN.toNumber(),
      }),
    )

    // Sync native instruction
    transaction.add(createSyncNativeInstruction(wsolAccount))

    onStatus?.("Adding liquidity to pool...")
    onProgress?.(60)

    // Add liquidity parameters
    const addLiquidityParams = {
      connection,
      poolKeys: tokenPool,
      userKeys: {
        tokenAccounts: [
          {
            pubkey: tokenAccount,
            accountInfo: {
              mint: tokenMintPubkey,
              owner: walletPubkey,
              amount: tokenAmountBN.toNumber(),
            },
          },
          {
            pubkey: wsolAccount,
            accountInfo: {
              mint: NATIVE_MINT,
              owner: walletPubkey,
              amount: solAmountBN.toNumber(),
            },
          },
        ],
        owner: walletPubkey,
      },
      amountIn: tokenPool.baseMint.equals(tokenMintPubkey) ? addTokenAmount : addSolAmount,
      amountInB: tokenPool.baseMint.equals(tokenMintPubkey) ? addSolAmount : addTokenAmount,
      fixedSide: "a",
    }

    // Add liquidity
    const { innerTransactions } = await Liquidity.addLiquidity(addLiquidityParams)

    // Sign and send transaction
    onStatus?.("Sending transaction...")
    onProgress?.(80)

    const txid = await wallet.sendTransaction(transaction, connection)

    onStatus?.(`Liquidity added successfully! Transaction ID: ${txid}`)
    onProgress?.(100)

    return {
      success: true,
      txId: txid,
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

// Function to remove liquidity from a pool
export async function removeLiquidity(
  wallet: any,
  tokenMint: string,
  percentToRemove: number, // 0-100
  onStatus?: (status: string) => void,
  onProgress?: (progress: number) => void,
): Promise<{ success: boolean; txId?: string; error?: string }> {
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

    const allPoolKeys = await Liquidity.fetchAllPoolKeys(connection, RAYDIUM_LIQUIDITY_PROGRAM_ID_V4)
    const tokenPool = allPoolKeys.find(
      (pool) => pool.baseMint.toString() === tokenMint || pool.quoteMint.toString() === tokenMint,
    )

    if (!tokenPool) {
      throw new Error("Liquidity pool for this token not found")
    }

    // Fetch pool info
    onStatus?.("Fetching pool information...")
    onProgress?.(25)

    const poolInfo = await Liquidity.fetchInfo({
      connection,
      poolKeys: tokenPool,
    })

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

    onStatus?.("Preparing remove liquidity transaction...")
    onProgress?.(40)

    // Calculate amount to remove
    const removePercent = new Percent(percentToRemove, 100)
    const amountToRemove = removePercent.mul(lpTokenBalance)

    // Get associated token accounts
    const tokenAccount = await getAssociatedTokenAddress(tokenMintPubkey, walletPubkey, false)

    // Wrap SOL if needed
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

    onStatus?.("Removing liquidity from pool...")
    onProgress?.(60)

    // Remove liquidity parameters
    const removeLiquidityParams = {
      connection,
      poolKeys: tokenPool,
      userKeys: {
        lpToken: lpTokenAccount,
        tokenAccounts: [
          {
            pubkey: tokenAccount,
            accountInfo: {
              mint: tokenMintPubkey,
              owner: walletPubkey,
            },
          },
          {
            pubkey: wsolAccount,
            accountInfo: {
              mint: NATIVE_MINT,
              owner: walletPubkey,
            },
          },
        ],
        owner: walletPubkey,
      },
      amountIn: amountToRemove,
    }

    // Remove liquidity
    const { innerTransactions } = await Liquidity.removeLiquidity(removeLiquidityParams)

    // Sign and send transaction
    onStatus?.("Sending transaction...")
    onProgress?.(80)

    const txid = await wallet.sendTransaction(transaction, connection)

    onStatus?.(`Liquidity removed successfully! Transaction ID: ${txid}`)
    onProgress?.(100)

    return {
      success: true,
      txId: txid,
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
