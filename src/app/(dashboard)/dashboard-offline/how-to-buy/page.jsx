"use client";
import { useState } from "react";
import Image from "next/image";

export default function HowToBuyPage() {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const contractAddress = "0x1234567890abcdef1234567890abcdef12345678";

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    });
  };

  const handleShowToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  // Steps with images
  const steps = [
    {
      image: "/howtobuy/step-1.webp",
      title: "Visit the Official Website",
      description:
        'Go to the official Nabchain website: https://www.epochera.io , Always double-check the URL to avoid scams.',
    },    
    {
      image: "/howtobuy/step-2.webp",
      title: "Connect Your Wallet",
      description:
        "Choose a preferred crypto wallet from a list of supported options using a mobile app or browser extension.",
    },
    {
      image: "/howtobuy/step-3.webp",
      title: "Choose Payment Currency",
      description:
        "Select your preferred currency and network — USDT, ETH, BTC, and more are supported.",
    },
    {
      image: "/howtobuy/step-4.webp",
      title: "Complete Your Purchase",
      description:
        "Confirm the payment in your wallet or use direct deposit. Your EpochEra tokens will appear in your dashboard balance.",
    },
  ];

  // Supported wallets list
  const wallets = [
    { name: "MetaMask", desc: "Browser extension wallet" },
    { name: "Trust Wallet", desc: "Mobile crypto wallet" },
    { name: "WalletConnect", desc: "Connect any wallet" },
    { name: "Coinbase Wallet", desc: "Secure crypto wallet" },
  ];

  return (
  

        
        <div className=" mx-auto space-y-6 sm:space-y-8 md:space-y-12">
   
          <div className="text-center sm:text-left space-y-2 sm:space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              How to Buy EpochEra Tokens
            </h1>
            <p className="text-sm sm:text-base text-zinc-400  mx-auto sm:mx-0">
              Follow our simple four-step guide to participate in the EpochEra token
              presale and secure your investment.
            </p>
          </div>

          {/* Steps Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-2xl rounded-2xl border border-zinc-700 p-4 sm:p-6 md:p-8 transition-colors w-full"
              >
                <div className="mb-4 sm:mb-5">
                    <Image
                    src={step.image}
                    alt={step.title}
                    height={200}
                    width={200}
                    className="w-full h-32 sm:h-40 md:h-60 object-fill rounded-sm bg-zinc-800/50"
                  />
                </div>
                <h3 className="text-base sm:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-600 mb-2 sm:mb-3">
                  {index + 1}. {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          
         
        </div>



  );
}
