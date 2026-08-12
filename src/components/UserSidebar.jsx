'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Layers, Wallet, Users, Pickaxe, Coins, CreditCard, Repeat, MessageCircle, LogOut } from 'lucide-react'

const menuItems = [
  { icon: Layers, label: 'Dashboard', path: '/user/dashboard' },
  { icon: Wallet, label: 'Wallet', path: '/user/wallet' },
  { icon: Users, label: 'MLM / Referrals', path: '/user/mlm' },
  { icon: Pickaxe, label: 'Mining', path: '/user/mining' },
  { icon: Coins, label: 'Membership', path: '/user/membership' },
  { icon: CreditCard, label: 'Widget A', path: '/user/widget-a' },
  { icon: Repeat, label: 'Widget B', path: '/user/widget-b' },
  { icon: MessageCircle, label: 'Support', path: '/user/tickets' },
]

export function UserSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/signin')
  }

  return (
    <aside className="w-64 h-screen bg-gradient-to-r from-[#392236]/40 via-[#392236]/80 to-[#392236] backdrop-blur-xl border-r border-zinc-800 flex flex-col fixed top-0 left-0 z-40">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="EpochEra" className="w-10 h-10" />
          <span className="text-white font-bold text-xl">EpochEra</span>
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
                  : 'text-zinc-400 hover:bg-[#162138] hover:text-white'
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
          className="flex items-center gap-3 w-full px-4 py-3 text-zinc-400 hover:text-white hover:bg-[#162138] rounded-xl transition-colors text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
