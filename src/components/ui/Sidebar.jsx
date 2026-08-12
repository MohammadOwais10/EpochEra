'use client';

import { useState, useCallback } from 'react';
import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
} from "@reown/appkit/react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  Layers,
  Calculator,
  TrendingUp,
  Users,
  User,
  Copy,
  Menu,
  X,
  Check,
  ShoppingCart,
  Home,
} from 'lucide-react';
import Image from 'next/image';

const menuItems = [
  { icon: Layers, label: 'Dashboard', path: '/dashboard' },
  { icon: Layers, label: 'Buy EpochEra', path: '/dashboard/buy-epochera' },
  { icon: Calculator, label: 'Calculator', path: '/dashboard/calculator' },
  { icon: TrendingUp, label: 'Earning', path: '/dashboard/earning' },
  { icon: Users, label: 'Referral', path: '/dashboard/referral' },
  { icon: User, label: 'Profile', path: '/dashboard/profile' },
  { icon: ShoppingCart, label: 'How to Buy', path: '/dashboard/how-to-buy' },
];



const Sidebar = () => {
  const { address } = useAppKitAccount();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyAddress = useCallback(async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setIsCopied(true);
      toast.success('Wallet address copied!');
      
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy address');
    }
  }, [address]);

  const handleMenuClick = useCallback(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, []);

  const SidebarContent = useCallback(({ showClose = false }) => (
    <div className="flex flex-col h-full bg-gradient-to-bl from-[#162138]/80 to-[#392236]/80 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 sm:p-6">
        <Link href="/" className="flex items-center group gap-2">
          <Image src="/logo.png" alt="EpochEra Coin Logo" width={50} height={50} />
          <span className="text-white font-bold text-xl truncate">EpochEra Coin</span>
        </Link>

        {showClose && (
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-[#162138] lg:hidden transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="space-y-1 px-2 sm:px-4 flex-grow overflow-y-auto">
        {menuItems.map(({ icon: Icon, label, path }) => {
          const isActive = pathname === path;
          return (
            <Link
              key={path}
              href={path}
              onClick={handleMenuClick}
              className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#392236]   text-yellow-400'
                  : 'text-zinc-400 hover:text-white hover:bg-[#162138]'
              }`}
            >
              <div className={`relative w-8 h-8 flex items-center justify-center ${
                isActive ? 'text-yellow-400' : 'text-zinc-500 group-hover:text-zinc-300'
              }`}>
                <Icon className="w-5 h-5" />
                {isActive && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-yellow-500 rounded-r-full" />
                )}
              </div>
              <span className="ml-3 font-medium text-sm">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {address && (
      <div className="p-3 border-t border-zinc-800">
        <div className="bg-gradient-to-br from-[#162138] to-[#392236] rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center min-w-0">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 flex-shrink-0" />
            <span className="text-xs text-zinc-300 font-mono truncate" title={address}>
              {address ? `${address.substring(0, 8)}...${address.substring(address.length - 6)}` : 'Not connected'}
            </span>
          </div>
          <button
            onClick={handleCopyAddress}
            aria-label={isCopied ? 'Copied!' : 'Copy address'}
            className="ml-2 p-1.5 rounded-md hover:bg-[#162138] transition-colors flex-shrink-0"
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-zinc-400" />
            )}
          </button>
        </div>
      </div>
    )}
    </div>
  ), [handleMenuClick, isCopied, pathname, address]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-[#162138]/80 backdrop-blur-sm text-white rounded-lg shadow-lg hover:bg-[#392236]/80 transition-colors border border-zinc-800"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div
        className={`fixed inset-0 z-50 bg-[#162138]/80 backdrop-blur-sm transform transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div 
          className={`fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-[#162138] to-[#392236] border-r border-zinc-800 transform transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <SidebarContent showClose={true} />
        </div>
      </div>

      <aside className="hidden lg:flex lg:flex-col lg:w-64 h-screen fixed top-0 left-0 z-40">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;