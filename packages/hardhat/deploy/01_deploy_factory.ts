// deploy/00_deploy_your_contract.js

import { ethers } from 'hardhat'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const localChainId = '31337'

const contractDeploy: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  getChainId,
}: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = await getChainId()
  const waitConfirmations = chainId === localChainId ? 1 : 5

  // Deploy Implementation outside of Factory

  // await deploy('Implementation', {
  //   from: deployer,
  //   log: true,
  //   autoMine: true,
  //   waitConfirmations,
  //   args: [10],
  //   proxy: "initialize"
  // })

  // const Implementation = await ethers.getContract('Implementation', deployer)

  await deploy('Factory', {
    from: deployer,
    args: [40],
    log: true,
    autoMine: true,
    waitConfirmations,
  })

  // Getting a previously deployed contract
  const Factory = await ethers.getContract('Factory', deployer)

  // Verify from the command line by running `yarn verify`

  // You can also Verify your contracts with Etherscan here...
  // You don't want to verify on localhost
  // try {
  //   if (chainId !== localChainId) {
  //     await run('verify:verify', {
  //       address: YourContract.address,
  //       contract: 'contracts/YourContract.sol:YourContract',
  //       constructorArguments: [],
  //     })
  //   }
  // } catch (error) {
  //   console.error(error)
  // }
}

export default contractDeploy
contractDeploy.tags = ['Factory']
