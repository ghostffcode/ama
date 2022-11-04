import '../styles/globals.css'
import type { AppProps } from 'next/app'

import '@rainbow-me/rainbowkit/styles.css'
import { WagmiConfig } from 'wagmi';
import { wagmiClient, chains } from '../utils/wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import ContractsProvider from '../providers/ContractsProvider/ContractProvider'

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
