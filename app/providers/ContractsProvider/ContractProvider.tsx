import { Contract, providers } from 'ethers';
import React, { FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useProvider, useSigner } from 'wagmi';
import { HardhatContractType } from './types';
import merge from "lodash/merge";

const deployedContracts = require('../../contracts/hardhat_contracts.json');
const externalContracts = require('../../contracts/external_contracts.ts');

const rawContractData: HardhatContractType = merge(externalContracts, deployedContracts);

const emptyContract = { readContracts: {}, writeContracts: {} }

export type BaseContractReturnType = {
  fetchContractsForChain: (provider: providers.BaseProvider) => Promise<ContractsReturnType>;
  readContracts: Record<string, Contract>;
  writeContracts: Record<string, Contract>;
};

export type ContractsReturnType = Pick<BaseContractReturnType, 'readContracts' | 'writeContracts'>;

export const ContractsContext = React.createContext({} as BaseContractReturnType);

export const useContracts = (): ContractsReturnType => {
  const contractsContext = useContext(ContractsContext);

  if (contractsContext === undefined) {
    throw new Error('useContracts must be used within a contractsContext.Provider');
  }

  return contractsContext;
};

export const useContractsForChain = (provider: providers.BaseProvider): ContractsReturnType | undefined => {
  const [contracts, setContracts] = useState<ContractsReturnType>(emptyContract);
  const contractsContext = useContext(ContractsContext);

  const contractLoad = useCallback(async () => {
    const _contracts = await contractsContext.fetchContractsForChain(provider)

    setContracts(_contracts);
  }, [contractsContext, provider]);

  useEffect(() => {
    contractLoad();
  }, [provider, contractLoad])

  if (contractsContext === undefined) {
    throw new Error('useContracts must be used within a contractsContext.Provider');
  }

  return contracts;
};

interface Props {
  children: ReactNode
}

const ContractsProvider: FC<Props> = ({ children }) => {
  const userProvider = useProvider();
  const { data: signer } = useSigner();
  const [contracts, setContracts] = useState(emptyContract);

  const fetchContractsForChain = useCallback(async (provider: providers.BaseProvider): Promise<ContractsReturnType> => {
    // parse through all the contract data and return particular contracts for this chain
    const isUserProvider = provider === userProvider;
    const chainId = (await provider.getNetwork()).chainId as any;

    if (chainId && (provider || signer)) {
      // compile contracts here

      if (!rawContractData[chainId]) {
        // TODO : Only enable in debug mode
        // throw new Error('No contracts for this network');
        return emptyContract
      }

      const chainName: string = Object.keys(rawContractData[chainId])[0];

      const contractsData = Object.keys(rawContractData[chainId][chainName].contracts)

      const compiledContracts = (contractsData || []).reduce<ContractsReturnType>(
        (acc, contractName) => {

          const { address, abi } = rawContractData[chainId][chainName].contracts[contractName];
          if (provider) {
            acc.readContracts[contractName] = new Contract(address, abi, provider);
          }

          // if there's a signer and default provider is from user
          if (signer && isUserProvider) {
            acc.writeContracts[contractName] = new Contract(address, abi, signer);
          }

          return acc;
        },
        { readContracts: {}, writeContracts: {} } as ContractsReturnType
      );

      return compiledContracts;
    }

    return { readContracts: {}, writeContracts: {} };
  }, [signer, userProvider]);

  const handleDefaultContracts = useCallback(async () => {
    const _contracts = await fetchContractsForChain(userProvider);
    setContracts(_contracts);
  }, [fetchContractsForChain, userProvider])

  useEffect(() => {
    handleDefaultContracts();
  }, [userProvider, signer, handleDefaultContracts])

  return <ContractsContext.Provider value={{ fetchContractsForChain, ...contracts }}>{children}</ContractsContext.Provider>;
};

export default ContractsProvider;
