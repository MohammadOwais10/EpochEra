'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Layers, Users, ScrollText, Wallet, Repeat, Pickaxe, Settings, CreditCard, MessageCircle, LogOut } from 'lucide-react'
import { clearAuthTokens } from '@/lib/utils'

const menuItems = [
  { icon: Layers, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: ScrollText, label: 'Audit Logs', path: '/admin/audit-logs' },
  { icon: Wallet, label: 'Wallet Transactions', path: '/admin/wallet/transactions' },
  { icon: Repeat, label: 'Sell Requests', path: '/admin/widget-b/sell-requests' },
  { icon: Pickaxe, label: 'Mining Content', path: '/admin/mining/content' },
  { icon: Settings, label: 'MLM Config', path: '/admin/mlm/config' },
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <aside className={`fixed md:sticky top-0 h-screen bg-gradient-to-b from-slate-950/80 to-slate-900/80 backdrop-blur-xl border-r border-slate-800/50 flex flex-col z-50 transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } w-64`}>
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300">
            <img src="/logo.png" alt="EpochEra" className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-xl">Admin</span>
            <span className="text-slate-400 text-xs">Control Panel</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map(({ icon: Icon, label, path }) => {
          const isActive = pathname === path || pathname.startsWith(`${path}/`)
          return (
            <Link
              key={path}
              href={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-[#EBD197] to-[#B48811] text-slate-950 shadow-lg'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-[#B48811]/5 to-transparent opacity-0 ${!isActive ? 'group-hover:opacity-100' : ''} transition-opacity duration-300`}></div>
              <Icon className={`w-5 h-5 relative ${isActive ? 'text-slate-950' : ''}`} />
              <span className="relative">{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 group relative overflow-hidden text-sm font-medium"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <LogOut className="w-5 h-5 relative group-hover:scale-110 transition-transform duration-300" />
          <span className="relative">Logout</span>
        </button>
      </div>
    </aside>
    </>
  )
}
