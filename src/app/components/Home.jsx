"use client"

import Link from "next/link"
import Head from "next/head"
import { Button } from "@/components/ui/Button"
import { ArrowRight, Zap, Pickaxe, Users, TrendingUp, Clock, Shield, Rocket, ChevronRight, CheckCircle, Globe, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation";
import { useAppKitAccount, useAppKit } from "@reown/appkit/react";
import Footer from "./Footer"
import { motion } from "framer-motion"

function HomePage() {
  const router = useRouter()
  const { address, isConnected } = useAppKitAccount();
  const { open, close } = useAppKit();

  const handleCTAClick = () => {
    if (address) {
      router.push("/dashboard")
    } else {
      open()
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const commissionData = [
    { level: "Self", target: "-", commission: "2500", bonus: "2500" },
    { level: "Level 1", target: "Direct Referrals", commission: "10", bonus: "2500" },
    { level: "Level 2", target: "Tier 2 Team", commission: "3", bonus: "750" },
    { level: "Level 3", target: "Tier 3 Team", commission: "1.5", bonus: "375" },
    { level: "Level 4", target: "Tier 4 Team", commission: "1.5", bonus: "375" },
    { level: "Level 5", target: "Tier 5 Team", commission: "1", bonus: "250" },
    { level: "Level 6", target: "Tier 6 Team", commission: "1", bonus: "250" },
    { level: "Level 8", target: "Tier 8 Team", commission: "1", bonus: "250" },
    { level: "Level 9", target: "Tier 9 Team", commission: "1", bonus: "250" },
    { level: "Level 10", target: "Tier 10 Team", commission: "1", bonus: "250" },
    { level: "Level 11", target: "Tier 11 Team", commission: "1.5", bonus: "375" },
    { level: "Level 12", target: "Tier 12 Team", commission: "1.5", bonus: "375" },
  ]



  const ecosystemSteps = [
    {
      icon: Pickaxe,
      title: "Mine & Earn",
      description: "Register your account, activate your affiliate account, and head to the Task Portal. Complete daily social tasks, check-ins, and educational activities to start mining Epoch tokens for free."
    },
    {
      icon: TrendingUp,
      title: "Amplify via Presale",
      description: "Secure early-stage Epoch tokens at the lowest valuation before public exchange listings. Use your referral dashboard to invite your community and collect dual-currency rewards."
    },
    {
      icon: Rocket,
      title: "Power the Telegram Mini App",
      description: "80% of net presale proceeds directly fund the smart contract liquidity and development of the Telegram Prediction Market Protocol."
    }
  ]

  return (
    <>

  
      <div className="min-h-screen bg-background overflow-x-hidden">
        
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-20 overflow-hidden">
       

          <motion.div 
            className="relative max-w-7xl mx-auto z-10 w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="text-center space-y-8">
              {/* Badge */}

              
              {/* Main Headline */}
              <motion.h1 variants={itemVariants} className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white leading-tight tracking-tight">
                Purchase. Mine. Build.
              </motion.h1>
              
              {/* Sub Headline */}
              <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49] leading-tight">
                The Future of Decentralized Predictions on Telegram
              </motion.h2>
              
              {/* Description */}
              <motion.p variants={itemVariants} className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
                Fund the next-generation TON Prediction Protocol. Complete daily micro-tasks to mine Epoch tokens or purchase tokens in our presale and earn instantly via our multi-tier referral network.
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto px-10 py-5 text-xl rounded-full hover:scale-105 transition-transform shadow-2xl shadow-[#B48811]/20"
                  onClick={handleCTAClick}
                >
                  Buy Epoch Presale
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-10 py-5 text-xl rounded-full hover:scale-105 transition-transform border-[#B48811] text-[#EBD197] hover:bg-[#B48811]/10 backdrop-blur-sm"
                  onClick={handleCTAClick}
                >
                  Start Task Mining
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronRight className="w-8 h-8 text-[#EBD197]/50 rotate-90" />
          </motion.div>
        </section>

        {/* Core Value Pillars */}
        <section className="py-32 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
                Why Join the <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49]">EpochEra</span> Ecosystem?
              </h2>
            </motion.div>
            
            <motion.div 
              className="grid md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Native TON Blockchain */}
              <motion.div variants={itemVariants} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#EBD197]/20 to-[#B48811]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-10 hover:border-[#B48811]/50 transition-all duration-500 hover:transform hover:scale-105">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#EBD197]/20 to-[#B48811]/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-10 w-10 text-[#EBD197]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Native TON Blockchain</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Built for 900M+ Telegram users. Seamless 1-click prediction markets directly inside Telegram Mini Apps without external wallet friction.
                  </p>
                </div>
              </motion.div>

              {/* Proof-of-Work Task Mining */}
              <motion.div variants={itemVariants} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#EBD197]/20 to-[#B48811]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-10 hover:border-[#B48811]/50 transition-all duration-500 hover:transform hover:scale-105">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#EBD197]/20 to-[#B48811]/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                    <Pickaxe className="h-10 w-10 text-[#EBD197]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Proof-of-Work Task Mining</h3>
                  <p className="text-gray-400 leading-relaxed">
                    No expensive mining rigs required. Complete simple daily engagement tasks, social check-ins, and community validation to mine real EpochEra directly on the web.
                  </p>
                </div>
              </motion.div>

              {/* Affiliate Network */}
              <motion.div variants={itemVariants} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#EBD197]/20 to-[#B48811]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-10 hover:border-[#B48811]/50 transition-all duration-500 hover:transform hover:scale-105">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#EBD197]/20 to-[#B48811]/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-10 w-10 text-[#EBD197]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Affiliate Network</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Promote the token presale and build your network. Earn high-yield commission payouts paid directly to your dashboard in both instant USDT and bonus EpochEra.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Presale & Affiliate Network Model */}
        <section className="py-32 px-4 bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
                Dual-Reward Commission Structure
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Share your unique referral link to build your team. Every presale transaction processed through your link triggers immediate dual payouts.
              </p>
            </motion.div>

            <motion.div 
              className="bg-zinc-800/30 backdrop-blur-xl border border-zinc-700/50 rounded-3xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-zinc-900/50 border-b border-zinc-700/50">
                      <th className="px-8 py-6 text-left text-sm font-semibold text-[#EBD197] uppercase tracking-wider">Level</th>
                      <th className="px-8 py-6 text-left text-sm font-semibold text-[#EBD197] uppercase tracking-wider">Direct Target</th>
                      <th className="px-8 py-6 text-left text-sm font-semibold text-[#EBD197] uppercase tracking-wider">Commission (Instant USDT)</th>
                      <th className="px-8 py-6 text-left text-sm font-semibold text-[#EBD197] uppercase tracking-wider">Token Bonus (EpochEra)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commissionData.map((row, index) => (
                      <tr key={index} className="border-b border-zinc-700/30 hover:bg-zinc-700/20 transition-colors">
                        <td className="px-8 py-6 text-white font-semibold">{row.level}</td>
                        <td className="px-8 py-6 text-gray-300">{row.target}</td>
                        <td className="px-8 py-6 text-green-400 font-semibold">{row.commission}</td>
                        <td className="px-8 py-6 text-[#EBD197] font-semibold">{row.bonus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-zinc-900/30 border-t border-zinc-700/50">
                <p className="text-sm text-gray-400 text-center">
                  <span className="text-[#EBD197] font-semibold">Note:</span> Commissions are instantly claimable to your connected crypto wallet.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How the Ecosystem Works */}
        <section className="py-32 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
                How the Ecosystem Works
              </h2>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {ecosystemSteps.map((step, index) => (
                <motion.div key={index} variants={itemVariants} className="relative">
                  <div className="absolute top-8 left-8 w-12 h-12 bg-gradient-to-br from-[#EBD197] to-[#B48811] rounded-full flex items-center justify-center text-white font-bold text-xl z-10">
                    {index + 1}
                  </div>
                  <div className="bg-zinc-800/30 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8 pt-16 hover:border-[#B48811]/30 transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#EBD197]/20 to-[#B48811]/20 rounded-2xl flex items-center justify-center mb-6">
                      <step.icon className="h-8 w-8 text-[#EBD197]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Ecosystem Utility & Roadmap */}
        <section className="py-32 px-4 bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 relative">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
                Ecosystem Utility & Roadmap
              </h2>
            </motion.div>

            {/* Ecosystem Steps */}
            <div className="space-y-16 mb-24">
              {ecosystemSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex gap-6 items-start">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] to-[#B48811] rounded-xl flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Roadmap */}
           

            {/* Destination Section */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {/* Animated Grid Background */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    linear-gradient(#392236 1px, transparent 1px),
                    linear-gradient(90deg, #392236 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px'
                }} />
              </div>

              {/* Glow Effects */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#392236] rounded-full blur-3xl opacity-30" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#162138] rounded-full blur-3xl opacity-30" />

              <div className="relative bg-gradient-to-br from-[#162138] via-[#392236] to-[#162138] border border-[#392236] rounded-3xl overflow-hidden shadow-2xl">
                {/* Top Gradient Bar */}
                <div className="h-1 bg-gradient-to-r from-[#392236] via-[#162138] to-[#392236]" />
                
                {/* Header Section */}
                <div className="p-8 md:p-12 border-b border-[#392236] bg-gradient-to-r from-[#162138] via-[#392236] to-[#162138]">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#392236] to-[#162138] rounded-2xl flex items-center justify-center shadow-xl shadow-[#392236]/40">
                          <Rocket className="w-8 h-8 text-[#EBD197]" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#162138] animate-pulse" />
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#EBD197] rounded-full border-2 border-[#162138] animate-pulse delay-75" />
                      </div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white">TON Prediction Protocol</h3>
                        <p className="text-sm text-gray-300 mt-1">Next-Gen Decentralized Prediction Platform</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="px-4 py-2 bg-[#162138]/50 border border-[#392236] rounded-full hover:bg-[#392236]/50 transition-colors cursor-pointer">
                        <span className="text-[#EBD197] text-sm font-medium flex items-center gap-2">
                          <span className="w-2 h-2 bg-[#EBD197] rounded-full animate-pulse" />
                          Live on TON
                        </span>
                      </div>
                      <div className="px-4 py-2 bg-green-900/30 border border-green-500/50 rounded-full hover:bg-green-900/50 transition-colors cursor-pointer">
                        <span className="text-green-400 text-sm font-medium flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          Operational
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Platform Status */}
                <div className="p-6 border-b border-[#392236] bg-gradient-to-r from-[#392236] via-[#162138] to-[#392236]">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-white font-medium">Platform Status</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#EBD197]" />
                        <span className="text-gray-300">Audited Smart Contracts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* <Lock className="w-4 h-4 text-[#EBD197]" /> */}
                        <span className="text-gray-300">Secure by Design</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#EBD197]" />
                        <span className="text-gray-300">Global Access</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features Section */}
                <div className="p-8 md:p-12">
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      {
                        icon: CheckCircle,
                        title: "Multi-Category Predictions",
                        description: "Crypto, Sports, Events",
                        status: "Active",
                        progress: 100,
                        badge: "Popular"
                      },
                      {
                        icon: CheckCircle,
                        title: "Instant Settlement",
                        description: "TON Smart Contracts",
                        status: "Active",
                        progress: 100,
                        badge: "Fast"
                      },
                      {
                        icon: CheckCircle,
                        title: "Token Utility",
                        description: "Governance & Staking",
                        status: "Active",
                        progress: 100,
                        badge: "Rewards"
                      }
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        className="group relative bg-gradient-to-br from-[#162138]/80 via-[#392236]/80 to-[#162138]/80 border border-[#392236] rounded-2xl p-6 hover:border-[#162138] transition-all duration-300 overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ 
                          y: -8,
                          boxShadow: '0 25px 50px rgba(22, 33, 56, 0.4)',
                          transition: { duration: 0.3 }
                        }}
                      >
                        {/* Background Gradient on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#392236] to-[#162138] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Progress Bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-[#162138] rounded-t-2xl overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-[#392236] to-[#162138]"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${feature.progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: index * 0.2 + 0.3 }}
                          />
                        </div>

                        <div className="relative z-10">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#392236] to-[#162138] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-[#162138] group-hover:to-[#392236] transition-colors group-hover:scale-110 duration-300 border border-[#392236]">
                              <feature.icon className="w-6 h-6 text-[#EBD197]" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-lg font-semibold text-white">{feature.title}</h4>
                                <span className="text-xs px-2 py-1 bg-[#392236] text-[#EBD197] rounded-full border border-[#392236]">{feature.badge}</span>
                              </div>
                              <p className="text-sm text-gray-300">{feature.description}</p>
                            </div>
                          </div>

                          {/* Tech Stack */}
                          <div className="flex gap-2 mt-4">
                            {['TON', 'Smart Contract', 'DeFi'].map((tech, i) => (
                              <span key={i} className="text-xs px-2 py-1 bg-[#162138]/50 text-[#EBD197] border border-[#392236] rounded hover:bg-[#392236]/50 transition-colors cursor-default">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Section */}
                <div className="p-8 md:p-12 bg-gradient-to-r from-[#162138] via-[#392236] to-[#162138] border-t border-[#392236]">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">Ready to Experience the Future?</h4>
                      <p className="text-gray-300">Join thousands of users already predicting on TON</p>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        variant="primary"
                        size="lg"
                        className="px-8 py-4 rounded-xl hover:scale-105 transition-transform shadow-xl shadow-[#392236]/30"
                        onClick={handleCTAClick}
                      >
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="px-8 py-4 rounded-xl border-[#392236] text-[#EBD197] hover:bg-[#162138]/50 hover:border-[#392236] transition-all"
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}

export default HomePage