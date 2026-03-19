import { motion } from "motion/react";
import { Shield, Terminal } from "lucide-react";
import { useState, useEffect } from "react";

interface HeroSectionProps {
  onInitiateScan: () => void;
}

export function HeroSection({ onInitiateScan }: HeroSectionProps) {
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
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Scanning line effect */}
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#ff1a1a] to-transparent opacity-50"
        initial={{ top: 0 }}
        animate={{ top: '100%' }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
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
          <span className="text-[#ff1a1a] text-sm tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            SYSTEM READY
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl md:text-8xl mb-6 text-[#e6e6e6] tracking-tight"
          style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900 }}
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
          <div className="inline-flex items-center gap-2 text-[#e6e6e6] text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
            <Terminal className="w-5 h-5 text-[#ff4d4d]" />
            <span className="opacity-70">Detect vulnerabilities. Identify risks. Secure your USDT</span>
            {showCursor && <span className="text-[#ff1a1a]">_</span>}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          onClick={onInitiateScan}
          className="group relative px-12 py-5 bg-transparent border-2 border-[#ff1a1a] text-[#ff1a1a] text-lg tracking-widest overflow-hidden transition-all duration-300 hover:text-[#e6e6e6]"
          style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700 }}
        >
          <div className="absolute inset-0 bg-[#ff1a1a] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative flex items-center gap-3">
            <Shield className="w-5 h-5" />
            INITIATE SCAN
          </span>
          
          {/* Glowing border effect on hover */}
          <motion.div
            className="absolute inset-0 border-2 border-[#ff4d4d]"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.button>

        {/* Warning badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 flex flex-wrap justify-center gap-6 text-sm"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {['REAL-TIME ANALYSIS', 'BLOCKCHAIN VERIFIED', 'NON-CUSTODIAL'].map((badge, i) => (
            <div key={i} className="flex items-center gap-2 text-[#e6e6e6]/60">
              <div className="w-1 h-1 bg-[#ff4d4d]" />
              <span>{badge}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}