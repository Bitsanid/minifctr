import { http, createConfig } from 'wagmi'
import { base, mainnet, optimism } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'bd09912a5b9c37f40397d5a52865d4b6'

export const config = createConfig({
  chains: [mainnet, base, optimism],
  connectors: [
    farcasterMiniApp(),
    injected(),
    walletConnect({ projectId }),
    metaMask(),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
  },
})