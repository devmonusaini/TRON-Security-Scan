"use client";

import { WalletProvider } from "@tronweb3/tronwallet-adapter-react-hooks";
import { TronLinkAdapter } from "@tronweb3/tronwallet-adapters";
import { WalletConnectAdapter } from "@tronweb3/tronwallet-adapter-walletconnect";

const walletConnectAdapter = new WalletConnectAdapter({
  network: "Mainnet",
  options: {
    projectId: "0ce8aee287b84db4976604d12ad15af9",
    relayUrl: "wss://relay.walletconnect.com",
    metadata: {
      name: "TRON DApp",
      description: "TRON WalletConnect",
      url: window.location.origin,
      icons: ["https://walletconnect.com/walletconnect-logo.png"],
    },
  },
});

const adapters = [
  new TronLinkAdapter(),
  walletConnectAdapter,
];

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider adapters={adapters} autoConnect={false}>
      {children}
    </WalletProvider>
  );
}