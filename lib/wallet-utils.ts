// Simple utility functions for wallet detection and connection

// Check if user is on a mobile device
export function isMobileDevice(): boolean {
  return (
    typeof window !== "undefined" &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  )
}

// Check if Phantom is available as a browser extension
export function isPhantomExtensionAvailable(): boolean {
  return typeof window !== "undefined" && window.solana && window.solana.isPhantom
}

// Generate a QR code URL for the current page
export function getQRCodeUrl(): string {
  if (typeof window === "undefined") return ""
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}`
}

// Get Phantom app deep link
export function getPhantomDeepLink(): string {
  if (typeof window === "undefined") return ""
  return `https://phantom.app/ul/browse/${encodeURIComponent(window.location.origin + window.location.pathname)}`
}
