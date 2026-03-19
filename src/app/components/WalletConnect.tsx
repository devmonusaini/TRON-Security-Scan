import { motion } from "framer-motion"; // ✅ FIXED
import { Wallet, CheckCircle2, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

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

  // ✅ Wallet connection logs
  useEffect(() => {
    if (isConnected && walletAddress) {
      setLogs([]); // reset logs

      const logMessages = [
        "> Wallet Connected",
        `> Address: ${walletAddress}`,
        "> Network: TRON MAINNET",
        `> Balance: ${balance} USDT`,
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

  // ✅ TronLink detection
  const handleConnect = () => {
    if (!(window as any).tronLink && !(window as any).tronWeb) {
      setError("TronLink not detected. Please install extension.");
      return;
    }
    setError("");
    onConnect();
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
                    WALLET AUTHORIZATION
                  </span>
                </div>
                <AlertTriangle className="w-5 h-5 text-[#ff4d4d]" />
              </div>

              <div className="text-center">
                <h3 className="text-3xl text-[#e6e6e6] mb-4 font-bold">
                  AUTHORIZE WALLET ACCESS
                </h3>

                <p className="text-[#e6e6e6]/60 mb-8">
                  Connect your TronLink wallet to initiate the security scan
                </p>

                {/* Connect Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConnect}
                  className="px-10 py-4 bg-[#ff1a1a] text-white text-lg tracking-wider transition-all duration-300 rounded"
                >
                  <span className="flex items-center gap-3 justify-center">
                    <Wallet className="w-5 h-5" />
                    CONNECT TRONLINK
                  </span>
                </motion.button>

                {/* Error */}
                {error && (
                  <p className="text-red-400 mt-4 text-sm">{error}</p>
                )}

                <div className="mt-6 text-[#e6e6e6]/40 text-sm">
                  Make sure TronLink extension is installed
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
                    CONNECTION ESTABLISHED
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
                    {"> Ready for scan..."}
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