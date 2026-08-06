"use client";
import Graphview from "@/components/ui/Graph";
import {
  Mail,
  User,
  Phone,
  Twitter,
  MessageCircle,
  DollarSign,
  Coins,
  TrendingUp,
  Users,
  Gift,
  Wallet,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Network,
  Star,
} from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { formatEther, erc20Abi } from "viem";
import { useAccount, useBlockNumber, useReadContract, useReadContracts } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { useAppKitNetwork } from "@reown/appkit/react";
import { contractConfig, TokenContractAddress } from "@/constants/contract";
import { convertToAbbreviated } from "@/utlis";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import toast from 'react-hot-toast';
import copy from "clipboard-copy";
import Card from "@/components/ui/Card";
import CardBox from "@/components/ui/CardBox";

export default function EarningPage() {
  const [activeTab, setActiveTab] = useState('direct');
  const { address } = useAccount();
  const { chainId } = useAppKitNetwork();

  const result = useReadContracts({
    contracts: [
      {
        ...contractConfig,
        functionName: "getReferralsCount",
        args: [address],
        chainId: Number(chainId)
      },
      {
        abi: erc20Abi,
        address: TokenContractAddress,
        functionName: "balanceOf",
        args: [address],
        account: address,
      },
    ],
  });

  const dataRef = Number(result?.data?.[0]?.result) > 0 ? BigInt(Number(result.data[0].result)) : BigInt(0);

  const directReferralsTable = useReadContract({
    ...contractConfig,
    functionName: "getDirectReferralsPurchaseInfo",
    args: [address, BigInt(0), dataRef],
    chainId: Number(chainId),
  });

  const getCompleteUserData = useReadContract({
    ...contractConfig,
    functionName: "getCompleteUserData",
    args: [address],
    chainId: Number(chainId) ?? 56,
  });


  const referralData = {
    totalBusiness: result?.data?.[1]?.result ?
      convertToAbbreviated(Number(formatEther(BigInt(result?.data?.[1]?.result)))) : "0",
    selfBusiness: getCompleteUserData?.data?.[4] ?
      convertToAbbreviated(Number(formatEther(BigInt(getCompleteUserData.data[4])))) : "0",
    teamBusiness: getCompleteUserData?.data?.[6] ?
      convertToAbbreviated(Number(formatEther(BigInt(getCompleteUserData.data[6])))) : "0",
    referralRewards: getCompleteUserData?.data?.[2] ?
      convertToAbbreviated(Number(formatEther(BigInt(getCompleteUserData.data[2])))) : "0",
    purchaseCount: getCompleteUserData.data?.[10] ? getCompleteUserData.data?.[10] : "0",
  };

  const referralDataCard = [
    {
      icon: <Users className="w-3 h-3 sm:w-4 sm:h-4" />,
      title: 'Total Balance',
      value: `${referralData?.totalBusiness} EpochEra`,
      color: 'text-white'
    },
    {
      icon: <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />,
      title: 'Self Business',
      value: `$ ${referralData?.selfBusiness} `,
      color: 'text-white'
    },
    {
      icon: <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />,
      title: 'Team Business',
      value: `$ ${referralData?.teamBusiness}`,
      color: 'text-white'
    },
    {
      icon: <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />,
      title: 'Referral Rewards',
      value: ` ${referralData?.referralRewards} EpochEra`,
      color: 'text-white'
    },
    {
      icon: <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />,
      title: 'Purchase Count',
      value: referralData?.purchaseCount,
      color: 'text-white'
    },
  ];

  const { data: levelWiseReferralCount } = useReadContract({
    ...contractConfig,
    functionName: "getLevelWiseCounts",
    args: [address],
    chainId: Number(chainId),
  });

  // Prepare team level data for display
  const teamLevels = Array(10).fill(0).map((_, index) => ({
    level: index + 1,
    count: levelWiseReferralCount?.[index]?.toString() || '0'
  }));

  return (
    // Main container with consistent styling
    <div className="space-y-4 sm:space-y-6 md:space-y-8 bg-zinc-950">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">EpochEra Earnings</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">Track your earnings performance.</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="space-y-4 sm:space-y-6">

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {referralDataCard.map((card, index) => (
            <CardBox
              key={index}
              icon={card.icon}
              title={card.title}
              value={card.value}
            />
          ))}
        </div>

        {/* Referral Data Table */}
        <div className="grid grid-cols-1">
        <div className="w-full mx-auto">
          <Card className="bg-gradient-to-br from-zinc-800 to-zinc-950 border-zinc-800 shadow-2xl overflow-hidden">
            <div className="border-b border-zinc-700/50 p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-500/20">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                  </div>
                  <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-600">
                    <h3 className="text-xl font-semibold leading-none tracking-tight">
                      {activeTab === 'direct' ? 'Direct Referrals' : 'My Team'}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={activeTab === 'direct' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('direct')}
                    className={cn(
                      activeTab === 'direct'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    )}
                  >
                    Direct Referrals
                  </Button>
                  <Button
                    variant={activeTab === 'rewards' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('rewards')}
                    className={cn(
                      activeTab === 'rewards'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    )}
                  >
                    My Team
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader className="bg-zinc-950">
                  <TableRow className="border-b border-gray-700/50 hover:bg-transparent">
                    {activeTab === 'direct' ? (
                      <>
                        <TableHead className="text-gray-300 font-medium py-4 px-6 text-left">Address</TableHead>
                        <TableHead className="text-gray-300 font-medium py-4 px-6 text-left">First Purchase</TableHead>
                        <TableHead className="text-gray-300 font-medium py-4 px-6 text-left">Last Purchase</TableHead>
                        <TableHead className="text-gray-300 font-medium py-4 px-6 text-center">Purchase Count</TableHead>
                      </>
                    ) : (
                      <>
                        <TableHead className="text-gray-300 font-semibold py-4 px-6 text-left">Level</TableHead>
                        <TableHead className="text-gray-300 font-semibold py-4 px-6 text-left">Team Count</TableHead>

                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-700/30">
                  {directReferralsTable?.isLoading ? (
                    // Loading skeleton for both tabs
                    activeTab === 'direct' ? (
                      [...Array(3)].map((_, index) => (
                        <TableRow key={`skeleton-${index}`} className="hover:bg-gray-800/30 transition-colors">
                          {[...Array(4)].map((_, i) => (
                            <TableCell key={i} className="py-4 px-6">
                              <Skeleton className="h-4 w-3/4" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      [...Array(2)].map((_, index) => (
                        <TableRow key={`skeleton-team-${index}`} className="hover:bg-gray-800/30 transition-colors">
                          {[...Array(2)].map((_, i) => (
                            <TableCell key={i} className="py-4 px-6">
                              <Skeleton className="h-4 w-3/4" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )
                  ) : activeTab === 'direct' ? (
                    directReferralsTable?.data && directReferralsTable.data[0]?.length > 0 ? (
                      directReferralsTable.data[0].map((address, index) => (
                        <TableRow key={index} className="hover:bg-gray-800/30 transition-colors">
                          <TableCell className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <span className="text-zinc-300">
                                {`${address.substring(0, 6)}...${address.substring(38)}`}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-6 h-6 p-1 text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded-full"
                                onClick={() => {
                                  copy(address);
                                  toast.success('Address copied to clipboard!');
                                }}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 px-6 text-left text-zinc-300">
                            {directReferralsTable.data[1][index] ? new Date(Number(directReferralsTable.data[1][index]) * 1000).toLocaleDateString() : '--'}
                            <span className="text-sm text-gray-500 px-1">
                              {directReferralsTable.data[1][index] ? new Date(Number(directReferralsTable.data[1][index]) * 1000).toLocaleTimeString() : '--'}
                            </span>
                          </TableCell>
                          <TableCell className="py-4 px-6 text-left text-zinc-300 gap-1 ">
                            {directReferralsTable.data[2][index] ? new Date(Number(directReferralsTable.data[2][index]) * 1000).toLocaleDateString() : '--'}
                            <span className="text-sm text-gray-500 px-1">
                              {directReferralsTable.data[2][index] ? new Date(Number(directReferralsTable.data[2][index]) * 1000).toLocaleTimeString() : '--'}
                            </span>
                          </TableCell>
                          <TableCell className="py-4 px-6 text-center text-zinc-300">
                            {directReferralsTable.data[3][index]?.toString() || '0'}
                          </TableCell>

                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="py-6 text-center text-zinc-400">
                          <div className="flex  flex-col items-center gap-2">
                            <Network />
                            No direct referrals found
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  ) : activeTab === 'rewards' && teamLevels?.length > 0 ? (
                    teamLevels.map((level, index) => (
                      <TableRow key={`level-${index}`} className="hover:bg-gray-800/30 transition-colors">
                        <TableCell className="py-4 px-6">
                          <div className="flex justify-left">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center ${level.level === 10 ? 'bg-blue-500 ' :
                                level.level === 9 ? 'bg-blue-500/80 ' :
                                  level.level === 8 ? 'bg-blue-500/60 ' :
                                    level.level === 7 ? 'bg-blue-500/50 ' :
                                      level.level === 6 ? 'bg-blue-500/60 ' :
                                        level.level === 5 ? 'bg-blue-500/50 ' :
                                          level.level === 4 ? 'bg-blue-500/40 ' :
                                            level.level === 3 ? 'bg-blue-500/30 ' :
                                              level.level === 2 ? 'bg-blue-500/20 ' :
                                                'bg-blue-500/10 ' // level 1
                              }`}>
                              <Star className="w-3.5 h-3.5 mr-1.5 fill-blue-300/30" />
                              Level {level.level}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-6 text-left text-zinc-300">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-zinc-400 mr-2" />
                            <span>
                              {level.count} {level.count === '1' ? 'Member' : 'Members'}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="py-6 text-center text-zinc-400">
                        No team data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
        </div>
      </main>
    </div>
  );
}