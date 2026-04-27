import { WalletConnectAdapter } from "@tronweb3/tronwallet-adapter-walletconnect";

export interface TronWallet {
  address: string;
  balance: string;
  network: string;
}

export class TronWalletConnector {
  private tronWeb: any = null;
  private walletConnect: WalletConnectAdapter | null = null;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window === "undefined") return;

    const TronWeb = (window as any).TronWeb;

    if (TronWeb) {
      this.tronWeb = new TronWeb({
        fullHost: "https://api.trongrid.io",
      });
    }

    // ✅ WalletConnect init
    this.walletConnect = new WalletConnectAdapter({
      network: "Mainnet",
      options: {
        relayUrl: "wss://relay.walletconnect.com",
        projectId: "0ce8aee287b84db4976604d12ad15af9",
        metadata: {
          name: "Tron App",
          description: "WalletConnect TRON",
          url: window.location.origin,
          icons: [],
        },
      },
    });
  }

  // ✅ Detect both wallets
  detectProviders() {
    const tronLink = !!(window as any).tronLink;

    return {
      tronLink,
      walletConnect: true,
      available: [
        ...(tronLink ? ["TronLink"] : []),
        "WalletConnect",
      ],
    };
  }

  // =========================
  // TRONLINK
  // =========================
  async connectTronLink(): Promise<TronWallet> {
    const tronLink = (window as any).tronLink;

    if (!tronLink) {
      throw new Error("TronLink extension not installed");
    }

    if (tronLink.request) {
      await tronLink.request({
        method: "tron_requestAccounts",
      });
    }

    const address = await this.waitForAddress();

    if (!address) {
      throw new Error("Unlock TronLink and select account");
    }

    const balance = await this.getBalance(address);

    return {
      address,
      balance,
      network: "TRON MAINNET",
    };
  }

  // =========================
  // WALLET CONNECT
  // =========================
  async connectWalletConnect(): Promise<TronWallet> {
    if (!this.walletConnect) {
      throw new Error("WalletConnect not initialized");
    }

    await this.walletConnect.connect();

    const address = this.walletConnect.address;

    if (!address) {
      throw new Error("WalletConnect failed");
    }

    return {
      address,
      balance: "0",
      network: "TRON MAINNET",
    };
  }

  // =========================
  private waitForAddress(timeout = 8000): Promise<string | null> {
    return new Promise((resolve) => {
      const start = Date.now();

      const interval = setInterval(() => {
        const tronWeb = (window as any).tronWeb;
        const address = tronWeb?.defaultAddress?.base58;

        if (address) {
          clearInterval(interval);
          resolve(address);
        }

        if (Date.now() - start > timeout) {
          clearInterval(interval);
          resolve(null);
        }
      }, 200);
    });
  }

  private async getBalance(address: string): Promise<string> {
    try {
      const tronWeb = (window as any).tronWeb;
      const sun = await tronWeb.trx.getBalance(address);
      return (sun / 1_000_000).toFixed(2);
    } catch {
      return "0";
    }
  }
}

export default new TronWalletConnector();