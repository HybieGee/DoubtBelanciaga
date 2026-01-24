import FingerprintJS from '@fingerprintjs/fingerprintjs'

export const initFingerprint = async () => {
  try {
    const fp = await FingerprintJS.load()
    const result = await fp.get()
    return result.visitorId
  } catch (error) {
    console.error('Fingerprinting failed:', error)
    return `fallback-${Date.now()}-${Math.random()}`
  }
}

export const getUserIdentifier = (fingerprint, walletAddress) => {
  if (walletAddress) {
    return walletAddress
  }
  return fingerprint
}
