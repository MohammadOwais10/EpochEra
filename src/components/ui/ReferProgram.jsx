import React, { useState } from "react";
import { Users, Copy, Check, Share2 } from "lucide-react";
import Button from "./Button";
import toast from 'react-hot-toast';
import copy from "clipboard-copy";
import ReferralCard from "./ReferralCard";
import Image from "next/image";

function ReferralProgram() {

  return (
    <div className="bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-3 sm:p-4 md:p-6">
      {/* Header */}
      <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#BB9B49] to-[#B48811]/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-yellow-500/20">
          <Users className="w-3 h-3 sm:w-4 sm:h-4 text-[#EBD197]" />
        </div>
        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49]">
          <h3 className={`text-xl font-semibold leading-none tracking-tight `}>
            Referral Program
          </h3>
        </div>
      </h2>

      {/* Referral Link */}
      <ReferralCard type="referId" />

      {/* Earn Instantly Section */}
      <div className=" flex flex-col items-center text-center sm:text-left sm:flex-row sm:items-center justify-between ">
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
            Earn EpochEra Instantly
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400">
          Copy your unique link or share it directly with your friends and community to start earning rewards today!
          </p>
        </div>

        {/* Static Image */}
        <div className="flex-shrink-0">
         <img
            src="/logo.png"
            alt="Dollar"
            className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
          />
        </div>
      </div>

    </div>
  );
}

export default ReferralProgram;
