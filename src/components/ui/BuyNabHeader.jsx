"use client";
import React, { useState, useEffect, useMemo } from "react";
import { formatEther, erc20Abi } from "viem";
import { useAccount, useBlockNumber, useReadContract, useReadContracts } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";     
import { useAppKitNetwork } from "@reown/appkit/react";
import {
  contractConfig,
  TokenContractAddress,
  iocConfig,
} from "@/constants/contract";
import { DollarSign ,TrendingUp} from "lucide-react";
import { convertToAbbreviated } from "@/utlis";
import CardBox from "@/components/ui/CardBox";


export default function BuyNabHeader() {
  const { address } = useAccount();
  const { chainId } = useAppKitNetwork();
    const result = useReadContracts({
        contracts: [
            {
                ...iocConfig,
                functionName: "getSaleTokenPrice",
                args: [0],
                chainId: Number(chainId) ?? 56,
            },
            {
                ...contractConfig,
                functionName: "getSelfBusinessUsd",
                args: [address],
                chainId: Number(chainId) ?? 56,
            },

        ],
    });

    const saleData = useMemo(() => {
      return {
        curretNabPrice: result?.data?.[0]?.result ? (Number(formatEther(BigInt(result?.data?.[0]?.result)))) : "0",
        iinestedAmount: result?.data?.[1]?.result ? convertToAbbreviated(Number(formatEther(BigInt(result?.data?.[1]?.result)))) : "0",
      };
    }, [result?.data]);


     const salesDataCard = [
        {
          icon: <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />,
          title: 'Current EpochEra Price',
          value: `$ ${saleData?.curretNabPrice}`,
          color: 'text-white'
        },
        {
          icon: <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />,
          title: 'Current Running Sale',
          value: `Seed Sale`,
          color: 'text-white'
        },
        {
          icon: <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />,
          title: 'Invested Amount',
          value: `$ ${saleData?.iinestedAmount}`,
          color: 'text-white'
        },
       
      ];
    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {salesDataCard.map((card, index) => (
                    <CardBox
                      key={index}
                      icon={card.icon}
                      title={card.title}
                      value={card.value}
                    />
                  ))}
            </div>
        </div>
    )
}
