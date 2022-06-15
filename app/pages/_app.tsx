import '../styles/globals.css'
import type { AppProps } from 'next/app'

import '@rainbow-me/rainbowkit/styles.css'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { chain, createClient, configureChains, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import ContractsProvider from '../providers/ContractsProvider/ContractProvider'

const chainList = [chain.hardhat, chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum]

const { chains, provider } = configureChains(chainList, [
  alchemyProvider({ alchemyId: process.env.ALCHEMY }),
  publicProvider(),
])

const { connectors } = getDefaultWallets({
  appName: 'dFeed',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

const subgraphUri = 'http://localhost:8000/subgraphs/name/scaffold-eth/your-contract'

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
})

function MyApp({ Component, pageProps }: AppProps) {
  return (<ApolloProvider client={client}>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ContractsProvider>
          <Component {...pageProps} />
        </ContractsProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </ApolloProvider>)
}

export default MyApp
