import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig } from 'wagmi'
import { hardhat, mainnet, polygon, optimism, arbitrum } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

export const { chains, publicClient } = configureChains(
  [hardhat, mainnet, polygon, optimism, arbitrum],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID as string }), publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'Ama DApp',
  chains,
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

export default wagmiConfig
