import { initializeConnector } from '@web3-react/core'
import { WalletConnect } from '@web3-react/walletconnect-v2'

const chains = [1, 5, 11155111] // Mainnet, Goerli, Sepolia
const projectId = 'YOUR_WALLET_CONNECT_PROJECT_ID' // Get from https://cloud.walletconnect.com

export const [walletConnect, hooks] = initializeConnector(
  (actions) =>
    new WalletConnect({
      actions,
      options: {
        projectId,
        chains,
        showQrModal: true,
        rpcMap: {
          1: 'https://eth.public-rpc.com',
          5: 'https://eth-goerli.public-rpc.com',
          11155111: 'https://eth-sepolia.public-rpc.com',
        },
      },
    }),
)
