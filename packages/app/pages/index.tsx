import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <>
      <ConnectButton />

      <div className="w-96 mx-auto mt-20 p-3">Hello DApp</div>
    </>
  )
}

export default Home
