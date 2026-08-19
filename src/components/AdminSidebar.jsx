'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Layers, Users, ScrollText, Wallet, Repeat, Pickaxe, Settings, CreditCard, MessageCircle, LogOut, ShieldCheck, Coins, Download } from 'lucide-react'
import { clearAuthTokens } from '@/lib/utils'

const menuItems = [
  { icon: Layers, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: ScrollText, label: 'Audit Logs', path: '/admin/audit-logs' },
  { icon: Wallet, label: 'Wallet Transactions', path: '/admin/wallet/transactions' },
  { icon: Repeat, label: 'Sell Requests', path: '/admin/widget-b/sell-requests' },
  { icon: Download, label: 'USD Withdrawals', path: '/admin/usd-withdrawals' },
  { icon: Pickaxe, label: 'Mining Content', path: '/admin/mining/content' },
  { icon: ShieldCheck, label: 'Social Verifications', path: '/admin/mining/social-verifications' },
  { icon: Settings, label: 'MLM Config', path: '/admin/mlm/config' },
  { icon: Coins, label: 'Coin Config', path: '/admin/coin-config' },
  { icon: CreditCard, label: 'Deposit Wallet', path: '/admin/deposit-wallet' },
  { icon: MessageCircle, label: 'Support', path: '/admin/tickets' },
]

export function AdminSidebar({ isMobileMenuOpen = false, setIsMobileMenuOpen = () => {} }) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    clearAuthTokens()
    router.push('/signin')
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <aside className={`fixed md:sticky top-0 h-screen bg-linear-to-b from-slate-950/95 to-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 flex flex-col z-50 transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } w-64 sm:w-72 lg:w-72`}>
      <div className="p-4 sm:p-5 lg:p-6">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300 shrink-0">
            <img src="/logo.png" alt="EpochEra" className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-white font-bold text-lg sm:text-xl">Admin</span>
            <span className="text-slate-400 text-xs sm:text-sm">Control Panel</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 sm:px-4 space-y-1 overflow-y-auto">
        {menuItems.map(({ icon: Icon, label, path }) => {
          const isActive = pathname === path || pathname.startsWith(`${path}/`)
          return (
            <Link
              key={path}
              href={path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-[#EBD197] to-[#B48811] text-slate-950 shadow-lg'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <div className={`absolute inset-0 bg-linear-to-br from-[#B48811]/5 to-transparent opacity-0 ${!isActive ? 'group-hover:opacity-100' : ''} transition-opacity duration-300`}></div>
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 relative ${isActive ? 'text-slate-950' : ''} shrink-0`} />
              <span className="relative">{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-3 sm:p-4 border-t border-slate-800/50 space-y-2">
        {/* User Info Section */}
        <div className="px-2 py-2 rounded-lg bg-slate-800/30 border border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-[#EBD197] to-[#B48811] rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs sm:text-sm font-medium truncate">Admin User</p>
              <p className="text-slate-400 text-xs truncate">admin@epochera.com</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2.5 sm:py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 group relative overflow-hidden text-xs sm:text-sm font-medium"
        >
          <div className="absolute inset-0 bg-linear-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5 relative group-hover:scale-110 transition-transform duration-300 shrink-0" />
          <span className="relative">Logout</span>
        </button>
      </div>
    </aside>
    </>
  )
}
