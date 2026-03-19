import { motion } from "motion/react";
import { Shield, Terminal, Github, Twitter, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t-2 border-[#ff1a1a]/30 bg-[#000000] py-12 px-6">
      {/* Top border glow effect */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff1a1a] to-transparent opacity-50" />

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 border-2 border-[#ff1a1a] flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#ff1a1a]" />
              </div>
              <div>
                <div className="text-[#e6e6e6] text-lg" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 700 }}>
                  TRON SECURITY
                </div>
                <div className="text-[#ff1a1a] text-xs tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  SCAN SYSTEM
                </div>
              </div>
            </div>
            <p className="text-[#e6e6e6]/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Advanced blockchain security verification platform for USDT TRC20 wallets.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#ff1a1a] text-sm mb-4 tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700 }}>
              QUICK ACCESS
            </h4>
            <ul className="space-y-2">
              {['Security Scan', 'How It Works', 'Trust & Safety', 'Documentation'].map((link, i) => (
                <li key={i}>
                  <a 
                    href="#" 
                    className="text-[#e6e6e6]/60 hover:text-[#ff1a1a] transition-colors duration-300 text-sm flex items-center gap-2"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <Terminal className="w-3 h-3" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* System Status */}
          <div>
            <h4 className="text-[#ff1a1a] text-sm mb-4 tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700 }}>
              SYSTEM STATUS
            </h4>
            <div className="space-y-3">
              {[
                { label: 'Network', status: 'ONLINE' },
                { label: 'Scan Engine', status: 'ACTIVE' },
                { label: 'Database', status: 'CONNECTED' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-[#e6e6e6]/60" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 bg-[#ff1a1a] rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    />
                    <span className="text-[#ff1a1a] text-xs" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#ff1a1a]/30 to-transparent mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[#e6e6e6]/40 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span className="text-[#ff1a1a]">© 2026</span> TRON Security Scan. All systems operational.
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {[
              { icon: Github, label: 'GitHub' },
              { icon: Twitter, label: 'Twitter' },
              { icon: MessageCircle, label: 'Discord' }
            ].map((social, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 border border-[#ff1a1a]/30 hover:border-[#ff1a1a] bg-[#ff1a1a]/5 hover:bg-[#ff1a1a]/10 flex items-center justify-center transition-all duration-300 group"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4 text-[#ff1a1a]/60 group-hover:text-[#ff1a1a]" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Terminal-style bottom text */}
        <div className="mt-8 text-center">
          <div className="inline-block border border-[#ff1a1a]/20 bg-[#ff1a1a]/5 px-4 py-2">
            <div className="flex items-center gap-2 text-[#e6e6e6]/40 text-xs font-mono">
              <span className="text-[#ff4d4d]">&gt;</span>
              <span>secure_scan_v2.1.0 | ready_for_deployment</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
