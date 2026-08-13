"use client"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  Home,
  User,
  Wallet,
  FileText,
  FolderPlus,
  ShoppingBag,
  Coins,
  List,
  BarChart3,
  History,
  HelpCircle,
  LogOut,
  ChevronDown,
  ChevronUp,
  UserCheck,
  RefreshCcw,
  Users,
  Layers,
  Activity,
  Repeat,
  X,
  Eye,
  EyeOff,
  Menu,
  Search,
  KeyRound
} from "lucide-react"
import Link from "next/link"
import { getUserById, sendOTPforTransactionPassword, createTransactionPassword, checkTransactionPassword, api } from "../lib/api"
import { clearAuthTokens } from "@/lib/utils"


const navMenu = [
  { key: "dashboard", label: "Dashboard", icon: <Home />, url: "/user/dashboard" },
  {
    key: "userinfo", label: "User Info", icon: <User />, subMenu: [
      { key: "profile", label: "Profile", url: "/user/profile", icon: <UserCheck /> },
      { key: "resetpassword", label: "Reset Password", url: "/user/resetpassowrd", icon: <RefreshCcw /> }
    ]
  },
  { key: "wallet", label: "Wallet", icon: <Wallet />, url: "/user/wallet" },
  {
    key: "community", label: "Community", icon: <FileText />, subMenu: [
      { key: "directreferral", label: "Direct Referral", url: "/user/directreferal", icon: <Users /> },
      // { key: "levelview", label: "Level View", url: "/user/levelview", icon: <Layers /> }
    ]
  },
  // {
  //   key: "addfund", label: "Add Fund", icon: <FolderPlus />, subMenu: [
  //     { key: "fundreport", label: "Fund Report", url: "/user/fundwalletreport", icon: <FileText /> }
  //   ]
  // },

  { key: "buynabtoken", label: "Buy EpochEra Coin", icon: <Coins />, url: "/user/buynabcoin" },
    { key: "changetransactionpassword", label: "Change Transaction Password", icon: <KeyRound />, url: "/user/changetransactionpassword" },
  // {
  //   key: "transaction", label: "Transaction", icon: <List />, subMenu: [
  //     { key: "p2p", label: "P2P (Main to Fund Wallet)", url: "/user/p2p", icon: <Activity /> }
  //   ]
  // },
  // {
  //   key: "earnings", label: "Earnings", icon: <BarChart3 />, subMenu: [
  //     { key: "referralhome", label: "Referral Home", url: "/user/referalincome", icon: <Users /> },
  //     // { key: "levelincome", label: "Level Income", url: "/user/levelincome", icon: <Layers /> },
  //     { key: "incomewalletreport", label: "Income Wallet Report", url: "/user/incomewalletreport", icon: <FileText /> }
  //   ]
  // },
  { key: "withdrawal", label: "History", icon: <History />, url: "/user/withdrawalhistory" },
  { key: "support", label: "Support", icon: <HelpCircle />, url: "/user/support" },
]

export default function userNavbar({ 
  activePage, 
  setActivePage, 
  expandedMenu, 
  setExpandedMenu 
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [userData, setUserData] = useState(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [isCreatingPassword, setIsCreatingPassword] = useState(false)
  const [otp, setOtp] = useState('')
  const [transactionOtp, setTransactionOtp] = useState(Array(6).fill(''))
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [showTransactionOtp, setShowTransactionOtp] = useState(false)

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const response = await getUserById(payload.id)
          if (response?.success) {
            setUserData(response.user)
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchUserData()
  }, [])

  // Update active page based on current pathname
  useEffect(() => {
    const path = pathname.split('/').pop()
    if (path === 'user') {
      setActivePage('dashboard')
    } else {
      setActivePage(path)
    }
  }, [pathname, setActivePage])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Toggle dropdown submenu open/close
  const toggleMenu = (key) => {
    if (expandedMenu === key) {
      setExpandedMenu(null)
    } else {
      setExpandedMenu(key)
    }
  }

  // Handle navigation with transaction password check
  const handleNavigation = (url) => {
    // List of URLs that require transaction verification
    const transactionRequiredUrls = ['/user/buynabcoin', '/user/p2p']
    
    if (transactionRequiredUrls.includes(url)) {
      if (!userData?.isTransactionPasswordPresent) {
        setIsCreatingPassword(true)
        setShowPasswordModal(true)
      } else {
        setIsCreatingPassword(false)
        setShowPasswordModal(true)
      }
    } else {
      router.push(url)
    }
  }

  // Send OTP for transaction password
  const handleSendOTP = async () => {
    try {
      setLoading(true)
      setError('')
      await sendOTPforTransactionPassword()
      alert('OTP sent successfully!')
    } catch (error) {
      setError(error.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  // Create transaction password
  const handleCreatePassword = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (!otp || !password) {
      setError('Please fill all fields')
      return
    }
    
    try {
      setLoading(true)
      setError('')
      await createTransactionPassword({ otpForTransactionPassword: otp, transactionPassword: password })
      setShowPasswordModal(false)
      setUserData(prev => ({ ...prev, isTransactionPasswordPresent: true }))
      router.push('/user/buynabcoin')
      resetForm()
    } catch (error) {
      setError(error.message || 'Failed to create password')
    } finally {
      setLoading(false)
    }
  }

  // Handle transaction OTP change
  const handleTransactionOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    
    const newOtp = [...transactionOtp]
    newOtp[index] = value
    setTransactionOtp(newOtp)
    
    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[data-otp-index="${index + 1}"]`)
      nextInput?.focus()
    }
  }

  // Handle transaction OTP backspace
  const handleTransactionOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !transactionOtp[index] && index > 0) {
      const prevInput = document.querySelector(`input[data-otp-index="${index - 1}"]`)
      prevInput?.focus()
    }
  }

  // Send OTP for transaction
  const handleSendTransactionOTP = async () => {
    try {
      setLoading(true)
      setError('')
      await sendOTPforTransactionPassword()
      setOtpSent(true)
      // Clear previous OTP when sending new one
      setTransactionOtp(Array(6).fill(''))
      alert('Transaction OTP sent successfully!')
    } catch (error) {
      setError(error.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  // Verify transaction password with OTP
  const handleVerifyPassword = async () => {
    if (!password) {
      setError('Please enter your transaction password')
      return
    }
    
    const otpString = transactionOtp.join('')
    if (otpString.length !== 6) {
      setError('Please enter the 6-digit OTP')
      return
    }
    
    try {
      setLoading(true)
      setError('')
      
      const payload = {
        transactionPassword: password,
        otpForTransactionPassword: otpString
      }
      
      const response = await api.post('/user/checkTransactionPassword', payload)
      const responseData = response.data
      if (responseData && responseData.success) {
        // Store the transaction token for future use
        if (responseData.transactionToken) {
          localStorage.setItem('transactionToken', responseData.transactionToken)
        }
        setShowPasswordModal(false)
        router.push('/user/buynabcoin')
        resetForm()
      } else {
        setError(responseData?.message || 'Invalid password or OTP')
      }
    } catch (error) {
      setError(error.message || 'Invalid password or OTP')
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setOtp('')
    setTransactionOtp(Array(6).fill(''))
    setPassword('')
    setConfirmPassword('')
    setError('')
    setShowPassword(false)
    setOtpSent(false)
    setShowTransactionOtp(false)
  }

  // Close modal
  const closeModal = () => {
    setShowPasswordModal(false)
    resetForm()
  }

  // Handle submenu item click
  const handleMenuClick = (key, url, hasSubMenu) => {
    if (hasSubMenu) {
      toggleMenu(key)
    } else {
      handleNavigation(url)
    }
  }

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
               <img src="/logo.png" className="w-8 h-8" alt="EpochEra" />
            <span className="font-bold text-lg tracking-wider text-white">EpochEra</span>
          </Link>
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={toggleMobileMenu} />
      )}

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] z-50 bg-slate-900/95 backdrop-blur-sm border-r border-slate-700/50 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
            <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" className="w-8 h-8" alt="EpochEra" />
              <span className="font-bold text-lg tracking-wider text-white">EpochEra</span>
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="flex flex-col gap-1 px-4">
              {navMenu.map(({ key, label, icon, url, subMenu }) => {
                const isExpanded = expandedMenu === key
                const isActive = activePage === key || (subMenu?.some(s => s.key === activePage))
                
                return (
                  <li key={key}>
                    <button
                      onClick={() => handleMenuClick(key, url, !!subMenu)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                        isActive ? "bg-[#008ec0] text-white" : "hover:bg-slate-800 text-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5">{icon}</span>
                        <span className="text-sm">{label}</span>
                      </div>
                      {subMenu && (
                        isExpanded 
                          ? <ChevronUp className="w-4 h-4" /> 
                          : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {/* Dropdown submenu */}
                    {subMenu && isExpanded && (
                      <ul className="bg-slate-800/50 ml-4 mt-1 rounded-lg border border-slate-700/50">
                        {subMenu.map(({ key: subKey, label: subLabel, url: subUrl, icon: subIcon }) => {
                          const isSubActive = activePage === subKey
                          return (
                            <li key={subKey}>
                              <button
                                onClick={() => {
                                  handleNavigation(subUrl)
                                }}
                                className={`w-full flex items-center gap-3 py-2 px-4 text-sm rounded hover:bg-[#008ec0] transition-colors ${
                                  isSubActive ? "bg-[#008ec0] text-white" : "text-blue-300"
                                }`}
                              >
                                <span className="w-4 h-4">{subIcon}</span>
                                <span>{subLabel}</span>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Mobile Logout */}
          <div className="p-4 border-t border-slate-700/50">
            <button 
              onClick={() => {
                clearAuthTokens()
                router.push('/signin')
              }}
              className="flex items-center gap-2 text-white hover:text-red-500 w-full py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 h-screen text-gray-100 py-8 flex-col shadow-lg bg-slate-900/95 backdrop-blur-sm border-r border-slate-700/50">
        <Link href="/" className="cursor-pointer">
          <div className="flex items-center gap-2 justify-center mb-8">
               <img src="/logo.png" className="w-10 h-10" alt="EpochEra" />
            <span className="text-center font-bold text-2xl tracking-widest">EpochEra</span>
          </div>
        </Link>      
        
        <nav className="flex-1 overflow-y-auto">
          <ul className="flex flex-col gap-1">
            {navMenu.map(({ key, label, icon, url, subMenu }) => {
              const isExpanded = expandedMenu === key
              const isActive = activePage === key || (subMenu?.some(s => s.key === activePage))
              
              return (
                <li key={key}>
                  <button
                    onClick={() => handleMenuClick(key, url, !!subMenu)}
                    className={`w-full flex items-center justify-between px-6 py-3 rounded-lg transition ${
                      isActive ? "bg-[#008ec0] text-white" : "hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5">{icon}</span>
                      <span>{label}</span>
                    </div>
                    {subMenu && (
                      isExpanded 
                        ? <ChevronUp className="w-4 h-4" /> 
                        : <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {/* Dropdown submenu */}
                  {subMenu && isExpanded && (
                    <ul className="bg-[#1e1a37] pl-12 border-l border-blue-600">
                      {subMenu.map(({ key: subKey, label: subLabel, url: subUrl, icon: subIcon }) => {
                        const isSubActive = activePage === subKey
                        return (
                          <li key={subKey}>
                            <button
                              onClick={() => {
                                handleNavigation(subUrl)
                              }}
                              className={`w-full flex items-center gap-3 py-2 text-sm rounded hover:bg-[#008ec0] transition-colors ${
                                isSubActive ? "bg-[#008ec0] text-white" : "text-blue-300"
                              }`}
                            >
                              <span className="w-4 h-4">{subIcon}</span>
                              <span>{subLabel}</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
        
        <div className="px-6 pt-4 border-t border-gray-700 mt-auto">
          <button 
            onClick={() => {
              clearAuthTokens()
              router.push('/signin')
            }}
            className="flex items-center gap-2 text-white hover:text-red-500 w-full py-2"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Transaction Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                {isCreatingPassword ? 'Create Transaction Password' : 'Enter Transaction Password'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 px-3 py-2 rounded mb-4">
                {error}
              </div>
            )}

            {isCreatingPassword ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">OTP</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="flex-1 bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter OTP"
                    />
                    <button
                      onClick={handleSendOTP}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 whitespace-nowrap"
                    >
                      {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm password"
                  />
                </div>
                <button
                  onClick={handleCreatePassword}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Password'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Transaction Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your transaction password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                {/* Transaction OTP Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">Transaction OTP</label>
                    <button
                      onClick={handleSendTransactionOTP}
                      disabled={loading}
                      className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send OTP'}
                    </button>
                  </div>
                  
                  <div className="flex gap-2 justify-center mb-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <input
                        key={index}
                        data-otp-index={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="w-10 h-12 text-center bg-slate-700 border border-slate-600 text-white text-xl rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={transactionOtp[index] || ""}
                        onChange={(e) => handleTransactionOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleTransactionOtpKeyDown(e, index)}
                        placeholder="0"
                      />
                    ))}
                  </div>
                  
                  {otpSent && (
                    <p className="text-sm text-green-400">OTP sent successfully! Check your email.</p>
                  )}
                </div>
                
                <button
                  onClick={handleVerifyPassword}
                  disabled={loading || transactionOtp.join('').length !== 6}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
} 