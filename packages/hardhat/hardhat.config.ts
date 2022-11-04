import 'dotenv/config'

import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'

import 'hardhat-deploy'
import 'hardhat-gas-reporter'
import 'hardhat-abi-exporter'

import { HardhatEthersHelpers } from '@nomiclabs/hardhat-ethers/types'
import { TransactionRequest } from '@ethersproject/abstract-provider'

import { ethers as ethersModule, Signer, utils } from 'ethers'
import fs from 'fs'
import chalk from 'chalk'

import qrcode from 'qrcode-terminal'

// import '@typechain/hardhat';
// import * as tdly from "@tenderly/hardhat-tenderly";
// tdly.setup();

const { isAddress, getAddress, formatUnits, parseUnits } = utils

/*
      📡 This is where you configure your deploy configuration for 🏗 scaffold-eth

      check out `packages/scripts/deploy.js` to customize your deployment

      out of the box it will auto deploy anything in the `contracts` folder and named *.sol
      plus it will use *.args for constructor args
*/

//
// Select the network you want to deploy to here:
//
const defaultNetwork = 'localhost'

const mainnetGwei = 21

const DEBUG = false

function mnemonic() {
  try {
    return fs.readFileSync('./mnemonic.txt').toString().trim()
  } catch (e) {
    if (defaultNetwork !== 'localhost') {
      console.log(
        '☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`.'
      )
    }
  }
  return ''
}

type Networks = {
  [key: string]: {
    url?: string,
    gasPrice?: number,
    accounts?: {
      mnemonic: string,
    },
  },
}

const config = {
  defaultNetwork,

  /**
   * gas reporter configuration that let's you know
   * an estimate of gas for contract deployments and function calls
   * More here: https://hardhat.org/plugins/hardhat-gas-reporter.html
   */
  gasReporter: {
    currency: 'USD',
    coinmarketcap: process.env.COINMARKETCAP || undefined,
  },

	typechain: {
		outDir: 'typechain',
		target: 'ethers-v5',
	},

  // if you want to deploy to a testnet, mainnet, or xdai, you will need to configure:
  // 1. An Infura key (or similar)
  // 2. A private key for the deployer
  // DON'T PUSH THESE HERE!!!
  // An `example.env` has been provided in the Hardhat root. Copy it and rename it `.env`
  // Follow the directions, and uncomment the network you wish to deploy to.

  networks: {
    localhost: {
      url: 'http://localhost:8545',
      /*      
        notice no mnemonic here? it will just use account 0 of the hardhat node to deploy
        (you can put in a mnemonic here to set the deployer locally)
      
      */
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad',
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    kovan: {
      url: 'https://kovan.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad',
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    mainnet: {
      url: 'https://cloudflare-eth.com/',
      gasPrice: mainnetGwei * 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    ropsten: {
      url: 'https://ropsten.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad',
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    goerli: {
      url: 'https://goerli.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad',
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    xdai: {
      url: 'https://rpc.xdaichain.com/',
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    fantom: {
      url: 'https://rpcapi.fantom.network',
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    testnetFantom: {
      url: 'https://rpc.testnet.fantom.network',
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    polygon: {
      url: 'https://polygon-rpc.com',
      gasPrice: 3200000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com',
      gasPrice: 3200000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    matic: {
      url: 'https://rpc-mainnet.maticvigil.com/',
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    optimism: {
      url: 'https://mainnet.optimism.io',
      accounts: {
        mnemonic: mnemonic(),
      },
      companionNetworks: {
        l1: 'mainnet',
      },
    },
    kovanOptimism: {
      url: 'https://kovan.optimism.io',
      accounts: {
        mnemonic: mnemonic(),
      },
      companionNetworks: {
        l1: 'kovan',
      },
    },
    localOptimism: {
      url: 'http://localhost:8545',
      accounts: {
        mnemonic: mnemonic(),
      },
      companionNetworks: {
        l1: 'localOptimismL1',
      },
    },
    localOptimismL1: {
      url: 'http://localhost:9545',
      gasPrice: 0,
      accounts: {
        mnemonic: mnemonic(),
      },
      companionNetworks: {
        l2: 'localOptimism',
      },
    },
    localAvalanche: {
      url: 'http://localhost:9650/ext/bc/C/rpc',
      gasPrice: 225000000000,
      chainId: 43112,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    fujiAvalanche: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    mainnetAvalanche: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      gasPrice: 225000000000,
      chainId: 43114,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    testnetHarmony: {
      url: 'https://api.s0.b.hmny.io',
      gasPrice: 1000000000,
      chainId: 1666700000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    mainnetHarmony: {
      url: 'https://api.harmony.one',
      gasPrice: 1000000000,
      chainId: 1666600000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    moonbeam: {
      url: 'https://rpc.api.moonbeam.network',
      chainId: 1284,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    moonriver: {
      url: 'https://rpc.api.moonriver.moonbeam.network',
      chainId: 1285,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    moonbaseAlpha: {
      url: 'https://rpc.api.moonbase.moonbeam.network',
      chainId: 1287,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    moonbeamDevNode: {
      url: 'http://127.0.0.1:9933',
      chainId: 1281,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.4',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.6.7',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  ovm: {
    solcVersion: '0.7.6',
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
  etherscan: {
    apiKey: {
      mainnet: 'DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW',
      // add other network's API key here
    },
  },
  abiExporter: {
    path: '../app/contracts/ABI',
    runOnCompile: true,
    clear: true,
    flat: true,
    only: [],
    spacing: 2,
    pretty: false,
  },
}

function debug(text: string) {
  if (DEBUG) {
    console.log(text)
  }
}

task('wallet', 'Create a wallet (pk) link', async (_, { ethers }) => {
  const randomWallet = ethers.Wallet.createRandom()
  const privateKey = randomWallet._signingKey().privateKey
  console.log('🔐 WALLET Generated as ' + randomWallet.address + '')
  console.log('🔗 http://localhost:3000/pk#' + privateKey)
})

task('fundedwallet', 'Create a wallet (pk) link and fund it with deployer?')
  .addOptionalParam('amount', 'Amount of ETH to send to wallet after generating')
  .addOptionalParam('url', 'URL to add pk to')
  .setAction(async (taskArgs, { network, ethers }) => {
    const randomWallet = ethers.Wallet.createRandom()
    const privateKey = randomWallet._signingKey().privateKey
    console.log('🔐 WALLET Generated as ' + randomWallet.address + '')
    const url = taskArgs.url ? taskArgs.url : 'http://localhost:3000'

    let localDeployerMnemonic
    try {
      const localDeployerMnemonicBuffer = fs.readFileSync('./mnemonic.txt')
      localDeployerMnemonic = localDeployerMnemonicBuffer.toString().trim()
    } catch (e) {
      /* do nothing - this file isn't always there */
    }

    const amount = taskArgs.amount ? taskArgs.amount : '0.01'
    const tx = {
      to: randomWallet.address,
      value: ethers.utils.parseEther(amount),
    }

    // SEND USING LOCAL DEPLOYER MNEMONIC IF THERE IS ONE
    // IF NOT SEND USING LOCAL HARDHAT NODE:
    if (localDeployerMnemonic) {
      let deployerWallet = ethers.Wallet.fromMnemonic(localDeployerMnemonic)
      deployerWallet = deployerWallet.connect(ethers.provider)
      console.log('💵 Sending ' + amount + ' ETH to ' + randomWallet.address + ' using deployer account')
      const sendresult = await deployerWallet.sendTransaction(tx)
      console.log('\n' + url + '/pk#' + privateKey + '\n')
    } else {
      console.log('💵 Sending ' + amount + ' ETH to ' + randomWallet.address + ' using local node')
      console.log('\n' + url + '/pk#' + privateKey + '\n')
      return send(ethers.provider.getSigner(), tx)
    }
  })

task('generate', 'Create a mnemonic for builder deploys', async (_, { ethers }) => {
  const bip39 = require('bip39')
  const { hdkey } = require('ethereumjs-wallet')
  const EthUtil = require('ethereumjs-util')
  const mnemonic = bip39.generateMnemonic()
  if (DEBUG) console.log('mnemonic', mnemonic)
  const seed = await bip39.mnemonicToSeed(mnemonic)
  if (DEBUG) console.log('seed', seed)
  const hdwallet = hdkey.fromMasterSeed(seed)
  const wallet_hdpath = "m/44'/60'/0'/0/"
  const account_index = 0
  const fullPath = wallet_hdpath + account_index
  if (DEBUG) console.log('fullPath', fullPath)
  const wallet = hdwallet.derivePath(fullPath).getWallet()
  const privateKey = '0x' + wallet.getPrivateKeyString()
  if (DEBUG) console.log('privateKey', privateKey)
  const address = '0x' + EthUtil.privateToAddress(wallet.getPrivateKey()).toString('hex')
  console.log('🔐 Account Generated as ' + address + ' and set as mnemonic in packages/hardhat')
  console.log("💬 Use 'yarn run account' to get more information about the deployment account.")

  fs.writeFileSync('./' + address + '.txt', mnemonic.toString())
  fs.writeFileSync('./mnemonic.txt', mnemonic.toString())
})

task('account', 'Get balance informations for the deployment account.', async (_, { ethers }) => {
  try {
    const bip39 = require('bip39')
    const EthUtil = require('ethereumjs-util')
    const { hdkey } = require('ethereumjs-wallet')
    const mnemonic = fs.readFileSync('./mnemonic.txt').toString().trim()
    if (DEBUG) console.log('mnemonic', mnemonic)
    const seed = await bip39.mnemonicToSeed(mnemonic)
    if (DEBUG) console.log('seed', seed)
    const hdwallet = hdkey.fromMasterSeed(seed)
    const wallet_hdpath = "m/44'/60'/0'/0/"
    const account_index = 0
    const fullPath = wallet_hdpath + account_index
    if (DEBUG) console.log('fullPath', fullPath)
    const wallet = hdwallet.derivePath(fullPath).getWallet()
    const privateKey = '0x' + wallet.getPrivateKeyString()
    if (DEBUG) console.log('privateKey', privateKey)
    const address = '0x' + EthUtil.privateToAddress(wallet.getPrivateKey()).toString('hex')

    qrcode.generate(address)
    console.log('‍📬 Deployer Account is ' + address)

    const networks: Networks = config.networks;

    for (const n in networks) {
      try {
        const url = networks[n].url;
        if (url) {
          const provider = new ethers.providers.JsonRpcProvider(url)
          const balance = await provider.getBalance(address)
          console.log(' -- ' + n + ' --  -- -- 📡 ')
          console.log('   balance: ' + ethers.utils.formatEther(balance))
          console.log('   nonce: ' + (await provider.getTransactionCount(address)))
        }
      } catch (e) {
        if (DEBUG) {
          console.log(e)
        }
      }
    }
  } catch (err) {
    console.log(`--- Looks like there is no mnemonic file created yet.`)
    console.log(`--- Please run ${chalk.greenBright('yarn generate')} to create one`)
  }
})

async function addr(ethers: typeof ethersModule & HardhatEthersHelpers, address: string): Promise<string> {
  if (isAddress(address)) {
    return getAddress(address)
  }
  const accounts = await ethers.provider.listAccounts()
  if (accounts.includes(address)) {
    return address
  }
  throw `Could not normalize address: ${addr}`
}

task('accounts', 'Prints the list of accounts', async (_, { ethers }) => {
  const accounts = await ethers.provider.listAccounts()
  accounts.forEach((account) => console.log(account))
})

task('blockNumber', 'Prints the block number', async (_, { ethers }) => {
  const blockNumber = await ethers.provider.getBlockNumber()
  console.log(blockNumber)
})

task('balance', "Prints an account's balance")
  .addPositionalParam('account', "The account's address")
  .setAction(async (taskArgs, { ethers }) => {
    const balance = await ethers.provider.getBalance(await addr(ethers, taskArgs.account))
    console.log(formatUnits(balance, 'ether'), 'ETH')
  })

async function send(signer: Signer, txparams: TransactionRequest) {
  try {
    const transactionHash = signer.sendTransaction(txparams);
    debug(`transactionHash: ${transactionHash}`)

    return transactionHash;
  } catch (error) {
    debug(`Error: ${error}`)
  }
}

task('send', 'Send ETH')
  .addParam('from', 'From address or account index')
  .addOptionalParam('to', 'To address or account index')
  .addOptionalParam('amount', 'Amount to send in ether')
  .addOptionalParam('data', 'Data included in transaction')
  .addOptionalParam('gasPrice', 'Price you are willing to pay in gwei')
  .addOptionalParam('gasLimit', 'Limit of how much gas to spend')

  .setAction(async (taskArgs, { network, ethers }) => {
    const from = await addr(ethers, taskArgs.from)
    debug(`Normalized from address: ${from}`)
    const fromSigner = await ethers.provider.getSigner(from)

    let to
    if (taskArgs.to) {
      to = await addr(ethers, taskArgs.to)
      debug(`Normalized to address: ${to}`)
    }

    const txRequest = {
      from: await fromSigner.getAddress(),
      to,
      value: parseUnits(taskArgs.amount ? taskArgs.amount : '0', 'ether').toHexString(),
      nonce: await fromSigner.getTransactionCount(),
      gasPrice: parseUnits(taskArgs.gasPrice ? taskArgs.gasPrice : '1.001', 'gwei').toHexString(),
      gasLimit: taskArgs.gasLimit ? taskArgs.gasLimit : 24000,
      chainId: network.config.chainId,
      data: undefined
    }

    if (taskArgs.data !== undefined) {
      txRequest.data = taskArgs.data
      debug(`Adding data to payload: ${txRequest.data}`)
    }
    debug(formatUnits(txRequest.gasPrice, "gwei") + ' gwei')
    debug(JSON.stringify(txRequest, null, 2))

    return send(fromSigner, txRequest)
  })

  export default config;
