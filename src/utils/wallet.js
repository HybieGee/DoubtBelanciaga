import { ethers } from 'ethers'

export const connectWallet = async () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed')
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const accounts = await provider.send('eth_requestAccounts', [])
    return accounts[0]
  } catch (error) {
    console.error('Error connecting wallet:', error)
    throw error
  }
}

export const getProvider = () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed')
  }
  return new ethers.BrowserProvider(window.ethereum)
}

export const signMessage = async (message) => {
  const provider = getProvider()
  const signer = await provider.getSigner()
  return await signer.signMessage(message)
}
