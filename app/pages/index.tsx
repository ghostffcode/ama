import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { NextPage } from 'next'
import { useContracts } from '../providers/ContractsProvider/ContractProvider'

const Home: NextPage = () => {

  const contracts = useContracts();

  console.log(contracts)

  return (
    <>
      <ConnectButton showBalance={false} />

      <div className="w-96 border-2 rounded mx-auto mt-20 border-gray-500 bg-white p-3">Hello dFeed</div>
    </>
  )
}

export default Home
