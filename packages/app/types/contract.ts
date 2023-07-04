export interface Contract {
  [key: string]: {
    name: string
    chainId: string
    contracts: {
      [key: string]: {
        address: `0x${string}`
        abi: any[]
      }
    }
  }[]
}