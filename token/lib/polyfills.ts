import BN from "bn.js"

// Add BN.js to the global scope
;(global as any).BN = BN

// Add isBN function to the global scope
;(global as any).isBN = (obj: any): boolean => obj instanceof BN

// Add Buffer to the global scope if needed
if (typeof window !== "undefined" && !window.Buffer) {
  window.Buffer = require("buffer/").Buffer
}
