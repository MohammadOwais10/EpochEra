'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Layers, Users, ScrollText, Wallet, Repeat, Pickaxe, Settings, CreditCard, MessageCircle, LogOut } from 'lucide-react'

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

export function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/signin')
  }

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 border-r border-zinc-800 flex flex-col sticky top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="EpochEra" className="w-10 h-10" />
          <span className="text-white font-bold text-xl">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map(({ icon: Icon, label, path }) => {
          const isActive = pathname === path || pathname.startsWith(`${path}/`)
          return (
            <Link
              key={path}
              href={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-[#EBD197] to-[#B48811] text-zinc-950'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
