// Shared types for the liquidity module
export interface LiquidityResult {
  success: boolean
  txId?: string
  poolId?: string
  error?: string
}

export type LiquidityStatusCallback = (status: string) => void

export type LiquidityProgressCallback = (progress: number) => void
