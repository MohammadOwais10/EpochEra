import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScrollToTop from "./components/ScrollToTop";
import ContextProvider from '@/context'
import Analytics from '@/components/Analytics'
import { Navigation } from "./components/Navbar";
import { headers } from 'next/headers'

export const metadata = {
  title: "EpochEra | Decentralized Prediction Protocol on TON",
  description: "Powering the future of decentralized predictions on Telegram. Mine, purchase, and build with Epoch tokens on the EpochEra platform - the next-generation TON Prediction Protocol.",
  alternates: {
    canonical: '/'
  },

}



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});



export default async function RootLayout({ children }) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie')
  
 

  return (
    <html lang="en">
      <head>
        






 
  
        {/* Preload critical resources */}
        <link rel="preload" href="/logo.png" as="image" type="image/webp" />
        <link rel="preload" href="/logo.png" as="image" type="image/png" />
        
    
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
         <ContextProvider cookies={cookies}>
          <Navigation />
          {children}
        </ContextProvider>
        <ScrollToTop />
        <Analytics />


      </body>
    </html>
  );
}