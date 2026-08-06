"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import {
  SiBitcoin,
  SiDogecoin,
  SiLitecoin,
  SiZcash,
  SiMonero,
  SiRipple,
  SiEthereum,
  SiFacebook,
  SiX,
  SiInstagram,
  SiTelegram,
  SiYoutube,
  SiLinkedin,
  SiReddit,
  SiThreads
} from "react-icons/si"
import Image from "next/image"

export default function Footer() {
  

  const socials = [
    { Icon: SiX, label: "X", url: "https://x.com/", color: "#000000" },
    { Icon: SiInstagram, label: "Instagram", url: "https://www.instagram.com/", color: "#E4405F" },
    { Icon: SiYoutube, label: "YouTube", url: "https://www.youtube.com/", color: "#FF0000" },
    { Icon: SiLinkedin, label: "LinkedIn", url: "https://www.linkedin.com/", color: "#0077B5" },
    { Icon: SiReddit, label: "Reddit", url: "https://www.reddit.com/user/", color: "#FF4500" },
    { Icon: SiThreads, label: "Threads", url: "https://www.threads.com/", color: "#000000" }
  ]

  return (
    <footer className=" text-white py-8">
      <div className="">
        <div className="md:max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-6">
                  <img src="/logo.png" className="w-12 h-12" alt="EpochEra Coin Logo" />
              <span className="text-2xl font-bold text-white">EpochEra</span>
            </Link>
            <p className="text-white mb-6 leading-relaxed">
              Democratizing financial services through a secure, transparent blockchain platform that connects individuals worldwide.
            </p>
          </div>

        
         

          {/* Social Media & Contact */}
          <div className="lg:col-span-1">
            <p className="text-lg font-semibold mb-6 text-white">Connect With Us</p>
            <div className="flex space-x-2 mdspace-x-4 mb-6">
              {socials.map(({ Icon, label, url, color }, index) => (
                <motion.a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="
                    w-12 h-12 
                  bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl
                    shadow-black/10
                    flex items-center justify-center
                    hover:bg-[#B48811]
                    hover:scale-110
                    hover:shadow-xl
                    hover:border-white/30
                    transition-all duration-300
                    group-hover:backdrop-blur-2xl
                  ">
                    <Icon 
                      className="w-6 h-6 transition-colors duration-300 text-white" 
                     
                    />
                  </div>
                  
                  {/* Tooltip */}
                  <div className="
                    absolute -top-10 left-1/2 transform -translate-x-1/2
                    bg-black/80 backdrop-blur-sm
                    text-white text-xs px-2 py-1 rounded-md
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-300
                    pointer-events-none
                    whitespace-nowrap
                  ">
                    {label}
                  </div>
                </motion.a>
              ))}
            </div>
            
          <div className="space-y-2">

</div>

          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
          <div className="md:max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <p className="text-white text-sm mb-4 md:mb-0">
              © 2026 EpochEra. All rights reserved.
            </p>
            <Link 
              href="/disclaimer" 
              className="text-white text-sm hover:text-[#EBD197] transition-colors duration-300"
            >
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}