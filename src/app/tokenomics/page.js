"use client";
import { Navigation } from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { TrendingUp, PieChart, Lock, Zap, Shield, Globe, Award, ArrowRight, CheckCircle, Coins, Flame, Calendar, BarChart3, LineChart, Activity, Wallet, Timer, Sparkles, Layers, Target, Diamond } from "lucide-react";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart as RechartsLineChart, Line, Area, AreaChart, RadialBarChart, RadialBar } from "recharts";
import { useState } from "react";

export default function Tokenomics() {
  const [activeTab, setActiveTab] = useState("distribution");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

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
  };

  const distributionData = [
    { label: "Presale", value: 40, color: "#EBD197", icon: Coins, tokens: "400M", description: "Early supporters allocation" },
    { label: "Liquidity Pool", value: 25, color: "#B48811", icon: Globe, tokens: "250M", description: "DEX liquidity provision" },
    { label: "Marketing", value: 15, color: "#BB9B49", icon: TrendingUp, tokens: "150M", description: "Growth and partnerships" },
    { label: "Team", value: 10, color: "#F97316", icon: Shield, tokens: "100M", description: "Team and advisors" },
    { label: "Development", value: 5, color: "#EF4444", icon: Zap, tokens: "50M", description: "R&D and innovation" },
    { label: "Community", value: 5, color: "#DC2626", icon: Award, tokens: "50M", description: "Rewards and airdrops" },
  ];

  const utilityItems = [
    { icon: Flame, title: "Prediction Staking", desc: "Stake tokens to participate in markets and earn rewards for accurate predictions", percentage: 25, color: "#EBD197" },
    { icon: Shield, title: "Governance Rights", desc: "Vote on platform decisions, feature proposals, and parameter adjustments", percentage: 15, color: "#B48811" },
    { icon: Globe, title: "Fee Discounts", desc: "Reduced platform fees for token holders when creating or participating in markets", percentage: 20, color: "#BB9B49" },
    { icon: Zap, title: "Liquidity Mining", desc: "Earn additional tokens by providing liquidity to EpochEra trading pairs", percentage: 15, color: "#F97316" },
    { icon: Award, title: "Telegram Premium", desc: "Access exclusive features and enhanced prediction tools within Telegram", percentage: 10, color: "#EF4444" },
    { icon: TrendingUp, title: "Revenue Sharing", desc: "Receive a share of platform revenue through automated reward distribution", percentage: 15, color: "#DC2626" },
  ];

  const vestingData = [
    { phase: "Presale Tokens", unlock: "TGE", lock: "No vesting", color: "#EBD197", percentage: 100, icon: Timer },
    { phase: "Liquidity Pool", unlock: "TGE", lock: "Locked permanently", color: "#B48811", percentage: 100, icon: Lock },
    { phase: "Team & Advisors", unlock: "12-month cliff", lock: "24-month linear vesting", color: "#BB9B49", percentage: 20, icon: Shield },
    { phase: "Marketing & Dev", unlock: "TGE", lock: "18-month linear vesting", color: "#F97316", percentage: 30, icon: TrendingUp },
    { phase: "Community Rewards", unlock: "Monthly", lock: "Based on engagement", color: "#EF4444", percentage: 50, icon: Award },
  ];

  const vestingScheduleData = [
    { month: "TGE", presale: 400, liquidity: 250, marketing: 150, team: 0, dev: 0, community: 0 },
    { month: "Month 6", presale: 400, liquidity: 250, marketing: 50, team: 0, dev: 10, community: 20 },
    { month: "Month 12", presale: 400, liquidity: 250, marketing: 100, team: 0, dev: 20, community: 40 },
    { month: "Month 18", presale: 400, liquidity: 250, marketing: 150, team: 25, dev: 30, community: 60 },
    { month: "Month 24", presale: 400, liquidity: 250, marketing: 150, team: 50, dev: 40, community: 80 },
    { month: "Month 30", presale: 400, liquidity: 250, marketing: 150, team: 75, dev: 50, community: 100 },
    { month: "Month 36", presale: 400, liquidity: 250, marketing: 150, team: 100, dev: 50, community: 120 },
  ];

  const revenueModelData = [
    { source: "Platform Fees", amount: 450000, percentage: 45, color: "#EBD197", icon: PieChart },
    { source: "Staking Rewards", amount: 300000, percentage: 30, color: "#B48811", icon: Award },
    { source: "Token Burn", amount: 150000, percentage: 15, color: "#BB9B49", icon: Flame },
    { source: "Treasury", amount: 100000, percentage: 10, color: "#F97316", icon: Wallet },
  ];

  const tokenBurnData = [
    { month: "Month 1", burn: 50000, circulating: 950000 },
    { month: "Month 3", burn: 150000, circulating: 850000 },
    { month: "Month 6", burn: 300000, circulating: 700000 },
    { month: "Month 12", burn: 500000, circulating: 500000 },
    { month: "Month 18", burn: 650000, circulating: 350000 },
    { month: "Month 24", burn: 750000, circulating: 250000 },
    { month: "Month 36", burn: 850000, circulating: 150000 },
  ];

  const stats = [
    { label: "Total Supply", value: "1B", icon: Coins },
    { label: "Network", value: "TBA", icon: Globe },
    { label: "Token Type", value: "ERC-20", icon: Shield },
    { label: "Contract", value: "TBA", icon: Lock },
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 overflow-x-hidden">
        <div className="fixed top-0 w-full backdrop-blur-md bg-gradient-to-r from-[#EBD197]/90 via-[#B48811]/90 to-[#BB9B49]/90 shadow-lg text-white py-2 text-center font-semibold font-mono z-40 px-2">
          <div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl whitespace-normal sm:whitespace-nowrap px-1 sm:px-4">
            Powering the Future of Decentralized Predictions on Telegram
          </div>
        </div>
        <Navigation />
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="pt-24"
        >
          {/* Hero Section - Matching Home Page Style */}
          <motion.div variants={itemVariants} className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-20 overflow-hidden">
            {/* Animated Background matching home page */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#EBD197]/5 via-transparent to-blue-500/5" />
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#EBD197]/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#B48811]/10 rounded-full blur-3xl animate-pulse delay-1000" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#A2790D]/5 rounded-full blur-3xl" />
            </div>
            
            <div className="max-w-7xl mx-auto relative z-10 w-full">
              <div className="text-center space-y-8">
                <motion.div variants={itemVariants}>
                  <motion.h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white leading-tight tracking-tight">
                    Tokenomics
                  </motion.h1>
                  
                  <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49] leading-tight">
                    A Sustainable Token Economy
                  </motion.h2>
                  
                  <motion.p variants={itemVariants} className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
                    Strategically designed for long-term growth, community empowerment, and sustainable value creation in the decentralized prediction market ecosystem.
                  </motion.p>
                </motion.div>
                
                <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-8">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      className="bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 hover:border-[#B48811]/50 transition-all duration-500 hover:transform hover:scale-105"
                    >
                      <stat.icon className="w-8 h-8 text-[#EBD197] mb-3 mx-auto" />
                      <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Token Distribution - Matching Home Page Style */}
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
                  Token <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49]">Distribution</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">Every token allocated with purpose - building for the long term</p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Interactive Chart */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#EBD197]/20 to-[#B48811]/20 rounded-3xl blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8 hover:border-[#B48811]/50 transition-all duration-500">
                    <ResponsiveContainer width="100%" height={800}>
                      <RechartsPieChart>
                        <Pie
                          data={distributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={120}
                          outerRadius={240}
                          paddingAngle={3}
                          dataKey="value"
                          animationBegin={0}
                          animationDuration={1200}
                          animationEasing="ease-out"
                        >
                          {distributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.2)" strokeWidth={2} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(24, 24, 27, 0.95)",
                            border: "1px solid #3f3f46",
                            borderRadius: "12px",
                            color: "#fff",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
                          }}
                          formatter={(value, name, props) => [
                            <div className="font-bold text-lg">{value}%</div>,
                            <div className="text-sm text-gray-400">{name}</div>,
                            <div className="text-xs text-[#EBD197]">{props.payload.tokens} tokens</div>
                          ]}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-white mb-1">1B</div>
                        <div className="text-xs text-gray-400">Total Supply</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Distribution Cards */}
                <div className="space-y-4">
                  {distributionData.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#EBD197]/20 to-[#B48811]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-6 hover:border-[#B48811]/50 transition-all duration-500 hover:transform hover:scale-105">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#EBD197]/20 to-[#B48811]/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <item.icon className="w-7 h-7 text-[#EBD197]" />
                            </div>
                            <div>
                              <div className="text-white font-semibold text-lg">{item.label}</div>
                              <div className="text-sm text-gray-400">{item.description}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-[#EBD197]">{item.value}%</div>
                            <div className="text-sm text-gray-400">{item.tokens}</div>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-zinc-700/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.value}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: i * 0.1, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-[#EBD197] to-[#B48811]"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Token Utility - Matching Home Page Style */}
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
                  Token <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49]">Utility</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">Multiple use cases driving demand and ecosystem growth</p>
              </motion.div>

              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {utilityItems.map((item, i) => (
                  <motion.div variants={itemVariants} key={i} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#EBD197]/20 to-[#B48811]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-10 hover:border-[#B48811]/50 transition-all duration-500 hover:transform hover:scale-105">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#EBD197]/20 to-[#B48811]/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="h-10 w-10 text-[#EBD197]" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                      <p className="text-gray-400 leading-relaxed mb-6">{item.desc}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold text-[#EBD197]">{item.percentage}%</div>
                        <div className="w-24 h-2 bg-zinc-700/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.percentage}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: i * 0.15, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-[#EBD197] to-[#B48811]"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Vesting Schedule - Matching Home Page Style */}
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
                  Vesting <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49]">Schedule</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">Structured token release ensuring long-term commitment and stability</p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Vesting Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#EBD197]/20 to-[#B48811]/20 rounded-3xl blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8 hover:border-[#B48811]/50 transition-all duration-500">
                    <h3 className="text-2xl font-bold text-white mb-6">Token Release Timeline</h3>
                    <ResponsiveContainer width="100%" height={600}>
                      <AreaChart data={vestingScheduleData}>
                        <defs>
                          <linearGradient id="colorPresale" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EBD197" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#EBD197" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorTeam" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#BB9B49" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#BB9B49" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.5} />
                        <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                        <YAxis stroke="#71717a" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(24, 24, 27, 0.95)",
                            border: "1px solid #3f3f46",
                            borderRadius: "12px",
                            color: "#fff",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
                          }}
                        />
                        <Area type="monotone" dataKey="presale" stackId="1" stroke="#EBD197" fillOpacity={1} fill="url(#colorPresale)" name="Presale" />
                        <Area type="monotone" dataKey="team" stackId="1" stroke="#BB9B49" fillOpacity={1} fill="url(#colorTeam)" name="Team" />
                        <Area type="monotone" dataKey="marketing" stackId="1" stroke="#F97316" fillOpacity={0.7} fill="#F97316" name="Marketing" />
                        <Area type="monotone" dataKey="dev" stackId="1" stroke="#EF4444" fillOpacity={0.7} fill="#EF4444" name="Development" />
                        <Area type="monotone" dataKey="community" stackId="1" stroke="#DC2626" fillOpacity={0.7} fill="#DC2626" name="Community" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Vesting Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {vestingData.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#EBD197]/20 to-[#B48811]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-6 hover:border-[#B48811]/50 transition-all duration-500 hover:transform hover:scale-105">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197]/20 to-[#B48811]/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <item.icon className="w-6 h-6 text-[#EBD197]" />
                          </div>
                          <h3 className="text-lg font-bold text-white">{item.phase}</h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Unlock</span>
                            <span className="text-white font-medium">{item.unlock}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Lock Period</span>
                            <span className="font-medium text-[#EBD197]">{item.lock}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Initial Release</span>
                            <span className="font-medium text-[#EBD197]">{item.percentage}%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Revenue Model - Matching Home Page Style */}
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
                  Revenue <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49]">Model</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">Built-in deflationary mechanisms for long-term value appreciation</p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Revenue Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#EBD197]/20 to-[#B48811]/20 rounded-3xl blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8 hover:border-[#B48811]/50 transition-all duration-500">
                    <h3 className="text-2xl font-bold text-white mb-6">Revenue Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueModelData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.5} />
                        <XAxis dataKey="source" stroke="#71717a" fontSize={12} />
                        <YAxis stroke="#71717a" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(24, 24, 27, 0.95)",
                            border: "1px solid #3f3f46",
                            borderRadius: "12px",
                            color: "#fff",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
                          }}
                          formatter={(value) => [`$${(value / 1000).toFixed(0)}K`, "Amount"]}
                        />
                        <Bar dataKey="amount" radius={[12, 12, 0, 0]}>
                          {revenueModelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Token Burn Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#EBD197]/20 to-[#B48811]/20 rounded-3xl blur-xl opacity-0 hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8 hover:border-[#B48811]/50 transition-all duration-500">
                    <h3 className="text-2xl font-bold text-white mb-6">Token Burn Projection</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsLineChart data={tokenBurnData}>
                        <defs>
                          <linearGradient id="colorBurn" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EBD197" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#EBD197" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" opacity={0.5} />
                        <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                        <YAxis stroke="#71717a" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(24, 24, 27, 0.95)",
                            border: "1px solid #3f3f46",
                            borderRadius: "12px",
                            color: "#fff",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
                          }}
                          formatter={(value) => [`${(value / 1000).toFixed(0)}K`, ""]}
                        />
                        <Area type="monotone" dataKey="burn" stroke="#EBD197" fillOpacity={1} fill="url(#colorBurn)" name="Tokens Burned" />
                        <Line type="monotone" dataKey="circulating" stroke="#B48811" strokeWidth={3} name="Circulating Supply" dot={{ fill: "#B48811" }} />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>

              {/* Revenue Feature Cards */}
              <motion.div 
                className="grid md:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {revenueModelData.map((item, i) => (
                  <motion.div variants={itemVariants} key={i} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#EBD197]/20 to-[#B48811]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-3xl px-2 py-4  hover:border-[#B48811]/50 transition-all duration-500 hover:transform hover:scale-105 text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#EBD197]/20 to-[#B48811]/20 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                        <item.icon className="h-10 w-10 text-[#EBD197]" />
                      </div>
                      <div className="text-4xl font-bold text-[#EBD197] mb-4">{item.percentage}%</div>
                      <h3 className="text-2xl font-bold text-white mb-4">{item.source}</h3>
                      <p className="text-gray-400 leading-relaxed">
                        ${((item.amount / 1000).toFixed(0))}K allocated for {item.source.toLowerCase()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* CTA Section - Matching Home Page Style */}
          <section className="py-32 px-4 relative">
            <div className="max-w-7xl mx-auto">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6">
                  Ready to <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49]">Join?</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-12">
                  Be part of the future of decentralized predictions on Telegram
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <button className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#EBD197] to-[#B48811] text-zinc-950 font-semibold px-10 py-5 rounded-full hover:scale-105 transition-transform shadow-2xl shadow-[#B48811]/20">
                    Get Started
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="inline-flex items-center gap-2 bg-zinc-800/50 backdrop-blur-sm border border-[#B48811] text-[#EBD197] font-semibold px-10 py-5 rounded-full hover:scale-105 transition-transform hover:bg-[#B48811]/10">
                    Learn More
                  </button>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Footer */}
          <Footer />
        </motion.div>
      </div>
    </>
  );
}
