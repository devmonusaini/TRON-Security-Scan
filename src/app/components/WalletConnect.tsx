import { motion } from "framer-motion";
import {
  Wallet,
  CheckCircle2,
  AlertTriangle,
  Loader,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import walletConnector from "../../utils/walletConnector";

interface WalletConnectProps {
  isConnected: boolean;
  walletAddress: string;
  balance: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function WalletConnect({
  isConnected,
  walletAddress,
  balance,
  onConnect,
  onDisconnect,
}: WalletConnectProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showProviderOptions, setShowProviderOptions] = useState(false);
  const [availableProviders, setAvailableProviders] = useState<string[]>([]);

  // ✅ Initialize available providers
  useEffect(() => {
    const providers = walletConnector.detectProviders();
    setAvailableProviders(providers.available);
  }, []);

  // ✅ Wallet connection logs
  useEffect(() => {
    if (isConnected && walletAddress) {
      setLogs([]); // reset logs

      const logMessages = [
        "> Wallet Connected Successfully",
        `> Address: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-6)}`,
        "> Network: TRON MAINNET",
        `> Balance: ${balance} TRX`,
      ];

      let index = 0;

      const interval = setInterval(() => {
        if (index < logMessages.length) {
          setLogs((prev) => [...prev, logMessages[index]]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 200);

      return () => clearInterval(interval);
    } else {
      setLogs([]);
    }
  }, [isConnected, walletAddress, balance]);

  // ✅ Connect via TronLink
  const handleTronLinkConnect = async () => {
    setLoading(true);
    setError("");
    try {
      const wallet = await walletConnector.connectTronLink();
      if (wallet) {
        onConnect();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to connect TronLink wallet",
      );
    } finally {
      setLoading(false);
      setShowProviderOptions(false);
    }
  };

  // ✅ Connect via WalletConnect
  const handleWalletConnectConnect = async () => {
    setLoading(true);
    setError("");
    try {
      const wallet = await walletConnector.connectWalletConnect();
      if (wallet) {
        onConnect();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to connect via WalletConnect",
      );
    } finally {
      setLoading(false);
      setShowProviderOptions(false);
    }
  };

  // ✅ Auto-detect and connect
  const handleConnect = async () => {
    setLoading(true);
    setError("");

    try {
      const providers = walletConnector.detectProviders();

      // Try TronLink first (most common for TRON)
      if (providers.tronLink) {
        try {
          const wallet = await walletConnector.connectTronLink();
          if (wallet) {
            onConnect();
            return;
          }
        } catch (err) {
          console.error("TronLink failed:", err);
        }
      }

      // Try WalletConnect
      if (providers.walletConnect) {
        try {
          const wallet = await walletConnector.connectWalletConnect();
          if (wallet) {
            onConnect();
            return;
          }
        } catch (err) {
          console.error("WalletConnect failed:", err);
        }
      }

      // No providers available
      if (providers.available.length === 0) {
        setShowProviderOptions(true);
        setError(
          "No TRON wallet detected. Please install TronLink or use WalletConnect",
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            {/* Connection panel */}
            <div className="border-2 border-[#ff1a1a]/30 bg-[#050505]/90 backdrop-blur-sm p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#ff1a1a]/20">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#ff1a1a]" />
                  <span className="text-[#ff1a1a] text-sm tracking-widest font-bold">
                    TRON WALLET AUTHORIZATION
                  </span>
                </div>
                <AlertTriangle className="w-5 h-5 text-[#ff4d4d]" />
              </div>

              <div className="text-center">
                <h3 className="text-3xl text-[#e6e6e6] mb-4 font-bold">
                  AUTHORIZE WALLET ACCESS
                </h3>

                <p className="text-[#e6e6e6]/60 mb-8">
                  Connect your TRON wallet to initiate the security scan. TRON
                  Mainnet only.
                </p>

                {/* Provider Options */}
                {showProviderOptions && availableProviders.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-[#ff1a1a]/5 border border-[#ff1a1a]/20 rounded p-4"
                  >
                    <p className="text-[#e6e6e6]/70 text-sm mb-4">
                      Select wallet provider:
                    </p>
                    <div className="space-y-2">
                      {availableProviders.includes("TronLink") && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleTronLinkConnect}
                          disabled={loading}
                          className="w-full px-4 py-2 bg-[#ff1a1a]/20 border border-[#ff1a1a]/40 text-[#ff1a1a] rounded hover:bg-[#ff1a1a]/30 transition-all disabled:opacity-50"
                        >
                          {loading ? (
                            <Loader className="w-4 h-4 inline mr-2 animate-spin" />
                          ) : null}
                          Connect with TronLink
                        </motion.button>
                      )}
                      {availableProviders.includes("WalletConnect") && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleWalletConnectConnect}
                          disabled={loading}
                          className="w-full px-4 py-2 bg-[#3b99fc]/20 border border-[#3b99fc]/40 text-[#3b99fc] rounded hover:bg-[#3b99fc]/30 transition-all disabled:opacity-50"
                        >
                          {loading ? (
                            <Loader className="w-4 h-4 inline mr-2 animate-spin" />
                          ) : null}
                          Connect with WalletConnect
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Main Connect Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConnect}
                  disabled={loading}
                  className="px-10 py-4 bg-[#ff1a1a] text-white text-lg tracking-wider transition-all duration-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-3 justify-center">
                      <Loader className="w-5 h-5 animate-spin" />
                      CONNECTING...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3 justify-center">
                      <Wallet className="w-5 h-5" />
                      CONNECT TRON WALLET
                    </span>
                  )}
                </motion.button>

                {/* Network Info */}
                <div className="mt-6 p-3 bg-[#ff1a1a]/5 border border-[#ff1a1a]/20 rounded">
                  <p className="text-[#e6e6e6]/70 text-xs font-mono">
                    Network: TRON MAINNET (Chain ID: 0x2b6653dc)
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 mt-4 text-sm"
                  >
                    ⚠ {error}
                  </motion.p>
                )}

                <div className="mt-6 text-[#e6e6e6]/40 text-sm">
                  Supported: TronLink Extension or WalletConnect
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            {/* Terminal */}
            <div className="border-2 border-[#ff1a1a] bg-[#050505]/95 backdrop-blur-sm">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-[#ff1a1a]/30 bg-[#ff1a1a]/10">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#ff1a1a]" />
                  <span className="text-[#ff1a1a] text-xs tracking-widest">
                    CONNECTION ESTABLISHED - TRON MAINNET
                  </span>
                </div>

                <button
                  onClick={onDisconnect}
                  className="text-[#e6e6e6]/60 hover:text-[#ff1a1a] text-xs"
                >
                  DISCONNECT
                </button>
              </div>

              {/* Logs */}
              <div className="p-6 font-mono">
                {logs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-[#e6e6e6] mb-2 text-sm"
                  >
                    {log}
                  </motion.div>
                ))}

                {logs.length === 4 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="text-[#ff4d4d] mt-4"
                  >
                    {"> Awaiting scan initiation..."}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
