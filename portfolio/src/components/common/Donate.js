import { useState, useEffect, useRef } from 'react'
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
  10: 'Optimism Mainnet',
  11155111: 'Sepolia',
  59144: 'Linea Mainnet',
}

function Donate() {
  const [selectedConnector, setSelectedConnector] = useState(null)
  const [showWalletOptions, setShowWalletOptions] = useState(false)

  // Add ref for the modal
  const modalRef = useRef(null)

  // Add useEffect for click outside handling
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowWalletOptions(false)
      }
    }

    if (showWalletOptions) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showWalletOptions])

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

  // Add new state for connection status
  const [connectionPending, setConnectionPending] = useState(false)

  const handleWalletSelect = async (connectorKey) => {
    try {
      setConnectionPending(true)
      setError(null)

      const connector = connectors[connectorKey].connector

      // Attempt to connect
      await connector.activate()

      // Get provider and accounts after successful connection
      let provider
      let accounts

      try {
        if (window.ethereum) {
          provider = window.ethereum
          accounts = await window.ethereum.request({ method: 'eth_accounts' })
        } else if (connector.provider) {
          provider = connector.provider
          accounts = await provider.request({ method: 'eth_accounts' })
        }

        if (!accounts?.length) {
          throw new Error('No accounts found')
        }

        // If we get here, connection was successful
        localStorage.setItem('connected', connectorKey)
        setSelectedConnector(connectorKey)
        setShowWalletOptions(false)

        // Subscribe to events
        provider.on('accountsChanged', handleAccountsChanged)
        provider.on('chainChanged', handleChainChanged)
        provider.on('disconnect', handleDisconnect)

        // Request signature after successful connection
        try {
          const signer = provider.getSigner?.() || provider
          const message = `Welcome to SHINE DARK!\n\nThis signature is used to verify that you are the owner of this wallet.\n\nThis will not trigger a blockchain transaction or cost any gas fees.\n\nTimestamp: ${new Date().toISOString()}`

          const signature = await signer.signMessage?.(message)
          if (signature) {
            setSignatureStatus(
              'Successfully connected and verified wallet ownership!',
            )
          }
        } catch (signError) {
          // If signature fails, we still want to keep the connection
          console.warn('Signature failed:', signError)
          setSignatureStatus('Connected without signature verification')
        }
      } catch (error) {
        // If anything fails after initial connection, cleanup
        await handleDisconnect()
        throw error
      }
    } catch (error) {
      console.error('Connection error:', error)
      let errorMessage = 'Failed to connect wallet.'

      if (error.code === 4001) {
        errorMessage = 'Connection rejected by user'
      } else if (error.code === -32002) {
        errorMessage = 'Please check your wallet - connection already pending'
      } else if (error.message?.includes('No accounts found')) {
        errorMessage = 'Please unlock your wallet and try again'
      }

      setError(errorMessage)
      await handleDisconnect()
    } finally {
      setConnectionPending(false)
    }
  }

  // Handle account changes
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      handleDisconnect()
    } else {
      // Update the current account
      // This will trigger a re-render through your web3-react hooks
    }
  }

  // Handle chain changes
  const handleChainChanged = (chainId) => {
    // Force a page refresh when chain changes
    // This is recommended by MetaMask
    window.location.reload()
  }

  // Cleanup listeners on unmount
  useEffect(() => {
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
        window.ethereum.removeListener('disconnect', handleDisconnect)
      }
    }
  }, [])

  const handleConnect = () => {
    setError(null) // Clear any previous errors
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

  const [balance, setBalance] = useState(null)

  useEffect(() => {
    const getBalanceDisplay = async () => {
      if (!isActive || !provider || !accounts?.[0]) return null
      try {
        const balance = await provider.getBalance(accounts[0])
        const formattedBalance = formatEther(balance.toString())
        const displayBalance = Number(formattedBalance)
          .toFixed(4)
          .replace(/\.?0+$/, '')
        return `Balance: ${displayBalance} ETH`
      } catch (error) {
        console.error('Error getting balance:', error)
        return null
      }
    }

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
      <div className="donate-header">
        <h2>Donate</h2>
        <p>to continue the vision</p>
      </div>
      {!isActive ? (
        <>
          <button
            onClick={handleConnect}
            disabled={connectionPending || isActivating}
            className="connect-button"
          >
            {connectionPending
              ? 'Connecting...'
              : isActivating
              ? 'Activating...'
              : 'Connect Wallet'}
          </button>
          {showWalletOptions && (
            <div className="wallet-options" ref={modalRef}>
              {Object.entries(connectors).map(([key, { name, icon }]) => (
                <button
                  key={key}
                  onClick={() => handleWalletSelect(key)}
                  disabled={connectionPending}
                  className="wallet-option-button"
                >
                  <span className="wallet-icon">{icon}</span>
                  {name}
                  {connectionPending && key === selectedConnector && (
                    <span className="connecting-indicator">Connecting...</span>
                  )}
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
            {loading ? 'Processing...' : 'Donate to continue the vision'}
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
