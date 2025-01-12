import { initializeConnector } from '@web3-react/core'
import { CoinbaseWallet } from '@web3-react/coinbase-wallet'

export const [coinbaseWallet, hooks] = initializeConnector(
  (actions) =>
    new CoinbaseWallet({
      actions,
      options: {
        url: 'https://eth.public-rpc.com',
        appName: 'SHINE DARK',
      },
    }),
)
