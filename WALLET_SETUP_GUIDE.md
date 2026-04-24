# TRON WalletConnect Integration - Setup Guide

## Quick Start

This guide will help you integrate the TRON WalletConnect system into your application.

### Step 1: Files Created

The following files have been created for you:

```
src/
├── utils/
│   └── walletConnector.ts          # Core wallet connector utility
├── hooks/
│   └── useTronWallet.ts            # Custom hook for wallet state
├── context/
│   └── WalletContext.tsx           # Global wallet context
└── app/components/
    └── WalletConnect.tsx           # Updated UI component (already modified)
```

### Step 2: Update Your Main App Entry Point

In your `src/main.tsx` or the root of your app, wrap your application with `WalletProvider`:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { WalletProvider } from './context/WalletContext'
import App from './app/App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletProvider>
      <App />
    </WalletProvider>
  </React.StrictMode>,
)
```

### Step 3: Update App.tsx to Use the New Integration

Replace your current wallet connection logic in `src/app/App.tsx` with:

```typescript
import { useWallet } from '../context/WalletContext'

export default function App() {
  const { isConnected, walletAddress, balance, connect, disconnect } = useWallet()
  const [showWalletConnect, setShowWalletConnect] = useState(false)
  const [scanResults, setScanResults] = useState<ScanResults | null>(null)

  const handleInitiateScan = () => {
    setShowWalletConnect(true)
    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      })
    }, 100)
  }

  const handleScanComplete = (results: ScanResults) => {
    setScanResults(results)
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#e6e6e6]">
      <Header />
      <HeroSection onInitiateScan={handleInitiateScan} />

      {showWalletConnect && (
        <WalletConnect
          isConnected={isConnected}
          walletAddress={walletAddress}
          balance={balance}
          onConnect={connect}
          onDisconnect={disconnect}
        />
      )}

      {/* Rest of your app components */}
    </div>
  )
}
```

### Step 4: Use the Wallet Hook in Your Components

In any component that needs wallet information:

```typescript
import { useWallet } from '../context/WalletContext'

export function MyComponent() {
  const { isConnected, address, balance, connect, disconnect } = useWallet()

  return (
    <div>
      {!isConnected ? (
        <button onClick={connect}>Connect TRON Wallet</button>
      ) : (
        <div>
          <p>Connected: {address}</p>
          <p>Balance: {balance} TRX</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
    </div>
  )
}
```

## Key Features

✅ **TRON Mainnet Only** - Configured exclusively for TRON network  
✅ **Multiple Wallet Support** - TronLink and WalletConnect  
✅ **Auto-Detection** - Automatically detects available providers  
✅ **Type-Safe** - Full TypeScript support  
✅ **Global State** - Context API for app-wide access  
✅ **Error Handling** - Comprehensive error messages

## Component Props

### WalletConnect Component

```typescript
<WalletConnect
  isConnected={boolean}        // Wallet connection status
  walletAddress={string}       // Connected wallet address
  balance={string}             // Wallet balance
  onConnect={() => void}       // Called when wallet connects
  onDisconnect={() => void}    // Called when wallet disconnects
/>
```

## Hook API

### useWallet()

```typescript
const {
  // State
  isConnected: boolean
  address: string
  balance: string
  network: string
  error: string | null
  loading: boolean

  // Methods
  connect: () => Promise<void>
  connectWithProvider: (provider: 'tronlink' | 'walletconnect') => Promise<void>
  disconnect: () => Promise<void>
} = useWallet()
```

## Wallet Connection Flow

1. User clicks "Connect Wallet" button
2. System auto-detects available providers (TronLink, WalletConnect)
3. Attempts connection with TronLink first
4. Falls back to WalletConnect if TronLink not available
5. If both fail, shows provider selection UI

## Network Configuration

- **Chain ID**: 0x2b6653dc
- **Network**: TRON Mainnet
- **RPC**: https://api.trongrid.io
- **Currency**: TRX (6 decimals)

## Common Use Cases

### Use Case 1: Require Wallet for Feature

```typescript
function SecureFeature() {
  const { isConnected, address } = useWallet()

  if (!isConnected) {
    return <p>Please connect your wallet to use this feature</p>
  }

  return <YourFeature address={address} />
}
```

### Use Case 2: Display Wallet Status

```typescript
function Header() {
  const { isConnected, address, balance } = useWallet()

  return (
    <div>
      {isConnected && (
        <div>
          {address.slice(0, 6)}...{address.slice(-6)}
          <span>{balance} TRX</span>
        </div>
      )}
    </div>
  )
}
```

### Use Case 3: Run Scan Only When Connected

```typescript
function Scanner() {
  const { isConnected, address } = useWallet()
  const [scanning, setScanning] = useState(false)

  const handleScan = async () => {
    if (!isConnected) return

    setScanning(true)
    try {
      const results = await performScan(address)
      // Handle results
    } finally {
      setScanning(false)
    }
  }

  return (
    <button onClick={handleScan} disabled={!isConnected || scanning}>
      {scanning ? 'Scanning...' : 'Start Scan'}
    </button>
  )
}
```

## Troubleshooting

### "TronLink not detected"

- Install [TronLink extension](https://www.tronlink.org/)
- Refresh the page
- Check if extension is enabled in browser settings

### Connection fails after successful earlier attempt

- Check if TronLink/WalletConnect wallet is locked
- Verify TRON Mainnet is selected in wallet settings
- Clear browser cache and try again

### Balance shows 0

- Ensure wallet has TRON tokens (TRX)
- Check network connectivity
- Verify address is valid TRON address

## Testing

### Test with Mock Data

For development, you can mock wallet connection:

```typescript
// In walletConnector.ts, add:
if (process.env.NODE_ENV === "development" && !realWallet) {
  return {
    address: "TX...",
    balance: "1000.00",
    network: "TRON MAINNET",
  };
}
```

### Test with Real Wallet

1. Install TronLink extension
2. Create test wallet with testnet funds
3. Ensure extension has access to the page
4. Test connection flow

## Best Practices

1. **Always check `isConnected`** before using address/balance
2. **Handle loading state** - show spinner during connection
3. **Display errors** - inform user of connection issues
4. **Validate addresses** - use provided validation functions
5. **Cache wallet state** - use Context API to avoid repeated queries
6. **Error boundaries** - wrap components with error handling

## Security Notes

- Only connects to TRON Mainnet
- Validates addresses before use
- All wallet operations are validated
- Never stores sensitive wallet data
- Uses only read-only wallet operations

## Next Steps

1. Wrap your app with `WalletProvider` (Step 2 above)
2. Update `App.tsx` to use the wallet hook (Step 3 above)
3. Update components to use `useWallet()` hook
4. Test with TronLink extension
5. Test with WalletConnect

## Documentation

For complete API documentation, see [TRON_WALLET_INTEGRATION.md](./TRON_WALLET_INTEGRATION.md)

For usage examples, see [WalletConnect.example.tsx](./src/app/components/WalletConnect.example.tsx)

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the example file for usage patterns
3. Check TRON documentation: https://tronprotocol.github.io/
4. Check TronLink docs: https://www.tronlink.org/
