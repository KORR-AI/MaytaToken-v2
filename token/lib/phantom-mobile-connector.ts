// Direct Phantom mobile connector with debugging

// Check if we're on a mobile device
export function isMobileDevice(): boolean {
  return (
    typeof window !== "undefined" &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  )
}

// Check if we're on Android specifically
export function isAndroid(): boolean {
  return typeof window !== "undefined" && /Android/i.test(navigator.userAgent)
}

// Check if we're on iOS
export function isIOS(): boolean {
  return typeof window !== "undefined" && /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

// Check if Phantom is installed
export function isPhantomInstalled(): boolean {
  if (typeof window === "undefined") return false

  // Check for Phantom in different possible locations
  const solana = (window as any).solana
  const phantom = (window as any).phantom

  return (solana && solana.isPhantom) || (phantom && phantom.solana && phantom.solana.isPhantom)
}

// Get the Phantom object from window
export function getPhantom() {
  if (typeof window === "undefined") return null

  // Try different ways to access Phantom
  const solana = (window as any).solana
  const phantom = (window as any).phantom

  if (solana && solana.isPhantom) {
    return solana
  } else if (phantom && phantom.solana && phantom.solana.isPhantom) {
    return phantom.solana
  }

  return null
}

// Generate a QR code URL for the current page
export function getQRCodeUrl(): string {
  if (typeof window === "undefined") return ""
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.href)}`
}

// Get Phantom app store links
export function getPhantomAppStoreLink(): string {
  if (isAndroid()) {
    return "https://play.google.com/store/apps/details?id=app.phantom"
  } else if (isIOS()) {
    return "https://apps.apple.com/us/app/phantom-crypto-wallet/id1598432977"
  }
  return "https://phantom.app/download"
}

// Get the Phantom browser URL
export function getPhantomBrowserUrl(): string {
  if (typeof window === "undefined") return "https://phantom.app/ul/browse"
  return `https://phantom.app/ul/browse/${encodeURIComponent(window.location.href)}`
}

// Get debug info for troubleshooting
export function getDebugInfo(): Record<string, any> {
  if (typeof window === "undefined") return { error: "Not in browser environment" }

  return {
    userAgent: navigator.userAgent,
    isMobile: isMobileDevice(),
    isAndroid: isAndroid(),
    isIOS: isIOS(),
    isPhantomInstalled: isPhantomInstalled(),
    windowHasSolana: !!(window as any).solana,
    windowHasPhantom: !!(window as any).phantom,
    url: window.location.href,
    protocol: window.location.protocol,
    host: window.location.host,
  }
}
