import { motion } from "motion/react";
import { Radar, Database, FileSearch, Brain } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Radar,
      title: 'THREAT DETECTION ENGINE',
      description: 'Real-time monitoring and detection of potential security threats on the TRON blockchain',
      status: 'ACTIVE'
    },
    {
      icon: Database,
      title: 'TRON CHAIN ANALYZER',
      description: 'Deep blockchain analysis examining transaction patterns and wallet behavior',
      status: 'ACTIVE'
    },
    {
      icon: FileSearch,
      title: 'SMART CONTRACT SCANNER',
      description: 'Comprehensive scanning of smart contract interactions and approval permissions',
      status: 'ACTIVE'
    },
    {
      icon: Brain,
      title: 'FRAUD PATTERN RECOGNITION',
      description: 'AI-powered detection of fraudulent activities and suspicious transaction patterns',
      status: 'ACTIVE'
    }
  ];

  return (
    <div className="relative py-20 px-6 bg-[#050505]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 border border-[#ff1a1a]/50 bg-[#ff1a1a]/10">
            <div className="w-2 h-2 bg-[#ff1a1a]" />
            <span className="text-[#ff1a1a] text-sm tracking-widest" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              SYSTEM MODULES
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl text-[#e6e6e6] mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900 }}>
            SECURITY INFRASTRUCTURE
          </h2>
          <p className="text-[#e6e6e6]/60 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            Military-grade security modules protecting your digital assets
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="space-y-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="border-2 border-[#ff1a1a]/30 bg-[#050505]/80 backdrop-blur-sm hover:border-[#ff1a1a] transition-all duration-300 overflow-hidden">
                {/* Status bar */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-[#ff1a1a]/20 bg-gradient-to-r from-[#ff1a1a]/10 to-transparent">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-2 h-2 bg-[#ff1a1a] rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    />
                    <span className="text-[#ff4d4d] text-xs tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      [ SYSTEM MODULE {String(index + 1).padStart(2, '0')} ]
                    </span>
                  </div>
                  <span className="text-[#ff1a1a] text-xs tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    {feature.status}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <div className="flex items-start gap-6">
                    {/* Icon */}
                    <div className="relative">
                      <div className="w-16 h-16 border-2 border-[#ff1a1a] bg-[#ff1a1a]/5 flex items-center justify-center group-hover:bg-[#ff1a1a]/10 transition-colors duration-300">
                        <feature.icon className="w-8 h-8 text-[#ff1a1a]" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#ff1a1a]" />
                      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#ff1a1a]" />
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      <h3 className="text-2xl text-[#e6e6e6] mb-3 group-hover:text-[#ff4d4d] transition-colors duration-300" style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700 }}>
                        {feature.title}
                      </h3>
                      <p className="text-[#e6e6e6]/70" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hover effect line */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff1a1a] to-transparent"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#ff1a1a] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#ff1a1a] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#ff1a1a] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#ff1a1a] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
