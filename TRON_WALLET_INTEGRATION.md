# TRON WalletConnect Integration

This document describes the TRON Network wallet connection integration for the TRON Security Scan application.

## Overview

The integration supports wallet connections for **TRON Mainnet only** with the following features:

- 🔗 **TronLink Support**: Connect via TronLink browser extension
- 🌐 **WalletConnect Support**: Web-based wallet connection protocol
- 🔐 **TRON Mainnet Only**: Configured exclusively for TRON network (Chain ID: 0x2b6653dc)
- 📦 **Type-Safe**: Full TypeScript support
- 🎯 **Auto-Detection**: Automatically detects available wallet providers
- 💾 **State Management**: Built-in wallet state management with Context API

## Architecture

### Components & Files

1. **`src/utils/walletConnector.ts`** - Core wallet connector utility
   - Handles TronLink and WalletConnect connections
   - Manages TRON network configuration
   - Provides address validation and balance fetching

2. **`src/hooks/useTronWallet.ts`** - React hook for wallet state
   - Manages connection state and balance
   - Methods for connect, disconnect, and provider-specific connection
   - Auto-detection of wallet availability

3. **`src/context/WalletContext.tsx`** - Global wallet context
   - Provides wallet state to entire app
   - Eliminates prop drilling
   - Centralized state management

4. **`src/app/components/WalletConnect.tsx`** - UI component
   - Displays connection panel
   - Shows connected wallet info
   - Provides provider selection UI

## Usage

### Basic Setup

Wrap your app with the `WalletProvider`:

```typescript
import { WalletProvider } from './context/WalletContext';

export default function App() {
  return (
    <WalletProvider>
      <YourAppComponents />
    </WalletProvider>
  );
}
```

### Using the Wallet Hook

```typescript
import { useWallet } from './context/WalletContext';

function MyComponent() {
  const { isConnected, address, balance, connect, disconnect } = useWallet();

  return (
    <div>
      {!isConnected ? (
        <button onClick={connect}>Connect Wallet</button>
      ) : (
        <div>
          <p>Address: {address}</p>
          <p>Balance: {balance} TRX</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
}
```

### Using WalletConnect Component

```typescript
import { WalletConnect } from './components/WalletConnect';

function MyScreen() {
  const { isConnected, walletAddress, balance } = useWallet();

  return (
    <WalletConnect
      isConnected={isConnected}
      walletAddress={walletAddress}
      balance={balance}
      onConnect={handleConnect}
      onDisconnect={handleDisconnect}
    />
  );
}
```

## Supported Wallet Providers

### 1. TronLink

- **Type**: Browser Extension
- **Installation**: https://www.tronlink.org/
- **Priority**: Primary (tried first)

### 2. WalletConnect

- **Type**: Web-based Connector
- **Support**: Any wallet supporting WalletConnect protocol
- **Priority**: Secondary (fallback)

## Wallet Connection Flow

```
1. User clicks "Connect Wallet"
   ↓
2. App auto-detects available providers
   ↓
3. Try TronLink → Success? Return
   ↓ Fail
4. Try WalletConnect → Success? Return
   ↓ Fail
5. Show provider selection UI or error
```

## API Reference

### `TronWalletConnector` Class

#### Methods

- `detectProviders()` - Returns available wallet providers
- `connectTronLink()` - Connect via TronLink extension
- `connectWalletConnect()` - Connect via WalletConnect
- `disconnect()` - Disconnect wallet
- `getCurrentAddress()` - Get currently connected address
- `isValidTronAddress(address)` - Validate TRON address format
- `getTronNetworkInfo()` - Get TRON network configuration

### `useTronWallet()` Hook

#### State Properties

```typescript
{
  isConnected: boolean; // Connection status
  address: string; // Wallet address
  balance: string; // Balance in TRX
  network: string; // Network name
  error: string | null; // Error message
  loading: boolean; // Loading state
}
```

#### Methods

```typescript
connect(); // Auto-detect and connect
connectWithProvider(provider); // Connect with specific provider
disconnect(); // Disconnect wallet
```

### `useWallet()` Context Hook

Returns all properties from `useTronWallet()` hook.

## TRON Network Configuration

- **Chain ID**: 0x2b6653dc
- **Chain Name**: TRON Mainnet
- **Network**: mainnet
- **RPC URL**: https://api.trongrid.io
- **Native Currency**: TRX (decimals: 6)

## Error Handling

Common errors and handling:

```typescript
const { connect, error } = useWallet();

try {
  await connect();
} catch (err) {
  if (err.message.includes("TronLink")) {
    console.log("TronLink not installed");
  } else if (err.message.includes("WalletConnect")) {
    console.log("WalletConnect failed");
  }
}
```

## Type Definitions

```typescript
interface TronWallet {
  address: string; // Base58 encoded address
  balance: string; // Balance in TRX
  network: string; // "TRON MAINNET"
}

interface WalletState {
  isConnected: boolean;
  address: string;
  balance: string;
  network: string;
  error: string | null;
  loading: boolean;
}
```

## Security Considerations

1. **TRON Only**: This integration only connects to TRON Mainnet
2. **Extension Validation**: TronLink is verified before use
3. **Address Validation**: TRON addresses are validated using regex pattern
4. **Error Messages**: Security-sensitive errors are caught and reported safely

## Troubleshooting

### Wallet not detected

- Ensure TronLink extension is installed
- Refresh the page
- Restart the browser

### Connection fails

- Check TronLink is unlocked
- Verify TRON network is selected in TronLink
- Clear browser cache

### Balance not updating

- Verify the address has TRON network access
- Check network connectivity to https://api.trongrid.io

## Examples

### Example: Smart Scan with Wallet

```typescript
function ScanComponent() {
  const { isConnected, address, connect } = useWallet();

  const handleScan = async () => {
    if (!isConnected) {
      await connect();
      return;
    }
    // Proceed with scan using address
  };

  return <button onClick={handleScan}>Scan</button>;
}
```

### Example: Display Wallet Info

```typescript
function WalletInfo() {
  const { isConnected, address, balance, disconnect } = useWallet();

  if (!isConnected) return <p>Not connected</p>;

  return (
    <div>
      <p>Address: {address}</p>
      <p>Balance: {balance} TRX</p>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}
```

## Future Enhancements

- [ ] Add testnet support
- [ ] Implement token balance checking
- [ ] Add transaction signing support
- [ ] Support for hardware wallets
- [ ] Multi-provider UI selector
- [ ] Persistent connection state (localStorage)

## References

- [TRON Documentation](https://tronprotocol.github.io/)
- [TronLink Documentation](https://www.tronlink.org/)
- [TronWeb API](https://github.com/tronprotocol/tronweb)
