'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import toast, { Toaster } from 'react-hot-toast';
import Header from '@/components/ui/Header';
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import Loader from '@/components/ui/Loader';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { address } = useAccount();


  useEffect(() => {
    if (!address) {
      router.push("/");
    }
  }, [address, router]);

  // Always show loader while waiting or no address
  if (!address ) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-background text-zinc-100 flex">
      {/* Sidebar - Fixed on all screens */}
      <div className="fixed inset-y-0 left-0 z-30 w-64 hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sidebar />
      </div>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header - Fixed at top */}
        <header className="fixed top-0 right-0 left-0 lg:left-64 z-20 bg-background/40 backdrop-blur-sm border-b border-zinc-800">
          <div className="h-16 flex items-center px-6">
            <Header />
          </div>
        </header>

        {/* Main content - Scrollable */}
        <main className="pt-20 md:pt-24 overflow-y-auto h-screen p-4 sm:p-6">
          <div className="md:px-4 mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          className: 'bg-zinc-900 text-white',
          style: {
            border: '1px solid #374151',
            color: '#fff',
            background: '#18181b',
          },
        }}
      />
    </div>
  );
}