import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'SCAN', href: '#scan' },
    { label: 'FEATURES', href: '#features' },
    { label: 'HOW IT WORKS', href: '#how-it-works' },
    { label: 'TRUST', href: '#trust' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b-2 border-[#ff1a1a]/30 bg-[#050505]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 border-2 border-[#ff1a1a] flex items-center justify-center relative">
              <Shield className="w-6 h-6 text-[#ff1a1a]" />
              <motion.div
                className="absolute inset-0 border-2 border-[#ff1a1a]"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <div className="text-[#e6e6e6] text-sm" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 700 }}>
                TRON SECURITY
              </div>
              <div className="text-[#ff1a1a] text-xs tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                SCAN SYSTEM
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-[#e6e6e6]/70 hover:text-[#ff1a1a] transition-colors duration-300 text-sm tracking-wider relative group"
                style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ff1a1a] group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </nav>

          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 border border-[#ff1a1a]/30 bg-[#ff1a1a]/5">
            <motion.div
              className="w-2 h-2 bg-[#ff1a1a] rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[#ff1a1a] text-xs tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              ONLINE
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 border border-[#ff1a1a]/50 flex items-center justify-center hover:border-[#ff1a1a] transition-colors duration-300"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-[#ff1a1a]" />
            ) : (
              <Menu className="w-5 h-5 text-[#ff1a1a]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#ff1a1a]/30 bg-[#050505]"
          >
            <nav className="px-6 py-4 space-y-4">
              {navItems.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-[#e6e6e6]/70 hover:text-[#ff1a1a] transition-colors duration-300 py-2 border-l-2 border-transparent hover:border-[#ff1a1a] pl-4"
                  style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}
                >
                  {item.label}
                </motion.a>
              ))}
              
              {/* Status in mobile menu */}
              <div className="flex items-center gap-2 px-4 py-2 border border-[#ff1a1a]/30 bg-[#ff1a1a]/5 w-fit">
                <motion.div
                  className="w-2 h-2 bg-[#ff1a1a] rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-[#ff1a1a] text-xs tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  SYSTEM ONLINE
                </span>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff1a1a] to-transparent opacity-50" />
    </header>
  );
}
