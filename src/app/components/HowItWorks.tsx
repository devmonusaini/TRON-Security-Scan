import { motion } from "motion/react";
import { Wallet, Scan, Database, FileText } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Wallet,
      title: 'CONNECT WALLET',
      description: 'Authorize read-only access to your TronLink wallet for security analysis'
    },
    {
      number: '02',
      icon: Scan,
      title: 'INITIATE SCAN',
      description: 'Start the comprehensive blockchain security scanning process'
    },
    {
      number: '03',
      icon: Database,
      title: 'ANALYZE BLOCKCHAIN',
      description: 'Deep analysis of transactions, contracts, and wallet interactions'
    },
    {
      number: '04',
      icon: FileText,
      title: 'GENERATE REPORT',
      description: 'Receive detailed security report with risk assessment and recommendations'
    }
  ];

  return (
    <div className="relative py-20 px-6">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(#ff1a1a 1px, transparent 1px),
              linear-gradient(90deg, #ff1a1a 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
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
              OPERATION PROTOCOL
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl text-[#e6e6e6] mb-4" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900 }}>
            HOW IT WORKS
          </h2>
          <p className="text-[#e6e6e6]/60 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
            Four-step security verification process
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* Step card */}
              <div className="border-2 border-[#ff1a1a]/30 bg-[#050505]/90 backdrop-blur-sm hover:border-[#ff1a1a] transition-all duration-300 h-full">
                {/* Step number header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-[#ff1a1a]/20 bg-[#ff1a1a]/5">
                  <span className="text-[#ff1a1a] text-xs tracking-wider" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    STEP
                  </span>
                  <span className="text-[#ff1a1a] text-2xl" style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900 }}>
                    {step.number}
                  </span>
                </div>

                <div className="p-6">
                  {/* Icon */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 border-2 border-[#ff1a1a]/50 flex items-center justify-center group-hover:border-[#ff1a1a] transition-colors duration-300">
                      <step.icon className="w-8 h-8 text-[#ff1a1a]" />
                    </div>
                    <motion.div
                      className="absolute inset-0 border-2 border-[#ff1a1a]"
                      initial={{ scale: 1, opacity: 0 }}
                      whileHover={{ scale: 1.1, opacity: 0.5 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl text-[#e6e6e6] mb-3" style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700 }}>
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#e6e6e6]/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {step.description}
                  </p>
                </div>

                {/* Bottom indicator line */}
                <motion.div
                  className="h-1 bg-gradient-to-r from-[#ff1a1a] to-transparent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                />
              </div>

              {/* Arrow connector (not on last item in desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 z-20">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    className="text-[#ff1a1a] text-2xl"
                  >
                    →
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="inline-block border border-[#ff1a1a]/50 bg-[#050505]/80 backdrop-blur-sm px-8 py-4">
            <div className="flex items-center gap-3 text-[#e6e6e6]/60" style={{ fontFamily: 'Inter, sans-serif' }}>
              <div className="w-2 h-2 bg-[#ff4d4d] animate-pulse" />
              <span>Complete scan in under 60 seconds</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
