import { Web3ReactProvider } from '@web3-react/core'
import { metaMask, hooks as metaMaskHooks } from './connectors/metaMask'
import {
  coinbaseWallet,
  hooks as coinbaseHooks,
} from './connectors/coinbaseWallet'

export const connectors = {
  metaMask: {
    connector: metaMask,
    hooks: metaMaskHooks,
    name: 'MetaMask',
    icon: '🦊',
  },
  coinbaseWallet: {
    connector: coinbaseWallet,
    hooks: coinbaseHooks,
    name: 'Coinbase Wallet',
    icon: '📱',
  },
}

export default function Web3ProviderWrapper({ children }) {
  return (
    <Web3ReactProvider
      connectors={[
        [metaMask, metaMaskHooks],
        [coinbaseWallet, coinbaseHooks],
      ]}
    >
      {children}
    </Web3ReactProvider>
  )
}
