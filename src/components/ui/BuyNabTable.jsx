"use client"
import React from 'react';
import {
    useAccount,
    useReadContract,
    useReadContracts,
} from "wagmi";
import {
    formatEther,
    formatUnits,
} from "viem";
import { Copy, ExternalLink, Layers } from 'lucide-react';
import { iocConfig } from "@/constants/contract";
import { useAppKitNetwork } from "@reown/appkit/react";
import { Skeleton } from './skeleton';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { cn } from '@/lib/utils';
import { Button } from './Button';
import Card from './Card';
import toast from 'react-hot-toast';
import copy from "clipboard-copy";

const sortAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function BuyNabTable() {
    const { chainId } = useAppKitNetwork();
    const { address } = useAccount();
    const result = useReadContracts({
        contracts: [
            {
                ...iocConfig,
                functionName: "totalContributorLengthForUser",
                args: [address, 0],
                chainId: Number(chainId) ?? 56,
            },
        ],
    });

    const totalLength = result?.data?.[0]?.result?.toString() || "0";

    const historyTable = useReadContract({
        ...iocConfig,
        functionName: "user2SaleType2ContributorList",
        args: [address, 0, BigInt(0), BigInt(totalLength)],
        chainId: Number(chainId) ?? 56,
    });

    const handleCopy = (item) => {
        copy(item);
        toast.success("Address copied to clipboard!");
    };

    return (
        <div className="w-full  mx-auto">
            <Card className="bg-gradient-to-br from-zinc-800 to-zinc-950 border-zinc-800 shadow-2xl overflow-hidden">
                <div className="border-b border-zinc-700/50 p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#BB9B49] to-[#B48811]/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-yellow-500/20">
                                <Layers className="w-3 h-3 sm:w-4 sm:h-4 text-[#EBD197]" />
                            </div>
                            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49]">
                                <h3 className={`text-xl font-semibold leading-none tracking-tight `}>
                                    Transaction History
                                </h3>
                            </div>
                        </div>
                        <div className=" items-center space-x-2  hidden md:flex">
                            <span className="text-sm text-gray-400">
                                {historyTable?.data?.length || 0} Transactions
                            </span>
                        </div>
                    </div>
                </div>
                <div className="">
                    <div className="overflow-x-auto">
                        <Table className="min-w-full">
                            <TableHeader className="bg-zinc-950">
                                <TableRow className="border-b border-gray-700/50 hover:bg-transparent">
                                    <TableHead className="text-gray-300 font-medium py-4 px-6 text-left">User</TableHead>
                                    <TableHead className="text-gray-300 font-medium py-4 px-6 text-left">Amount</TableHead>
                                    <TableHead className="text-gray-300 font-medium py-4 px-6 text-left">Coin</TableHead>
                                    <TableHead className="text-gray-300 font-medium py-4 px-6 text-left">Quantity</TableHead>
                                    <TableHead className="text-gray-300 font-medium py-4 px-6 text-left">Date & Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-700/30">
                                {historyTable.isLoading ? (
                                    [...Array(5)].map((_, index) => (
                                        <TableRow key={index} className="hover:bg-gray-800/30 transition-colors">
                                            {[...Array(5)].map((_, i) => (
                                                <TableCell key={i} className="py-4 px-6">
                                                    <Skeleton className="h-4 w-3/4" />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : historyTable?.data?.length > 0 ? (
                                    [...historyTable.data].reverse().map((item, index) => (
                                        <TableRow
                                            key={index}
                                            className={cn(
                                                'group hover:bg-gray-800/40 transition-colors',
                                                index % 2 === 0 ? 'bg-gray-900/20' : 'bg-gray-900/10'
                                            )}
                                        >
                                            <TableCell className="py-4 px-6">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-mono text-sm text-gray-200">
                                                        {sortAddress(item?.user)}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="w-6 h-6 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full p-1"
                                                        onClick={() => handleCopy(item?.user)}
                                                    >
                                                        <Copy className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <a
                                                        href={`https://testnet.bscscan.com/address/${item?.user}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-gray-400 hover:text-yellow-400 transition-colors"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </a>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 px-6 text-left font-medium text-gray-100">
                                                ${item?.amount
                                                    ? Number(formatEther(BigInt(item?.amount))).toLocaleString('en-US', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })
                                                    : "--"}
                                            </TableCell>
                                            <TableCell className="py-4 px-6  text-left">
                                                <div className="flex items-center  text-left">
                                                    <span className="inline-flex items-left text-left px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400/20 text-yellow-400">
                                                        {item?.coin === "Native" ? "BNB" : item?.coin || "--"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4 px-6 text-left font-medium text-gray-100">
                                                {item?.volume
                                                    ? Number(formatUnits(item.volume, 18)).toLocaleString('en-US', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })
                                                    : "--"}
                                                <span className="ml-1 text-gray-400 text-sm">EpochEra</span>
                                            </TableCell>
                                            <TableCell className="py-4 px-6 text-right text-sm text-gray-400">
                                                {item?.at ? (
                                                    <div className="flex flex-row items-center gap-2">
                                                        <span>{new Date(Number(item.at) * 1000).toLocaleDateString()}</span>
                                                        <span className="text-sm text-gray-500">
                                                            {new Date(Number(item.at) * 1000).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                ) : "--"}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="py-12 text-center text-gray-400"
                                        >
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <svg
                                                    className="w-12 h-12 text-gray-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                                <p className="text-lg font-medium">No transactions found</p>
                                                <p className="text-sm text-gray-500">Your transaction history will appear here</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </Card>
        </div>
    )
}
