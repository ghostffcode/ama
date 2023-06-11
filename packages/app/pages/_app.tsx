import '../styles/globals.css'
import type { AppProps } from 'next/app'

import '@rainbow-me/rainbowkit/styles.css'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiConfig } from 'wagmi'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import wagmiConfig, { chains } from '@/utils/wagmi'

const subgraphUri = 'http://localhost:8000/subgraphs/name/app/your-contract'

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
})

function MyApp({ Component, pageProps }: AppProps) {
  return (<ApolloProvider client={client}>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  </ApolloProvider>)
}

export default MyApp
