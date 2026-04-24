/**
 * TRON Wallet Connector Utility
 * Handles wallet connections for TRON network only
 */

export interface TronProvider {
  request: (payload: { method: string; params?: any[] }) => Promise<any>;
  on?: (event: string, callback: (...args: any[]) => void) => void;
  removeListener?: (event: string, callback: (...args: any[]) => void) => void;
}

export interface TronWallet {
  address: string;
  balance: string;
  network: string;
}

export class TronWalletConnector {
  private tronWeb: any;
  private provider: TronProvider | null = null;

  constructor() {
    this.initializeTronWeb();
  }

  /**
   * Initialize TronWeb with TRON network configuration
   */
  private initializeTronWeb() {
    const TronWeb = (window as any).TronWeb;
    if (!TronWeb) return;

    // TRON Mainnet configuration
    this.tronWeb = new TronWeb({
      fullHost: "https://api.trongrid.io",
      headers: { "TRON-PRO-API-KEY": "" },
    });
  }

  /**
   * Detect available TRON wallet providers
   */
  detectProviders(): {
    tronLink: boolean;
    walletConnect: boolean;
    available: string[];
  } {
    const tronLink = !!(window as any).tronLink;
    let walletConnect = false;

    // Check for WalletConnect provider
    if ((window as any).walletConnect) {
      walletConnect = true;
    }

    const available: string[] = [];
    if (tronLink) available.push("TronLink");
    if (walletConnect) available.push("WalletConnect");

    return { tronLink, walletConnect, available };
  }

  /**
   * Connect wallet using TronLink
   */
  async connectTronLink(): Promise<TronWallet | null> {
    try {
      const tronLink = (window as any).tronLink;
      if (!tronLink) {
        throw new Error("TronLink not installed");
      }

      // Request account access
      await tronLink.request({ method: "tron_requestAccounts" });

      // Get account info
      const account = tronLink.tronWeb.defaultAddress;
      if (!account) {
        throw new Error("No account selected in TronLink");
      }

      // Get balance
      const balance = await this.getBalance(account.base58);

      this.provider = tronLink;
      this.setupTronLinkListeners();

      return {
        address: account.base58,
        balance: balance,
        network: "TRON MAINNET",
      };
    } catch (error) {
      console.error("TronLink connection error:", error);
      throw error;
    }
  }

  /**
   * Connect wallet using WalletConnect (web-based connector)
   * Supports TRON network through WalletConnect protocol
   */
  async connectWalletConnect(): Promise<TronWallet | null> {
    try {
      // This is a placeholder for WalletConnect integration
      // In a production app, you would use @walletconnect/web3wallet or similar
      const walletConnect = (window as any).walletConnect;

      if (!walletConnect) {
        throw new Error("WalletConnect not available");
      }

      // Attempt to create a WalletConnect session
      const session = await walletConnect.connect({
        chains: ["tron:0x2b6653dc"], // TRON Mainnet chain ID
        methods: ["tron_sign", "tron_signTransaction"],
      });

      if (!session || !session.accounts || session.accounts.length === 0) {
        throw new Error("No accounts provided by WalletConnect");
      }

      // Parse account address
      const account = session.accounts[0];
      const address = account.split(":").pop();

      if (!address) {
        throw new Error("Invalid account format");
      }

      // Get balance
      const balance = await this.getBalance(address);

      return {
        address: address,
        balance: balance,
        network: "TRON MAINNET",
      };
    } catch (error) {
      console.error("WalletConnect connection error:", error);
      throw error;
    }
  }

  /**
   * Disconnect wallet
   */
  async disconnect(): Promise<void> {
    try {
      if (this.provider) {
        if (
          (window as any).tronLink &&
          this.provider === (window as any).tronLink
        ) {
          // TronLink doesn't have an explicit disconnect method
          // Just clear the provider reference
        }
      }
      this.provider = null;
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  }

  /**
   * Get wallet balance in USDT (or TRX)
   */
  private async getBalance(address: string): Promise<string> {
    try {
      const tronWeb = (window as any).TronWeb;
      if (!tronWeb) {
        return "0";
      }

      // Get TRX balance
      const trxBalance = await tronWeb.trx.getBalance(address);

      // Convert from Sun (1 TRX = 1,000,000 Sun) to TRX
      const trxBalanceInTrx = trxBalance / 1000000;

      return trxBalanceInTrx.toFixed(2);
    } catch (error) {
      console.error("Error fetching balance:", error);
      return "0";
    }
  }

  /**
   * Get current account address
   */
  async getCurrentAddress(): Promise<string | null> {
    try {
      const tronLink = (window as any).tronLink;
      if (tronLink && tronLink.tronWeb) {
        const address = tronLink.tronWeb.defaultAddress;
        return address?.base58 || null;
      }
      return null;
    } catch (error) {
      console.error("Error getting current address:", error);
      return null;
    }
  }

  /**
   * Setup TronLink event listeners
   */
  private setupTronLinkListeners() {
    const tronLink = (window as any).tronLink;
    if (!tronLink) return;

    tronLink.on("accountsChanged", (accounts: string[]) => {
      if (accounts.length === 0) {
        console.log("TronLink wallet disconnected");
      } else {
        console.log("TronLink accounts changed:", accounts);
      }
    });

    tronLink.on("chainChanged", (chainId: string) => {
      console.log("TronLink chain changed:", chainId);
    });
  }

  /**
   * Check if address is valid TRON address
   */
  isValidTronAddress(address: string): boolean {
    return /^T[a-zA-Z0-9]{33}$/.test(address);
  }

  /**
   * Get TRON network info
   */
  getTronNetworkInfo() {
    return {
      chainId: "0x2b6653dc", // TRON Mainnet
      chainName: "TRON Mainnet",
      network: "mainnet",
      rpcUrl: "https://api.trongrid.io",
      nativeCurrency: {
        name: "Tron",
        symbol: "TRX",
        decimals: 6,
      },
    };
  }
}

export default new TronWalletConnector();
