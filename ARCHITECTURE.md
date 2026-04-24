# TRON WalletConnect - Architecture & Data Flow

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Your React App                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            WalletProvider (Context)                  │   │
│  │  Wraps entire app, provides wallet state globally   │   │
│  │                                                      │   │
│  │ ┌────────────────────────────────────────────────┐  │   │
│  │ │  useTronWallet() Hook                          │  │   │
│  │ │  • Manages connection state                    │  │   │
│  │ │  • Handles connect/disconnect logic            │  │   │
│  │ │  • Provides balance, address, network info     │  │   │
│  │ │                                                │  │   │
│  │ │  └─────────────────────────────────────────┘  │  │   │
│  │ │  ▼                                             │  │   │
│  │ │  TronWalletConnector (Utility)                │  │   │
│  │ │  • Detects wallet providers                   │  │   │
│  │ │  • Handles TronLink connection                │  │   │
│  │ │  • Handles WalletConnect                      │  │   │
│  │ │  • Manages TRON network config                │  │   │
│  │ │  • Fetches balance                            │  │   │
│  │ │  • Validates addresses                        │  │   │
│  │ │                                                │  │   │
│  │ │  └─────────────────────────────────────────┘  │  │   │
│  │ │  ▼                                             │  │   │
│  │ │  Wallet Providers                             │  │   │
│  │ │  ┌──────────────────────────────────────────┐ │  │   │
│  │ │  │ TronLink Extension   │ WalletConnect    │ │  │   │
│  │ │  │ (Primary)           │ (Fallback)       │ │  │   │
│  │ │  │ window.tronLink     │ window.wallet... │ │  │   │
│  │ │  └──────────────────────────────────────────┘ │  │   │
│  │ │  ▼                                             │  │   │
│  │ │  TRON Network                                 │  │   │
│  │ │  api.trongrid.io:443 (TRON Mainnet)          │  │   │
│  │ └────────────────────────────────────────────┘  │   │
│  │                                                      │   │
│  │ useWallet() Hook - Access wallet state in any     │   │
│  │ component without prop drilling                   │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Your Components                      │   │
│  │ ┌──────────────┐  ┌──────────────────────────┐  │   │
│  │ │ WalletConnect│  │  Any Other Component     │  │   │
│  │ │ Component    │  │  Using useWallet()       │  │   │
│  │ │              │  │                          │  │   │
│  │ │ • Shows UI   │  │  • Access address        │  │   │
│  │ │ • Connects   │  │  • Access balance        │  │   │
│  │ │ • Disconnects│  │  • Show wallet status    │  │   │
│  │ └──────────────┘  └──────────────────────────┘  │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 📊 Data Flow Diagram

```
User Action (Click Connect)
        │
        ▼
WalletConnect Component
        │
        ├─── handleConnect()
        │
        ▼
useWallet() Hook
        │
        ├─── connect()
        │
        ▼
useTronWallet() Hook
        │
        ├─── Detect available providers
        │
        ├─── Try TronLink
        │    ├─── Success? ──→ Return wallet data ──┐
        │    └─── Fail?    ──→ Try next provider   │
        │                                            │
        ├─── Try WalletConnect                      │
        │    ├─── Success? ──→ Return wallet data ──┤
        │    └─── Fail?    ──→ Show error UI   ──┐  │
        │                                        │  │
        ▼                                        │  │
    walletConnector.connectTronLink()           │  │
        │                                        │  │
        ├─── Check TronLink exists              │  │
        ├─── Request account access            │  │
        ├─── Get address & balance             │  │
        └─── Return TronWallet object ─────────┘  │
                                                   │
                                                   ▼
    Context State Updated (isConnected, address, balance)
                                                   │
                                                   ▼
    WalletConnect Component Re-renders
                                                   │
                                                   ▼
    Displays Connected State (Terminal UI)
```

## 🔄 Connection State Lifecycle

```
┌────────────────┐
│   Disconnected │  Initial state
└────────────────┘
       │
       │ User clicks "Connect"
       ▼
┌────────────────┐
│    Loading     │  Detecting providers, connecting...
└────────────────┘
       │
       ├─ Success
       │  ▼
       │ ┌────────────────┐
       │ │   Connected    │  Wallet connected, showing details
       │ └────────────────┘
       │      │
       │      │ User clicks "Disconnect"
       │      ▼
       │ ┌────────────────┐
       │ │  Disconnecting │  Clearing state
       │ └────────────────┘
       │      │
       └──────┴─→ ┌────────────────┐
                  │   Disconnected │  Back to initial state
                  └────────────────┘
       │
       └─ Error
          ▼
       ┌────────────────┐
       │     Error      │  Show error message & retry
       └────────────────┘
          │
          └─ User retries ──→ Loading (above)
```

## 📁 File Dependencies

```
src/
│
├── main.tsx
│   └─→ WalletProvider (from context/WalletContext.tsx)
│
├── app/
│   ├── App.tsx
│   │   └─→ useWallet() (from context/WalletContext.tsx)
│   │   └─→ WalletConnect (from components/WalletConnect.tsx)
│   │
│   └── components/
│       ├── WalletConnect.tsx
│       │   └─→ walletConnector (from utils/walletConnector.ts)
│       │   └─→ Framer Motion, Lucide Icons
│       │
│       └── [Other Components]
│           └─→ useWallet() (from context/WalletContext.tsx)
│
├── context/
│   └── WalletContext.tsx
│       └─→ useTronWallet() (from hooks/useTronWallet.ts)
│
├── hooks/
│   └── useTronWallet.ts
│       └─→ walletConnector (from utils/walletConnector.ts)
│
└── utils/
    └── walletConnector.ts
        └─→ TronWeb (npm package)
```

## 🔗 Component Integration Points

### Integration Point 1: Setup (main.tsx)

```
WalletProvider wraps App
       │
       └─→ Provides value: WalletContext
```

### Integration Point 2: Access (Any Component)

```
useWallet() → Accesses WalletContext value
    │
    └─→ {isConnected, address, balance, connect, disconnect}
```

### Integration Point 3: Display (WalletConnect Component)

```
Props: {isConnected, walletAddress, balance, onConnect, onDisconnect}
    │
    └─→ Calls walletConnector methods
    └─→ Displays UI based on state
    └─→ Callbacks to parent component
```

## 🎯 State Management Pattern

```
Global Context State (WalletContext)
├── isConnected: boolean
├── address: string
├── balance: string
├── network: string
├── error: string | null
├── loading: boolean
└── Methods:
    ├── connect()
    ├── connectWithProvider()
    └── disconnect()

    ▼

Hook Access (useWallet)
Allows any component to access/update state
without prop drilling

    ▼

Component Usage (WalletConnect)
Displays UI based on state
Calls context methods
```

## 🔐 Security Architecture

```
User Wallet
    │
    ▼
Wallet Provider (TronLink/WalletConnect)
    │
    ├─ Validates request
    ├─ User approves
    ├─ Returns public data only
    │  (address, balance, signature state)
    │
    ▼
walletConnector (Utility)
    │
    ├─ Validates address format
    ├─ Validates network (TRON only)
    ├─ Validates response data
    │
    ▼
useTronWallet (Hook)
    │
    ├─ Manages state safely
    ├─ Error handling
    ├─ No data exposure
    │
    ▼
WalletContext (Context)
    │
    ├─ Centralized state
    ├─ No direct window access
    │
    ▼
Components (UI)
    │
    └─ Display to user safely
```

## 🌐 Network Configuration

```
TRON Mainnet (Only)
│
├─ Chain ID: 0x2b6653dc
├─ Network: mainnet
├─ RPC URL: https://api.trongrid.io
├─ Native Currency: TRX
├─ Decimals: 6
│
└─ No other networks supported
   (No testnet, no other chains)
```

## 📦 Dependency Tree

```
src/utils/walletConnector.ts
├─ No internal dependencies
└─ Requires: window.tronWeb, window.tronLink (browser globals)

src/hooks/useTronWallet.ts
├─ Depends: walletConnector (utils)
├─ Depends: React hooks (useCallback, useEffect, useState)

src/context/WalletContext.tsx
├─ Depends: useTronWallet (hooks)
├─ Depends: React (createContext, useContext)

src/app/components/WalletConnect.tsx
├─ Depends: walletConnector (utils)
├─ Depends: React (useState, useEffect)
├─ Depends: framer-motion
├─ Depends: lucide-react

src/app/App.tsx
├─ Depends: WalletConnect (components)
├─ Depends: WalletContext (context)
├─ Requires: WalletProvider wrapping
```

## 🎨 UI State Rendering

```
WalletConnect Component
│
├─ Disconnected State
│  ├─ Show "Connect Wallet" button
│  ├─ Show provider options (if multiple available)
│  ├─ Show network info
│  ├─ Show loading spinner (during connection)
│  └─ Show error messages (if connection fails)
│
└─ Connected State
   ├─ Show terminal-style UI
   ├─ Show connection logs
   │  ├─ "> Wallet Connected Successfully"
   │  ├─ "> Address: TX......"
   │  ├─ "> Network: TRON MAINNET"
   │  └─ "> Balance: ...... TRX"
   ├─ Show "Disconnect" button
   └─ Show "Awaiting scan initiation..." message
```

## 🚀 Execution Flow Summary

1. **App Initialization**
   - WalletProvider wraps entire app
   - useTronWallet hook initializes
   - Checks for existing wallet connection

2. **User Initiates Connection**
   - Clicks "Connect Wallet" button
   - Component calls connect() method
   - Hook detects available providers

3. **Provider Selection**
   - Tries TronLink first
   - Fails over to WalletConnect
   - Shows error if both unavailable

4. **Data Retrieval**
   - Gets wallet address
   - Fetches balance
   - Validates address format

5. **State Update**
   - Context state updates
   - Component re-renders
   - Shows connected state UI

6. **User Operations**
   - Can view wallet info
   - Can initiate scans
   - Can disconnect

7. **Disconnection**
   - State clears
   - Component re-renders
   - Back to disconnected state

---

This architecture ensures:
✓ Clean separation of concerns  
✓ Reusable components and hooks  
✓ Type-safe TypeScript  
✓ Centralized state management  
✓ Easy to test and maintain  
✓ Scalable for future enhancements
