"use client"

import ReferralCard from "@/components/ui/ReferralCard"
import { contractConfig } from "@/constants/contract"
import { sortAddress } from "@/utlis"
import copy from "clipboard-copy";
import { Address, formatEther, formatUnits, parseUnits, zeroAddress } from "viem";
import { Copy, Link } from "lucide-react"
import { useAccount, useReadContract } from "wagmi"
import { useAppKitNetwork } from "@reown/appkit/react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast";
import Image from "next/image"

const socialLinks = [
  {
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: "bg-black",
    name: "X (Twitter)",
    link: "https://x.com/"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="white" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    name: "Instagram",
    link: ""
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="#0077B5" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    color: "bg-white",
    name: "LinkedIn",
    link: ""
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <path fill="#ff4500" d="M12 23.75c6.48935 0 11.75 -5.26065 11.75 -11.75S18.48935 0.25 12 0.25 0.25 5.51065 0.25 12s5.26065 11.75 11.75 11.75Z" stroke-width="0.25"></path>
        <path fill="#ffffff" d="M19.81645 12.11205c0 -0.952525 -0.770275 -1.708975 -1.708975 -1.708975 -0.46215 0 -0.88255 0.182 -1.19065 0.476275 -1.176575 -0.840525 -2.787625 -1.386775 -4.580675 -1.45675l0.784375 -3.670175 2.549475 0.54625c0.0282 0.644425 0.56035 1.162725 1.218875 1.162725 0.672375 0 1.2186 -0.54625 1.2186 -1.218875 0 -0.67235 -0.546225 -1.2186 -1.2186 -1.2186 -0.476275 0 -0.89665 0.280175 -1.09275 0.68645l-2.8435 -0.602375c-0.084075 -0.0141 -0.16815 0 -0.2243 0.04205 -0.069975 0.042025 -0.112 0.112 -0.12585 0.196075L11.73375 9.43645c-1.820975 0.056125 -3.459975 0.602375 -4.65065 1.457 -0.3081 -0.294275 -0.7285 -0.476275 -1.19065 -0.476275 -0.95255 0 -1.708975 0.770275 -1.708975 1.708975 0 0.7003 0.420125 1.288575 1.008675 1.554925 -0.0282 0.167875 -0.04205 0.33605 -0.04205 0.5183 0 2.6333 3.0678 4.776775 6.85 4.776775 3.7822 0 6.849975 -2.129375 6.849975 -4.776775 0 -0.16815 -0.0141 -0.350425 -0.042025 -0.5183 0.588275 -0.26635 1.0084 -0.868725 1.0084 -1.569025Zm-11.738775 1.2186c0 -0.67235 0.54625 -1.2186 1.218875 -1.2186 0.67235 0 1.2186 0.54625 1.2186 1.2186 0 0.672375 -0.54625 1.218875 -1.2186 1.218875 -0.672625 0.013825 -1.218875 -0.5465 -1.218875 -1.218875Zm6.82205 3.23595c-0.8405 0.840525 -2.437475 0.89665 -2.899625 0.89665 -0.476275 0 -2.073225 -0.070225 -2.8999 -0.89665 -0.12585 -0.126125 -0.12585 -0.3222 0 -0.448325 0.1261 -0.12585 0.3222 -0.12585 0.448325 0 0.5324 0.5324 1.6531 0.7144 2.451575 0.7144s1.933 -0.182 2.4513 -0.7144c0.126125 -0.12585 0.322225 -0.12585 0.448325 0 0.112025 0.126125 0.112025 0.3222 0 0.448325Zm-0.224275 -2.00325c-0.672375 0 -1.218625 -0.546225 -1.218625 -1.2186 0 -0.67235 0.54625 -1.2186 1.218625 -1.2186 0.6726 0 1.21885 0.54625 1.21885 1.2186 0 0.658275 -0.54625 1.2186 -1.21885 1.2186Z" stroke-width="0.25"></path>
      </svg>
    ),
    color: "bg-[#FF4500]",
    name: "Reddit",
    link: ""
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 512 512">
        <path d="M105 0h302c57.75 0 105 47.25 105 105v302c0 57.75-47.25 105-105 105H105C47.25 512 0 464.75 0 407V105C0 47.25 47.25 0 105 0z" /><path fill="#fff" fill-rule="nonzero" d="M337.36 243.58c-1.46-.7-2.95-1.38-4.46-2.02-2.62-48.36-29.04-76.05-73.41-76.33-25.6-.17-48.52 10.27-62.8 31.94l24.4 16.74c10.15-15.4 26.08-18.68 37.81-18.68h.4c14.61.09 25.64 4.34 32.77 12.62 5.19 6.04 8.67 14.37 10.39 24.89-12.96-2.2-26.96-2.88-41.94-2.02-42.18 2.43-69.3 27.03-67.48 61.21.92 17.35 9.56 32.26 24.32 42.01 12.48 8.24 28.56 12.27 45.26 11.35 22.07-1.2 39.37-9.62 51.45-25.01 9.17-11.69 14.97-26.84 17.53-45.92 10.51 6.34 18.3 14.69 22.61 24.73 7.31 17.06 7.74 45.1-15.14 67.96-20.04 20.03-44.14 28.69-80.55 28.96-40.4-.3-70.95-13.26-90.81-38.51-18.6-23.64-28.21-57.79-28.57-101.5.36-43.71 9.97-77.86 28.57-101.5 19.86-25.25 50.41-38.21 90.81-38.51 40.68.3 71.76 13.32 92.39 38.69 10.11 12.44 17.73 28.09 22.76 46.33l28.59-7.63c-6.09-22.45-15.67-41.8-28.72-57.85-26.44-32.53-65.1-49.19-114.92-49.54h-.2c-49.72.35-87.96 17.08-113.64 49.73-22.86 29.05-34.65 69.48-35.04 120.16v.24c.39 50.68 12.18 91.11 35.04 120.16 25.68 32.65 63.92 49.39 113.64 49.73h.2c44.2-.31 75.36-11.88 101.03-37.53 33.58-33.55 32.57-75.6 21.5-101.42-7.94-18.51-23.08-33.55-43.79-43.48zm-76.32 71.76c-18.48 1.04-37.69-7.26-38.64-25.03-.7-13.18 9.38-27.89 39.78-29.64 3.48-.2 6.9-.3 10.25-.3 11.04 0 21.37 1.07 30.76 3.13-3.5 43.74-24.04 50.84-42.15 51.84z" />
      </svg>
    ),
    color: "bg-black",
    name: "Threads",
    link: ""
  },
  {
    icon: (
      <svg className="w-20 " viewBox="0 0 48 48" fill="none">
        <path fill="#FF3D00" d="M43.2,33.9c-0.4,2.1-2.1,3.7-4.2,4c-3.3,0.5-8.8,1.1-15,1.1c-6.1,0-11.6-0.6-15-1.1c-2.1-0.3-3.8-1.9-4.2-4C4.4,31.6,4,28.2,4,24c0-4.2,0.4-7.6,0.8-9.9c0.4-2.1,2.1-3.7,4.2-4C12.3,9.6,17.8,9,24,9c6.2,0,11.6,0.6,15,1.1c2.1,0.3,3.8,1.9,4.2,4c0.4,2.3,0.9,5.7,0.9,9.9C44,28.2,43.6,31.6,43.2,33.9z"></path><path fill="#FFF" d="M20 31L20 17 32 24z"></path>
      </svg>
    ),
    color: "white",
    name: "YouTube",
    link: ""
  }
]

export default function ProfilePage() {
  const { chainId } = useAppKitNetwork();
  const [url, setUrl] = useState("");
  const [url1, setUrl1] = useState("");
  const { address } = useAccount()
  const handleCopy = (item) => {
    copy(item);
    toast.success("Address copied to clipboard!");
  };

  const getReffAdd = useReadContract({
    ...contractConfig,
    functionName: "getReferrer",
    args: [address],
    chainId: Number(chainId) ?? 56,
  });

  const getAchievedRanks = useReadContract({
    ...contractConfig,
    functionName: "getAchievedRanks",
    args: [address],
    chainId: Number(chainId) ?? 56,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(`${window.location.host}/?ref=${sortAddress(address || "")}`);
      setUrl1(`${window.location.host}/?ref=${address}`);
    }
  }, [address]);

  return (
    <div className="w-full flex flex-col h-full items-start justify-start gap-4 md:gap-6 relative z-10">
      <div className="w-full flex items-center justify-between mb-2 px-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">EpochEra Profile</h1>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6 items-center bg-gradient-to-br from-zinc-800/50 to-zinc-950/50 border border-zinc-800 rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6">
        {/* Profile Info Card - Left */}
        <div className="w-full md:flex-1 flex flex-col gap-3 md:gap-4">
          {/* Address Section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-base sm:text-lg font-medium text-gray-300">
              Your Address
            </h3>
            <div className="flex items-center w-full rounded-full p-2 px-2 md:p-2.5 md:px-4 backdrop-blur-md bg-gradient-to-br from-blue-300/40 to-blue-800/40">
              <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 flex items-center justify-center">
                <Image
                  src="/profile.jpg"
                  alt="Profile"
                  width={24}
                  height={24}
                  className="w-6 h-6 sm:w-6 sm:h-6 rounded-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 ml-3 flex items-center justify-between overflow-hidden">
                <span className="text-sm sm:text-base hidden md:block font-mono text-white truncate">
                  {address ? address : 'Not connected'}
                </span>
                <span className="block md:hidden text-sm sm:text-base font-mono text-white truncate">
                  {address ? `${address.substring(0, 10)}...${address.substring(address.length - 6)}` : 'Not connected'}
                </span>
                <button
                  onClick={() => handleCopy(address)}
                  className="ml-2 p-1.5 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Copy address"
                >
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 hover:text-white" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-base sm:text-lg font-medium text-gray-300">
              Your Rank
            </h3>
            <div className="w-full rounded-full p-3 px-4 backdrop-blur-md bg-gradient-to-br from-blue-300/40 to-blue-800/40">
              {getAchievedRanks?.data?.[0]?.length > 0 ? (
                <div className="text-white font-medium">
                  {getAchievedRanks.data[0][getAchievedRanks.data[0].length - 1]}
                </div>
              ) : (
                <span className="text-gray-200">Not ranked yet</span>
              )}
            </div>
          </div>


          <div className="flex flex-col gap-2">
            <h3 className="text-base sm:text-lg font-medium text-gray-300">
              Rank Reward
            </h3>
            <div className="w-full rounded-full p-3 px-4 backdrop-blur-md bg-gradient-to-br from-blue-300/40 to-blue-800/40">
              {(getAchievedRanks?.data?.[1].length > 0) ? (
                <div className="text-white font-medium">
                  {String(getAchievedRanks.data[1][getAchievedRanks.data[1].length - 1])}
                </div>
              ) : (
                <span className="text-sm sm:text-base text-gray-200">N/A</span>
              )}
            </div>
          </div>

          {/* Referred By Section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-base sm:text-lg font-medium text-gray-300">
              Referred By
            </h3>
            <div className="w-full rounded-full p-3 px-4 backdrop-blur-md bg-gradient-to-br from-blue-300/40 to-blue-800/40">
              {getReffAdd?.data === zeroAddress ? (
                <span className="text-sm sm:text-lg text-gray-200">Not referred by anyone</span>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-lg font-mono text-white truncate pr-2">
                    {getReffAdd?.data ? sortAddress(getReffAdd.data) : "--"}
                  </span>
                  {getReffAdd?.data && (
                    <button
                      onClick={() => handleCopy(getReffAdd.data)}
                      className="p-1 rounded-full hover:bg-white/10 transition-colors"
                      aria-label="Copy referrer address"
                    >
                      <Copy className="w-4 h-4 text-gray-300 hover:text-white" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Referral ID Section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-base sm:text-lg font-medium text-gray-300">
              Your Referral ID
            </h3>
            <ReferralCard type="referId" />
          </div>
        </div>

        {/* Coin Icon - Right - Hidden on mobile, visible on md screens and up */}
        <div className="hidden md:flex flex-1 justify-center items-center w-20 h-20">
          <Image
            src="/logo.png"
            alt="epochera coin"
            width={300}
            height={300}
            className="w-full h-auto max-w-[200px] md:max-w-[300px]"
          />
        </div>
      </div>

      {/* Social Media Section */}


      <div className="w-full flex flex-col gap-6  bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-3 sm:p-4 md:p-6">
        {/* Title inside gradient */}
        <h2 className="text-base sm:text-lg font-semibold text-white mb-1 flex items-center gap-2 sm:gap-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-500/20">
            <Link className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-600">
            <h3 className={`text-xl font-semibold leading-none tracking-tight `}>
              Social Community
            </h3>
          </div>
        </h2>

        {/* Icons in a row */}
        <div className="flex flex-wrap grid-cols-4 md:grid-cols-7 items-center gap-8 md:gap-10">
          {socialLinks.map((social) => (
            <a href={social.link} key={social.name} target="_blank" rel="noopener noreferrer">
              <div
                // whileHover={{ scale: 1.1, y: -2 }}
                // whileTap={{ scale: 0.9 }}
                className={`w-8 ${social.color} rounded-full flex items-center justify-center cursor-pointer  hover:shadow-xl transition-all duration-300`}
                title={social.name}
              >
                {social.icon}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="w-full bg-gradient-to-br from-blue-300/40 to-blue-800/40 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 mb-6 sm:mb-8">
        <p className="text-xs sm:text-sm md:text-base text-white text-center">
          Copyright © 2025 <span className="font-semibold">epochera.io</span> All rights reserved.
        </p>
      </div>

    </div>
  )
}