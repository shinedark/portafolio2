import { useState, useEffect } from 'react'
import { parseEther, formatEther } from 'ethers'
import { connectors } from '../../providers/Web3Provider'
import './Donate.css'

const RECIPIENT_ADDRESS = process.env.REACT_APP_RECIPIENT_ADDRESS
if (!RECIPIENT_ADDRESS) {
  throw new Error('REACT_APP_RECIPIENT_ADDRESS environment variable is not set')
}

// Supported chains
const SUPPORTED_CHAINS = {
  1: 'Ethereum Mainnet',
  5: 'Goerli Testnet',
  11155111: 'Sepolia',
}

function Donate() {
  const [selectedConnector, setSelectedConnector] = useState(null)
  const [showWalletOptions, setShowWalletOptions] = useState(false)

  // Get hooks for selected connector
  const hooks = selectedConnector
    ? connectors[selectedConnector].hooks
    : connectors.metaMask.hooks
  const {
    useChainId,
    useAccounts,
    useIsActivating,
    useIsActive,
    useProvider,
  } = hooks

  const chainId = useChainId()
  const accounts = useAccounts()
  const isActivating = useIsActivating()
  const isActive = useIsActive()
  const provider = useProvider()

  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [signatureStatus, setSignatureStatus] = useState('')
  const [error, setError] = useState(null)

  // Check if connected to supported chain
  const isChainSupported = chainId && SUPPORTED_CHAINS[chainId]

  // Get shortened address for display
  const getDisplayAddress = () => {
    if (!accounts?.[0]) return ''
    return `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`
  }

  const handleWalletSelect = async (connectorKey) => {
    try {
      setError(null)
      setSelectedConnector(connectorKey)
      const connector = connectors[connectorKey].connector
      await connector.activate()
      setShowWalletOptions(false)
    } catch (error) {
      console.error('Error connecting:', error)
      setError('Failed to connect wallet. Please try again.')
    }
  }

  const handleConnect = () => {
    setShowWalletOptions(true)
  }

  const handleDisconnect = async () => {
    try {
      setError(null)
      // Reset all state variables
      setAmount('')
      setSignatureStatus('')
      setBalance(null)
      setShowWalletOptions(false)

      if (selectedConnector) {
        const connector = connectors[selectedConnector].connector
        await connector.resetState()
        await connector.deactivate?.() // Call deactivate if available
        setSelectedConnector(null)
      }

      // Clear any stored connection data
      localStorage.removeItem('connected')
      localStorage.removeItem('walletconnect') // Clear WalletConnect data if present

      // Force provider disconnect if available
      if (provider?.disconnect) {
        await provider.disconnect()
      }
    } catch (error) {
      console.error('Error disconnecting:', error)
      setError('Failed to disconnect wallet.')
    }
  }

  useEffect(() => {
    // Show error if connected to unsupported chain
    if (isActive && !isChainSupported) {
      setError(
        `Please switch to a supported network (${Object.values(
          SUPPORTED_CHAINS,
        ).join(', ')})`,
      )
    } else {
      setError(null)
    }
  }, [chainId, isActive, isChainSupported])

  // Try to connect eagerly with MetaMask if available
  useEffect(() => {
    if (connectors.metaMask?.connector) {
      connectors.metaMask.connector.connectEagerly().catch(() => {
        console.debug('Failed to connect eagerly to metamask')
      })
    }
  }, [])

  // Handle chain switching
  const switchChain = async (targetChainId) => {
    try {
      if (!selectedConnector) return
      await connectors[selectedConnector].connector.activate(targetChainId)
      setError(null)
    } catch (error) {
      console.error('Error switching chain:', error)
      setError('Failed to switch network. Please try manually in your wallet.')
    }
  }

  const handleAmountChange = (e) => {
    const value = e.target.value
    if (value === '') {
      setAmount('')
      return
    }

    if (!/^\d*\.?\d*$/.test(value)) return

    const parts = value.split('.')
    if (parts[1] && parts[1].length > 18) return

    setAmount(value)
  }

  const formatAmount = (amount) => {
    if (!amount) return '0'
    try {
      // Format the amount to a maximum of 6 decimal places for display
      const formatted = Number(amount).toFixed(6)
      // Remove trailing zeros
      return formatted.replace(/\.?0+$/, '')
    } catch (error) {
      console.error('Error formatting amount:', error)
      return '0'
    }
  }

  const getBalanceDisplay = async () => {
    if (!isActive || !provider || !accounts?.[0]) return null
    try {
      const balance = await provider.getBalance(accounts[0])
      const formattedBalance = formatEther(balance.toString())
      // Format to max 4 decimal places and remove trailing zeros
      const displayBalance = Number(formattedBalance)
        .toFixed(4)
        .replace(/\.?0+$/, '')
      return `Balance: ${displayBalance} ETH`
    } catch (error) {
      console.error('Error getting balance:', error)
      return null
    }
  }

  const [balance, setBalance] = useState(null)

  useEffect(() => {
    if (isActive && provider && accounts?.[0]) {
      getBalanceDisplay().then(setBalance)
    } else {
      setBalance(null)
    }
  }, [isActive, provider, accounts, chainId])

  const handleSignMessage = async () => {
    if (!isActive || !provider) return

    try {
      setLoading(true)
      setError(null)
      const signer = provider.getSigner()

      const message = `I authorize this donation of ${formatAmount(
        amount,
      )} ETH to SHINE DARK\nAddress: ${RECIPIENT_ADDRESS}\nNetwork: ${
        SUPPORTED_CHAINS[chainId]
      }\nTimestamp: ${new Date().toISOString()}`

      const signature = await signer.signMessage(message)
      setSignatureStatus('Message signed successfully!')
      return signature
    } catch (error) {
      console.error('Error signing:', error)
      setError('Failed to sign the message. Please try again.')
      return null
    } finally {
      setLoading(false)
    }
  }

  const handleDonate = async () => {
    if (!isActive || !amount || !provider) {
      setError('Please connect your wallet and enter an amount.')
      return
    }

    if (!isChainSupported) {
      setError(
        `Please switch to a supported network (${Object.values(
          SUPPORTED_CHAINS,
        ).join(', ')})`,
      )
      return
    }

    if (parseFloat(amount) <= 0) {
      setError('Please enter a valid amount greater than 0.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const signature = await handleSignMessage()
      if (!signature) {
        setError('Signature required to proceed with donation.')
        return
      }

      const signer = provider.getSigner()

      const tx = await signer.sendTransaction({
        to: RECIPIENT_ADDRESS,
        value: parseEther(amount),
      })

      setSignatureStatus('Transaction pending...')

      const receipt = await tx.wait()

      setAmount('')
      setSignatureStatus(
        `Thank you for your donation of ${formatAmount(amount)} ETH on ${
          SUPPORTED_CHAINS[chainId]
        }! Transaction confirmed.`,
      )

      console.log('Transaction hash:', receipt.hash)
    } catch (error) {
      console.error('Transaction failed:', error)

      if (error.code === 'ACTION_REJECTED') {
        setError('Transaction was rejected. Please try again.')
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        setError('Insufficient funds for this transaction.')
      } else {
        setError('Transaction failed. Please check your wallet and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="donate-container">
      {!isActive ? (
        <>
          <button
            onClick={handleConnect}
            disabled={isActivating}
            className="connect-button"
          >
            {isActivating ? 'Connecting...' : 'Connect Wallet'}
          </button>
          {showWalletOptions && (
            <div className="wallet-options">
              {Object.entries(connectors).map(([key, { name, icon }]) => (
                <button
                  key={key}
                  onClick={() => handleWalletSelect(key)}
                  className="wallet-option-button"
                >
                  <span className="wallet-icon">{icon}</span>
                  {name}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="donation-form">
          <div className="wallet-info">
            <div className="wallet-details">
              <p className="connected-address">
                Connected: {getDisplayAddress()}
              </p>
              <p className="network-info">
                Network: {SUPPORTED_CHAINS[chainId] || 'Unsupported Network'}
              </p>
              {balance && <p className="balance-info">{balance}</p>}
            </div>
            <button onClick={handleDisconnect} className="disconnect-button">
              Disconnect
            </button>
          </div>
          {!isChainSupported && (
            <div className="network-switcher">
              {Object.entries(SUPPORTED_CHAINS).map(([id, name]) => (
                <button
                  key={id}
                  onClick={() => switchChain(Number(id))}
                  className="network-switch-button"
                >
                  Switch to {name}
                </button>
              ))}
            </div>
          )}
          <div className="amount-input-container">
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.0"
              className="amount-input"
              disabled={!isChainSupported}
            />
            <span className="eth-label">ETH</span>
          </div>
          <button
            onClick={handleDonate}
            disabled={
              loading || !amount || parseFloat(amount) <= 0 || !isChainSupported
            }
            className="donate-button"
          >
            {loading ? 'Processing...' : 'Donate'}
          </button>

          {signatureStatus && (
            <p className="status-message success">{signatureStatus}</p>
          )}

          {error && <p className="status-message error">{error}</p>}
        </div>
      )}
    </div>
  )
}

export default Donate
