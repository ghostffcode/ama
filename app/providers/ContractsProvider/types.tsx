import { ContractInterface, providers, Signer } from 'ethers';

export type HardhatContractType = {
  [key: string]: {
    [chainName: string]: {
      name?: string,
      chainId?: string,
      contracts: {
        [contractName: string]: {
          address: string,
          abi: ContractInterface
        }
      }
    }
  }
}

export type ExternalContractType = {
  [name: string]: {
    abi: ContractInterface;
    address: string;
  }
}

export type ProviderType = providers.BaseProvider | Signer;