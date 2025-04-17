// Comprehensive mobile wallet connector with multiple strategies

// Strategy 1: WalletConnect
export async function connectWithWalletConnect() {
  // This is a placeholder for WalletConnect implementation
  // WalletConnect requires additional setup with their SDK
  console.log("WalletConnect strategy would be implemented here")
  return false
}

// Strategy 2: Direct Phantom Deep Link
export function connectWithPhantomDeepLink() {
  if (typeof window === "undefined") return false

  // Create a deep link to Phantom
  const currentUrl = encodeURIComponent(window.location.href)
  const phantomDeepLink = `https://phantom.app/ul/browse/${currentUrl}`

  // Open the deep link
  window.location.href = phantomDeepLink
  return true
}

// Strategy 3: Universal Link
export function connectWithUniversalLink() {
  if (typeof window === "undefined") return false

  // Create a universal link
  const appUrl = encodeURIComponent(window.location.href)
  const universalLink = `https://phantom.app/ul/v1/connect?app_url=${appUrl}`

  // Open the universal link
  window.location.href = universalLink
  return true
}

// Strategy 4: QR Code for cross-device connection
export function getQRCodeUrl() {
  if (typeof window === "undefined") return ""

  // Generate QR code for the current URL
  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(window.location.href)}`
}

// Helper functions
export function isMobileDevice() {
  return (
    typeof window !== "undefined" &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  )
}

export function isAndroid() {
  return typeof window !== "undefined" && /Android/i.test(navigator.userAgent)
}

export function isIOS() {
  return typeof window !== "undefined" && /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export function isPhantomInstalled() {
  return typeof window !== "undefined" && window.solana && window.solana.isPhantom
}

// Get Phantom app store links
export function getPhantomAppStoreLink() {
  if (isAndroid()) {
    return "https://play.google.com/store/apps/details?id=app.phantom"
  } else if (isIOS()) {
    return "https://apps.apple.com/us/app/phantom-crypto-wallet/id1598432977"
  }
  return "https://phantom.app/download"
}
