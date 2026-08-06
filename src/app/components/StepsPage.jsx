"use client"

import { motion } from "framer-motion"
import {
  Globe,
  Shield,
  Coins,
  RefreshCw,
  Wallet,
  Handshake,
  ArrowRight
} from "lucide-react"

export default function StepsPage() {
  const projectSteps = [
    {
      step: "01",
      icon: Globe,
      title: "Network Initialization",
      description: "Launch EpochEra Layer 1 blockchain focusing on fast, secure, and interoperable infrastructure.",
      delay: 0,
      color: "from-green-400 to-emerald-500"
    },
    {
      step: "02",
      icon: Shield,
      title: "Consensus and Validation",
      description: "Implement Proof-of-Work with enhanced SHA-256 hashing for robust, decentralized block validation.",
      delay: 0.2,
      color: "from-yellow-400 to-cyan-500"
    },
    {
      step: "03",
      icon: Coins,
      title: "Transaction Mechanism",
      description: "Use UTXO model coupled with ECDSA signatures ensuring secure, verifiable peer-to-peer transfers.",
      delay: 0.4,
      color: "from-yellow-400 to-yellow-600"
    },
    {
      step: "04",
      icon: Wallet,
      title: "Mining and Token Rewards",
      description: "Distribute block rewards starting at 100 EpochEra, halving every 840,000 blocks to maintain tokenomics.",
      delay: 0.6,
      color: "from-purple-400 to-pink-500"
    },
    {
      step: "05",
      icon: Handshake,
      title: "Decentralized Consensus",
      description: "Achieve network consensus via distributed full nodes and simplified payment verification (SPV) clients.",
      delay: 0.8,
      color: "from-red-400 to-pink-500"
    },
    {
      step: "06",
      icon: RefreshCw,
      title: "Token Supply Governance",
      description: "Manage a fixed 10 billion EpochEra supply with a transparent, predictable halving schedule spanning 84 years.",
      delay: 1.0,
      color: "from-indigo-400 to-yellow-500"
    }
  ]

  return (
    <section className="relative">
      {/* Clean Background */}
      <div className="absolute inset-0 ">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
        </div>
      </div>

      <div className="relative min-h-screen py-12 px-6">
        <div className="md:max-w-7xl mx-auto">

          {/* Header */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-5xl md:text-6xl font-light text-white mb-6 tracking-tight">
              EpochEra Coin <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49]">Blockchain Protocol</span>
            </h2>
            <p className="text-xl text-slate-300 mx-auto font-light leading-relaxed">
              Explore the six foundational elements of the EpochEra blockchain powering a secure, scalable, and transparent decentralized digital currency ecosystem
            </p>

              <h3 className="text-3xl font-semibold text-white mt-12 mb-4">Secure and Scalable Protocol</h3>


            <div className="text-center mb-16 max-w-4xl mx-auto">
              <p className="text-lg text-slate-300 font-light leading-relaxed">
                EpochEra Coin leverages advanced cryptographic techniques and a predictable supply schedule to ensure a transparent, secure, and long-term sustainable decentralized ecosystem.
                Our protocol combines industry-proven consensus mechanisms with real-world utility and innovative “trade-to-mine” features driving community adoption and growth.
              </p>
            </div>
          </motion.div>

          {/* Steps with Moving Animation */}
          <div className="relative md:max-w-4xl mx-auto">

            {projectSteps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Container */}
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: step.delay,
                    type: "spring",
                    stiffness: 100 
                  }}
                  viewport={{ once: true }}
                  className={`flex items-center mb-16 flex-col md:flex-row ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Step Number Circle */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-2xl rounded-full border border-yellow-500/40 flex items-center justify-center">
                      <span className="text-yellow-400 font-semibold text-lg">{step.step}</span>
                    </div>
                    
                    {/* Animated Arrow for Connection */}
                    {index < projectSteps.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: step.delay + 0.5, duration: 0.5 }}
                        viewport={{ once: true }}
                        className="hidden md:absolute -bottom-8 left-1/2 transform -translate-x-1/2 lg:hidden"
                      >
                        <ArrowRight className="h-4 w-4 text-yellow-400/50 rotate-90" />
                      </motion.div>
                    )}
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:ml-12' : 'lg:mr-12'} mt-4 lg:mt-0`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: step.delay + 0.3, duration: 0.3 }}
                      viewport={{ once: true }}
                      className="group"
                    >
                      <div className="p-4 bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-2xl rounded-2xl border border-zinc-700 hover:border-yellow-500/30 transition-all duration-300">
                        {/* Icon and Title */}
                        <div className="flex flex-col md:flex-row  items-center md:items-start space-x-4 mb-4">
                          <div className="w-12 h-12 bg-slate-500/20 rounded-full flex items-center justify-center group-hover:bg-yellow-500/20 transition-all duration-300">
                            <step.icon className="h-6 w-6 text-slate-400 group-hover:text-yellow-400 transition-colors duration-300" />
                          </div>
                          <div className="flex-1 text-center md:text-start">
                            <h4 className="text-xl font-medium text-white mb-2 group-hover:text-yellow-100 transition-colors duration-300">
                              {step.title}
                            </h4>
                            <p className="text-slate-400 font-light leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Desktop Connection Arrow */}
                {index < projectSteps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: step.delay + 0.8, duration: 0.5 }}
                    viewport={{ once: true }}
                    className={`hidden lg:flex justify-center mb-8 ${
                      index % 2 === 0 ? 'ml-32' : 'mr-32'
                    }`}
                  >
                    {/* Optional: Add decorative connecting arrow or line here if desired */}
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Summary Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.2 }}
            viewport={{ once: true }}
            className="md:max-w-4xl mx-auto mt-20"
          >
           

            {/* Protocol Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8 p-3 md:p-6 bg-gradient-to-br from-yellow-300/20 to-yellow-800/20 rounded-3xl">
              <div className="text-center">
                <div className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49] mb-2">100 B</div>
                <div className="text-sm text-slate-200 uppercase tracking-wide">EpochEra Supply</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49] mb-2">2.5 min</div>
                <div className="text-sm text-slate-200 uppercase tracking-wide">Avg. Block Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49] mb-2">~$0.01</div>
                <div className="text-sm text-slate-200 uppercase tracking-wide">Low Transaction Fees</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49] mb-2">84 Years</div>
                <div className="text-sm text-slate-200 uppercase tracking-wide">Halving Cycle Duration</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}