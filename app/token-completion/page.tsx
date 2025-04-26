"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function TokenCompletionPage() {
  const searchParams = useSearchParams()
  const tokenAddress = searchParams.get("address")
  const tokenImage = searchParams.get("image")

  if (!tokenAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Error</CardTitle>
            <CardDescription className="text-center">
              No token address provided. Please create a token first.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/">Go Back to Token Creation</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <CardTitle>Token Created Successfully!</CardTitle>
          <CardDescription>Your SPL token has been created on the Solana blockchain.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            {tokenImage && (
              <div className="mr-4">
                <img
                  src={decodeURIComponent(tokenImage) || "/placeholder.svg"}
                  alt="Token"
                  className="w-16 h-16 object-cover rounded-full border-2 border-gray-200"
                  onError={(e) => {
                    console.error("Error loading token image")
                    ;(e.target as HTMLImageElement).style.display = "none"
                  }}
                />
              </div>
            )}
            <div>
              <h3 className="font-medium text-sm text-gray-500">Token Address:</h3>
              <p className="font-mono text-sm break-all">{tokenAddress}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">What's Next?</h3>
            <ul className="text-sm space-y-2">
              <li>• Add your token to a wallet like Phantom or Solflare</li>
              <li>• Create a liquidity pool on a DEX</li>
              <li>• Share your token with your community</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full" variant="outline">
            <Link
              href={`https://explorer.solana.com/address/${tokenAddress}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Solana Explorer
            </Link>
          </Button>
          <Button asChild className="w-full">
            <Link href="/">Create Another Token</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
