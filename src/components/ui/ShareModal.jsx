"use client";
import { useState, useEffect } from "react";
import { createPortal } from 'react-dom';
import { X, Share2, Copy, Check, Link2 } from "lucide-react";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from "react-share";

export default function ShareModal({ referLink }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ModalContent = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="fixed inset-0 z-[9998]" 
        onClick={() => setIsOpen(false)}
      ></div>
      <div 
        className="relative bg-gradient-to-b from-zinc-800 via-zinc-950 to-yellow-500/40 border-zinc-800 shadow-2xl  border  rounded-2xl w-full max-w-md  z-[10000] mx-auto my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 text-zinc-400 hover:text-white transition-colors cursor-pointer  bg-zinc-950/80 rounded-full p-1.5"
        >
          <X size={24} />
        </button>
        
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49] mb-2">
            Earn EpochEra Coin by referring your friends and community!
          </h2>
          <p className="text-zinc-300 text-sm">
            Share your unique link below and instantly receive a reward for all transactions made through your link!
          </p>
        </div>
        
        <div className="relative px-6 pb-6">
          <div className="flex items-center bg-zinc-800/50 border border-zinc-900 rounded-2xl p-3">
            <Link2 className="text-yellow-400 mr-2" size={18} />
            <input
              type="text"
              readOnly
              value={referLink}
              className="flex-1 bg-transparent text-white text-sm outline-none pr-2 truncate"
            />
            <button
              onClick={handleCopy}
              className={`p-1.5 rounded-md ${
                copied 
                  ? 'text-green-400 bg-green-900/20' 
                  : 'text-zinc-400 hover:bg-zinc-700/50 hover:text-yellow-400'
              } transition-colors`}
              title={copied ? "Copied!" : "Copy link"}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <span className={`text-xs text-yellow-400 mt-1 block h-4 ${
            copied ? 'opacity-100' : 'opacity-0'
          }`}>
            {copied ? 'Link copied to clipboard!' : ''}
          </span>
        </div>
        
        <div className="px-6 pb-6 pt-2">
          <p className="text-center text-sm text-zinc-400 mb-4">Share via</p>
          <div className="flex justify-center gap-4">
            <TwitterShareButton 
              url={referLink}
              title="Join me on EpochEra Coin!"
              className="transition-transform hover:scale-110"
            >
              <XIcon size={40} round className="shadow-lg" />
            </TwitterShareButton>
            <WhatsappShareButton 
              url={referLink}
              title="Join me on EpochEra Coin!"
              className="transition-transform hover:scale-110"
            >
              <WhatsappIcon size={40} round className="shadow-lg" />
            </WhatsappShareButton>
            <FacebookShareButton 
              url={referLink}
              quote="Join me on EpochEra Coin!"
              className="transition-transform hover:scale-110"
            >
              <FacebookIcon size={40} round className="shadow-lg" />
            </FacebookShareButton>
            <TelegramShareButton 
              url={referLink}
              title="Join me on EpochEra Coin!"
              className="transition-transform hover:scale-110"
            >
              <TelegramIcon size={40} round className="shadow-lg" />
            </TelegramShareButton>
            <LinkedinShareButton 
              url={referLink}
              title="Join me on EpochEra Coin!"
              className="transition-transform hover:scale-110"
            >
              <LinkedinIcon size={40} round className="shadow-lg" />
            </LinkedinShareButton>
          </div>
        </div>
        
      
      </div>
    </div>
  );

  if (!mounted) return null;
  
  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-zinc-800/50 rounded-full transition-colors"
      >
        <Share2 size={24} className="text-blue-400" />
      </button>
      {isOpen && createPortal(
        <ModalContent />,
        document.body
      )}
    </>
  );
}