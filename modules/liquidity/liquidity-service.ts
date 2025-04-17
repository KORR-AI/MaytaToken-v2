import { addLiquiditySimplified, removeLiquiditySimplified } from "./raydium-service"
import type { LiquidityProgressCallback, LiquidityResult, LiquidityStatusCallback } from "./types"

/**
 * Add liquidity to a token
 * This is the main entry point for adding liquidity from other modules
 */
export async function addLiquidity(
  wallet: any,
  tokenMint: string,
  tokenAmount: number,
  solAmount = 0.5,
  onStatus?: LiquidityStatusCallback,
  onProgress?: LiquidityProgressCallback,
): Promise<LiquidityResult> {
  return addLiquiditySimplified(wallet, tokenMint, tokenAmount, solAmount, onStatus, onProgress)
}

/**
 * Remove liquidity from a token
 * This is the main entry point for removing liquidity from other modules
 */
export async function removeLiquidity(
  wallet: any,
  tokenMint: string,
  percentToRemove: number,
  onStatus?: LiquidityStatusCallback,
  onProgress?: LiquidityProgressCallback,
): Promise<LiquidityResult> {
  return removeLiquiditySimplified(wallet, tokenMint, percentToRemove, onStatus, onProgress)
}
