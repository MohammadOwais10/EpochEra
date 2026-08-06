"use client";
import React, { useState, useEffect } from "react";
import { Copy, Check, Wallet, Share2, Gift, Users, DollarSign } from "lucide-react";
import Button from "@/components/ui/Button";
import ReferralProgram from "@/components/ui/ReferProgram";
import { formatEther } from "viem";
import { useAccount, useBlockNumber, useReadContracts } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { useAppKitNetwork } from "@reown/appkit/react";
import { contractConfig } from "@/constants/contract";
import { convertToAbbreviated } from "@/utlis";

export default function ReferralPage() {
   const { address } = useAccount();
  const { chainId } = useAppKitNetwork()
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const queryClient = useQueryClient();

  const result = useReadContracts({
    contracts: [
      {
        ...contractConfig,
        functionName: "getReferralRewards",
        args: [address],
        chainId: Number(chainId) ?? 56
      },
      {
        ...contractConfig,
        functionName: 'getReferralsCount',
        args: [address],
        chainId: Number(chainId) ?? 56

      },
    ],
  })

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: result.queryKey,
    });

  }, [blockNumber, queryClient, result]);

  const referralDataCard = [
    {
      icon: <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />,
      title: 'No. of Referrals',
      value: result?.data?.[1]?.result
            ? Number(result?.data[1]?.result)
            : 0,
      color: 'text-white'
    },

    {
      icon: <Gift className="w-3 h-3 sm:w-4 sm:h-4" />,
      title: 'Referral Earnings',
      value: `${
        result?.data?.[0]?.result
          ? convertToAbbreviated(Number(formatEther(BigInt(result?.data[0]?.result))))
          : 0
      } EpochEra`,
      color: 'text-white'
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 bg-zinc-950">
      {/* Top Section */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
     

        {/* Your Referral Earnings */}
        <div className="bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-3 sm:p-4 md:p-6">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-500/20">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
              </div>
              <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-600">
          <h3 className={`text-xl font-semibold leading-none tracking-tight `}>
            Referral Earnings
          </h3>
        </div>
            </h2>
            <div className="grid grid-cols-1   gap-2">
            {referralDataCard.map((card, index) => (
            <div key={index} className="flex items-center  col-span-2 gap-3 bg-zinc-900 rounded-2xl p-3 sm:p-4 border border-zinc-700">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-sm rounded-full flex-shrink-0 flex items-center justify-center border border-blue-500/20">
                {React.cloneElement(card.icon, { className: 'w-4 h-4 sm:w-5 sm:h-5 text-blue-400' })}
              </div>
              <div className="flex flex-col">
                <span className="text-base font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-600">
                  {card.title}
                </span>
                <span className="text-lg sm:text-xl font-bold text-white">
                  {card.value}
                </span>
              </div>
            </div>
          ))}
          </div>
           
          </div>
         
        </div>
           {/* Referral Program */}
           <ReferralProgram  />
      </div>
    </div>
  );
}
