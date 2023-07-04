import { useCallback, useEffect, useState } from 'react';
import { useNetwork, useWalletClient } from 'wagmi';
import { chains as appChains, publicClient } from '@/utils/wagmi';
import { SimulateContractParameters } from 'viem';
import { Contract } from '@/types/contract';
import * as rawContract from '@/contracts/hardhat_contracts.json'

const contracts: Contract = rawContract as Contract

interface ChainContracts {
  [key: string]: {
    address: `0x${string}`,
    abi: any[]
  }
}

interface WriteParam {
  contract?: string
  functionName: string
  args?: any[]
  value?: bigint
}

interface UseContractsParams {
  contractName?: string
  abi?: any[]
  address?: `0x${string}`
}

const useContracts = ({ contractName, abi, address }: UseContractsParams) => {
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient()
  const [currentChainId, setCurrentChainId] = useState<number>()
  const [chainContracts, setChainContracts] = useState<ChainContracts>()

  const write = useCallback(async ({ contract, functionName, args = [], value = undefined }: WriteParam) => {
    const _contractName = contractName || contract || ""
    const client = publicClient({ chainId: currentChainId })

    if (abi && address) {
      // const { request } = await client.simulateContract({ address, abi, functionName, args, value, account: account?.address as `0x${string}` })

      // const hash = await walletClient?.writeContract(request) as `0x${string}`
      const hash = await walletClient?.writeContract({ address, abi, functionName, args, value }) as `0x${string}`

      await client.waitForTransactionReceipt({ hash, confirmations: currentChainId === 31337 ? 1 : 4 })

      return hash
    } else if (chainContracts && chainContracts[_contractName]) {
      // const { request } = await client.simulateContract({ ...chainContracts[_contractName], functionName, args, value } as SimulateContractParameters)

      // const hash = await walletClient?.writeContract(request) as `0x${string}`
      const hash = await walletClient?.writeContract({ ...chainContracts[_contractName], functionName, args, value }) as `0x${string}`

      await client.waitForTransactionReceipt({ hash, confirmations: currentChainId === 31337 ? 1 : 4 })

      return hash
    } else {
      console.log(`Contract with name ${contract} does not exist`)
    }
  }, [abi, address, chainContracts, contractName, currentChainId, walletClient])

  useEffect(() => {
    const activeChain = chain || appChains[0]
    const chainId = activeChain.id

    if (contracts[chainId]) {
      const _chainContracts: ChainContracts = {}
      contracts[chainId].forEach((chainContract) => {
        Object.keys(chainContract.contracts).map((contractName) => {
          _chainContracts[contractName] = chainContract.contracts[contractName];
        })
      })
      setCurrentChainId(chainId)
      setChainContracts(_chainContracts)
    } else {
      setChainContracts({})
    }
  }, [chain])

  return { write, contracts: chainContracts }
}

export default useContracts