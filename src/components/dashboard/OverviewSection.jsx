'use client';
import React, { useState, useEffect, useMemo } from "react";
import { useReadContract, useChainId, useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { DollarSign, Wallet, Award, Calendar, BarChart2, Coins, Users, Globe, TrendingUp, Percent, Clock, UserCheck, TrendingDown, PieChart, Target } from 'lucide-react';
import CardBox from '@/components/ui/CardBox';
import { convertToAbbreviated } from "@/utlis";

import {
    contractConfig,
    ICOContractAddress,
    iocConfig,
    tokenConfig
} from "@/constants/contract";

export default function OverviewSection() {
    const { address } = useAccount();
    const chainId = useChainId();

    // Fetch sale details including end date and total amount
    const { data: saleDetails } = useReadContract({
        ...iocConfig,
        functionName: 'saleType2IcoDetail',
        args: [0], // Sale type 0
        chainId: Number(chainId) ?? 56,
    });

    // Fetch current token price
    const { data: salePrice } = useReadContract({
        ...iocConfig,
        functionName: 'getSaleTokenPrice',
        args: [0], // saleType 0 for the first sale type
        chainId: Number(chainId) ?? 56,
    });

    // Fetch total supply from token contract
    const { data: totalSupply } = useReadContract({
        ...tokenConfig,
        functionName: 'totalSupply',
        chainId: Number(chainId) ?? 56,
    });

    // Extract sale end date and total amount from sale details
    const saleEndDate = saleDetails?.endTime || saleDetails?.[1] || saleDetails?.endAt;

    // Calculate sales progress percentage with all dependent calculations in useMemo
    const salesProgress = useMemo(() => {
        const totalTokenSale = saleDetails?.saleTokenAmount ? Number(formatEther(BigInt(saleDetails.saleTokenAmount))) : 0;
        const totalTokenQty = saleDetails?.saleQuantity ? Number(formatEther(BigInt(saleDetails.saleQuantity))) : 0;
        const totalSoldToken = totalTokenSale - totalTokenQty;
        const tokeninUSD = salePrice ? Number(formatEther(BigInt(salePrice))) : 0;
        const totalSaleTokenUSD = ((totalSoldToken * tokeninUSD) + 5300);
        const totalTokenSupplyUSD = totalTokenSale * tokeninUSD;

        if (!totalSaleTokenUSD || !totalTokenSupplyUSD) return 0;
        return totalTokenSupplyUSD > 0 ? Math.min(100, ((totalSaleTokenUSD) / totalTokenSupplyUSD) * 100) : 0;
    }, [saleDetails, salePrice]);

    // Format stage end time
    const formatEndTime = (timestamp) => {
        if (!timestamp) return 'Loading...';
        const endDate = new Date(Number(timestamp) * 1000);
        return endDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white"> Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Token Metrics */}
                <CardBox
                    icon={<Coins />}
                    title="Total Supply"
                    value="20B"
                />

                <CardBox
                    icon={<DollarSign />}
                    title="Token Price"
                    value={salePrice ? `$ ${formatEther(salePrice)}` : 'Loading...'}
                />

                {/* Sale Status */}
                <CardBox
                    icon={<Award />}
                    title="Current Phase"
                    value="Seed Sale"
                />

                {/* Token Information */}
                <CardBox
                    icon={<Calendar />}
                    title="Sale End Date"
                    value={saleEndDate ? formatEndTime(saleEndDate) : '--'}
                />

                <CardBox
                    icon={<TrendingUp />}
                    title="Token Symbol"
                    value="EpochEra"
                />

                <CardBox
                    icon={<DollarSign />}
                    title="Listing Price"
                    value="$ 0.1"
                />

                <CardBox
                    icon={<BarChart2 />}
                    title="Sale Progress"
                    value={salesProgress ? `${salesProgress.toFixed(2)}%` : '--'}
                />

                {/* Time Remaining */}
                <CardBox
                    icon={<Target />}
                    title="Time Remaining"
                    value={saleEndDate ?
                        `${Math.ceil((Number(saleEndDate) - Math.floor(Date.now() / 1000)) / 86400)} days` :
                        'N/A'}
                />
            </div>
        </div>
    );
}
