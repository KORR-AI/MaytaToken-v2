import type React from "react"
import TokenCompletionPage from "./token-completion-page"

interface TokenSuccessMessageProps {
  mintAddress: string
  tokenName: string
  tokenSymbol: string
  tokenImage?: string // Add tokenImage prop
  onCreateAnother: () => void
}

const TokenSuccessMessage: React.FC<TokenSuccessMessageProps> = ({
  mintAddress,
  tokenName,
  tokenSymbol,
  tokenImage, // Accept tokenImage prop
  onCreateAnother,
}) => {
  return (
    <TokenCompletionPage
      mintAddress={mintAddress}
      tokenName={tokenName}
      tokenSymbol={tokenSymbol}
      tokenImage={tokenImage} // Pass tokenImage to TokenCompletionPage
      onCreateAnother={onCreateAnother}
    />
  )
}

export default TokenSuccessMessage
