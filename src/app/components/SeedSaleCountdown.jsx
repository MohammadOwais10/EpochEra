"use client"
import { useEffect, useState, useMemo } from "react";
import { useReadContract, useChainId } from "wagmi";
import { formatEther } from "viem";
import { iocConfig } from "@/constants/contract";

export function SeedSaleCountdown() {
  const [time, setTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [saleEnded, setSaleEnded] = useState(false);
  const chainId = useChainId();

  // Fetch sale details from the contract
  const { data: saleDetails, isPending: isSaleDetailsLoading } = useReadContract({
    ...iocConfig,
    functionName: 'saleType2IcoDetail',
    args: [0],
    chainId: Number(chainId) ?? 56,
  });

  // Get the token price
  const { data: tokenPrice, isPending: isPriceLoading } = useReadContract({
    ...iocConfig,
    functionName: 'getSaleTokenPrice',
    args: [0],
    chainId: Number(chainId) ?? 56,
  });

  const formattedPrice = useMemo(() => {
    if (!tokenPrice) return '--'; // Default fallback
    return (Number(formatEther(tokenPrice))).toFixed(4);
  }, [tokenPrice]);

  useEffect(() => {
    if (isSaleDetailsLoading) return;
    
    // console.log('Sale Details:', saleDetails); // Debug log
    
    if (!saleDetails) {
      // console.log('No sale details available');
      setIsLoading(false);
      setSaleEnded(true);
      return;
    }
    
    // Try to get endTime from different possible structures
    let endTime;
    
    // Check if saleDetails is an array with at least 2 elements
    if (Array.isArray(saleDetails) && saleDetails.length > 1) {
      endTime = Number(saleDetails[1]?.toString() || '0') * 1000;
    } 
    // Check if saleDetails is an object with endTime or endAt property
    else if (saleDetails.endTime || saleDetails.endAt) {
      endTime = Number((saleDetails.endTime || saleDetails.endAt).toString()) * 1000;
    }
    
    console.log('Calculated endTime:', endTime, 'Current timestamp:', Date.now()); // Debug log
    
    // If we don't have a valid end time, show a default message
    if (!endTime || isNaN(endTime)) {
      console.log('Invalid end time, showing ended state');
      setIsLoading(false);
      setSaleEnded(true);
      return;
    }
    
    const updateTime = () => {
      const now = Date.now();
      const timeLeft = Math.max(0, endTime - now);
      setTime(timeLeft);
      
      if (timeLeft <= 0) {
        setSaleEnded(true);
      } else {
        setSaleEnded(false);
      }
    };
    
    updateTime(); // Initial call
    const timer = setInterval(updateTime, 1000);
    setIsLoading(false);
    
    return () => clearInterval(timer);
  }, [saleDetails, isSaleDetailsLoading]);

  const days = Math.max(0, Math.floor(time / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((time / (1000 * 60 * 60)) % 24));
  const minutes = Math.max(0, Math.floor((time / (1000 * 60)) % 60));
  const seconds = Math.max(0, Math.floor((time / 1000) % 60));

  return (
    <div className="flex flex-col items-center px-2 py-4 mb-8 w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto">
      {tokenPrice && (
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-4 text-center">
        <span className="text-sm sm:text-base md:text-xl text-white font-bold">Seed Sale Price:</span>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49] text-lg sm:text-xl md:text-2xl font-bold">${formattedPrice}</span>
      </div>
      )}
      <div className="flex gap-1 sm:gap-2 md:gap-3 mb-3 w-full justify-center">
        <div className="flex flex-col items-center  bg-gradient-to-br from-zinc-800 to-zinc-900  border border-zinc-700 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow-xl sm:border-2 flex-1 max-w-[70px] sm:max-w-[80px] md:max-w-none">
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49]  drop-shadow">{days.toString().padStart(2,"0")}</span>
          <span className="text-[10px] sm:text-xs uppercase text-yellow-200 tracking-wider mt-1">Days</span>
        </div>
        <div className="flex flex-col items-center bg-gradient-to-br from-zinc-800 to-zinc-900  border border-zinc-700 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow-xl sm:border-2 flex-1 max-w-[70px] sm:max-w-[80px] md:max-w-none">
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49]  drop-shadow">{hours.toString().padStart(2,"0")}</span>
          <span className="text-[10px] sm:text-xs uppercase text-yellow-200 tracking-wider mt-1">Hours</span>
        </div>
        <div className="flex flex-col items-center  bg-gradient-to-br from-zinc-800 to-zinc-900  border border-zinc-700 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow-xl sm:border-2 flex-1 max-w-[70px] sm:max-w-[80px] md:max-w-none">
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49]  drop-shadow">{minutes.toString().padStart(2,"0")}</span>
          <span className="text-[10px] sm:text-xs uppercase text-yellow-200 tracking-wider mt-1">Minutes</span>
        </div>
        <div className="flex flex-col items-center  bg-gradient-to-br from-zinc-800 to-zinc-900  border border-zinc-700 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow-xl sm:border-2 flex-1 max-w-[70px] sm:max-w-[80px] md:max-w-none">
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49]  drop-shadow">{seconds.toString().padStart(2,"0")}</span>
          <span className="text-[10px] sm:text-xs uppercase text-yellow-200 tracking-wider mt-1">Seconds</span>
        </div>
      </div>
      <div className="w-full flex-1 justify-center mt-2 px-2 bg-gradient-to-br from-zinc-800 to-zinc-900  border  border-zinc-700 rounded-xl shadow-xl">
        <span className="block px-3 sm:px-4 md:px-6 py-4 rounded-lg sm: font-semibold text-xs sm:text-sm md:text-base lg:text-lg tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49] transition-all duration-300 uppercase text-center ">
          Limited Time Offer - Join Seed Sale Now
        </span>
      </div>
    </div>
  );
}