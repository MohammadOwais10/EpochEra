'use client'

import { wagmiAdapter, projectId } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { bscTestnet } from '@reown/appkit/networks'
import React, { useEffect } from 'react'
import { cookieToInitialState, WagmiProvider } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
  name: 'EpochEra',
  description: 'EpochEra - Decentralized Prediction Protocol',
  url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5001',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Create the modal at module load (runs on client and server).
// createAppKit is safe to call at module scope; it only attaches the
// w3m-modal custom element on the client. The useAppKit hook requires
// this to have run before any component using it renders.
let modal = null
try {
  modal = createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: [bscTestnet],
    defaultNetwork: bscTestnet,
    metadata: metadata,
    features: {
      analytics: true,
      swaps: false,
      socials: false,
      email: false,
      onramp: false
    },
    themeMode: 'dark'
  })
  if (typeof window !== 'undefined') {
    console.log('[AppKit] initialized with projectId', projectId)
  }
} catch (err) {
  if (typeof window !== 'undefined') {
    console.error('[AppKit] failed to initialize:', err)
  }
}

function ContextProvider({ children, cookies }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies)

  // Center the Reown modal inside its shadow DOM once it appears.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const centerModal = () => {
      const el = document.querySelector('w3m-modal')
      if (!el || !el.shadowRoot) return
      if (el.shadowRoot.querySelector('#appkit-center-style')) return
      const style = document.createElement('style')
      style.id = 'appkit-center-style'
      style.textContent = `
        wui-flex {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 100% !important;
          min-height: 100% !important;
          padding: 0 !important;
        }
      `
      el.shadowRoot.appendChild(style)
    }
    centerModal()
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const n of m.addedNodes) {
          if (n.nodeName?.toLowerCase() === 'w3m-modal') {
            centerModal()
          }
        }
      }
    })
    observer.observe(document.body, { childList: true })
    return () => observer.disconnect()
  }, [])

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider
