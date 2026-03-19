import { motion } from "motion/react";
import { AlertTriangle, TrendingUp, Shield, FileWarning, Activity, CheckCircle2, XCircle } from "lucide-react";
import { ScanResults } from "./ScannerUI";

interface ResultsDashboardProps {
  results: ScanResults | null;
}

export function ResultsDashboard({ results }: ResultsDashboardProps) {
  if (!results) return null;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return '#4ade80';
      case 'MEDIUM': return '#fbbf24';
      case 'HIGH': return '#ff4d4d';
      case 'CRITICAL': return '#ff1a1a';
      default: return '#e6e6e6';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'LOW': return CheckCircle2;
      case 'MEDIUM': return AlertTriangle;
      case 'HIGH': return XCircle;
      case 'CRITICAL': return AlertTriangle;
      default: return Shield;
    }
  };

  const RiskIcon = getRiskIcon(results.riskLevel);
  const riskColor = getRiskColor(results.riskLevel);

  return (
    <div className="relative py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Main result header */}
          <div className="border-2 border-[#ff1a1a] bg-[#050505]/95 backdrop-blur-sm mb-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#ff1a1a]/30 bg-[#ff1a1a]/10">
              <span className="text-[#ff1a1a] text-lg tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700 }}>
                SECURITY ANALYSIS COMPLETE
              </span>
              <Activity className="w-5 h-5 text-[#ff1a1a]" />
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Risk Level */}
                <div className="relative">
                  <div className="text-[#e6e6e6]/60 text-sm mb-3" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    RISK LEVEL
                  </div>
                  <div className="flex items-center gap-4">
                    <RiskIcon className="w-12 h-12" style={{ color: riskColor }} />
                    <div>
                      <div className="text-5xl tracking-tight" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900, color: riskColor }}>
                        {results.riskLevel}
                      </div>
                    </div>
                  </div>
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: riskColor }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>

                {/* Security Score */}
                <div className="relative">
                  <div className="text-[#e6e6e6]/60 text-sm mb-3" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    SECURITY SCORE
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="#ff1a1a"
                          strokeWidth="4"
                          fill="none"
                          opacity="0.2"
                        />
                        <motion.circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke={riskColor}
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - results.score / 100) }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-2xl text-[#e6e6e6]" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 700 }}>
                        {results.score}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#e6e6e6] text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Out of 100
                      </div>
                      <div className="text-[#e6e6e6]/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {results.vulnerabilities} vulnerabilities found
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard grid panels */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Transaction Risk */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="border border-[#ff1a1a]/50 bg-[#050505]/90 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="border-l-4 border-[#ff1a1a] p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-[#ff4d4d]" />
                      <span className="text-[#e6e6e6] text-lg" style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700 }}>
                        TRANSACTION RISK
                      </span>
                    </div>
                    <div className="text-[#e6e6e6]/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Historical transaction analysis
                    </div>
                  </div>
                  <div className="text-3xl text-[#ff1a1a]" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 700 }}>
                    {results.transactionRisk}%
                  </div>
                </div>
                <div className="h-2 bg-[#ff1a1a]/20 relative overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#ff1a1a] to-[#ff4d4d]"
                    initial={{ width: 0 }}
                    animate={{ width: `${results.transactionRisk}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Smart Contract Exposure */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="border border-[#ff1a1a]/50 bg-[#050505]/90 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="border-l-4 border-[#ff4d4d] p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-[#ff4d4d]" />
                      <span className="text-[#e6e6e6] text-lg" style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700 }}>
                        CONTRACT EXPOSURE
                      </span>
                    </div>
                    <div className="text-[#e6e6e6]/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Smart contract interactions
                    </div>
                  </div>
                  <div className="text-3xl text-[#ff4d4d]" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 700 }}>
                    {results.contractExposure}%
                  </div>
                </div>
                <div className="h-2 bg-[#ff4d4d]/20 relative overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#ff4d4d] to-[#ff1a1a]"
                    initial={{ width: 0 }}
                    animate={{ width: `${results.contractExposure}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Token Approval Risks */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="border border-[#ff1a1a]/50 bg-[#050505]/90 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="border-l-4 border-[#990000] p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileWarning className="w-5 h-5 text-[#ff4d4d]" />
                      <span className="text-[#e6e6e6] text-lg" style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700 }}>
                        TOKEN APPROVALS
                      </span>
                    </div>
                    <div className="text-[#e6e6e6]/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Active token permissions
                    </div>
                  </div>
                  <div className="text-3xl text-[#ff1a1a]" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 700 }}>
                    {results.tokenApprovals}
                  </div>
                </div>
                <div className="text-[#e6e6e6]/40 text-xs mt-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Active approvals detected
                </div>
              </div>
            </motion.div>

            {/* Suspicious Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="border border-[#ff1a1a]/50 bg-[#050505]/90 backdrop-blur-sm relative overflow-hidden"
            >
              <div className="border-l-4 border-[#ff1a1a] p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-[#ff1a1a]" />
                      <span className="text-[#e6e6e6] text-lg" style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700 }}>
                        SUSPICIOUS ACTIVITY
                      </span>
                    </div>
                    <div className="text-[#e6e6e6]/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Anomaly detection results
                    </div>
                  </div>
                  <div className="text-3xl text-[#ff1a1a]" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 700 }}>
                    {results.suspiciousActivity}
                  </div>
                </div>
                <div className="text-[#e6e6e6]/40 text-xs mt-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Potential threats identified
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
