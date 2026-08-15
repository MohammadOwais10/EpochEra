"use client";
import React, { useState, useCallback, useMemo } from "react";
import { ChevronDown, DollarSign, Coins, ArrowRight, ArrowUpRight, Calculator, BadgeAlert } from "lucide-react";
import Image from "next/image";

export default function ProfitCalculator() {

  const [NABAmount, setNABAmount] = useState("");
  const [selectedStage, setSelectedStage] = useState('SEED-SALE');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const stageOptions = [
    { value: 'SEED-SALE', label: 'SEED SALE' },
    { value: 'PRE-SALE', label: 'PRE SALE' },
    { value: 'PRIVATE', label: 'PRIVATE SALE' },
    { value: 'PUBLIC', label: 'PUBLIC SALE' }
  ];

  const getStagePrice = useCallback((stage) => {
    switch (stage) {
      case 'SEED-SALE': return 0.0088;
      case 'PRE-SALE': return 0.040;
      case 'PRIVATE': return 0.074;
      case 'PUBLIC': return 0.11;
      default: return 0.11;
    }
  }, []);

  const currentPrice = useMemo(() => getStagePrice(selectedStage), [selectedStage, getStagePrice]);
  const NABAmountNum = parseFloat(NABAmount) || 0;
  const totalCost = NABAmountNum * currentPrice;
  const listingPrice = 0.35;
  const potentialProfit = NABAmountNum * (listingPrice - currentPrice);

  const handleNABAmountChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setNABAmount(value);
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <div className="bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-800  rounded-2xl shadow-2xl p-4 sm:p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#BB9B49] to-[#B48811]/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-yellow-500/20">
              <Calculator className="w-4 h-4 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49]">
              Calculate Value
            </h3>
          </div>
          <div className="relative dropdown-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="w-full sm:w-36 cursor-pointer bg-zinc-950 hover:bg-zinc-950/80 text-white font-medium rounded-xl px-4 py-2.5 text-sm flex items-center justify-between gap-2 transition-all duration-200 border border-zinc-700 hover:border-yellow-400"
            >
              <span className="text-white font-semibold truncate max-w-[120px]">
                {stageOptions.find(opt => opt.value === selectedStage)?.label || 'Select Stage'}
              </span>
              <ChevronDown className={`w-4 h-4 text-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-1  py-2 w-full sm:w-36 bg-zinc-950/40 rounded-2xl shadow-2xl border border-zinc-700/80 backdrop-blur-lg z-50 overflow-hidden">
                {stageOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStage(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-1 text-sm text-left transition-all ${selectedStage === option.value
                      ? 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 text-yellow-400 border-l-2 border-yellow-500'
                      : 'text-zinc-300 hover:bg-zinc-700/50'}`}
                  >
                    <div className="flex items-start flex-col justify-between">
                      <span>{option.label}</span>
                      <span className="text-xs font-mono bg-zinc-900 px-2 py-0.5 rounded">
                        ${getStagePrice(option.value).toFixed(4)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      

        <div className="space-y-5">
          {/* Amount of EpochEra Input */}
          <div className="space-y-2">
          <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-300">
                Enter EpochEra
              </span>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-zinc-400 group-focus-within:text-yellow-400 transition-colors" />
              </div>
              <input
                type="text"
                value={NABAmount}
                onChange={handleNABAmountChange}
                inputMode="decimal"
                placeholder="0.00"
                className="block  p-2 w-full pl-4 pr-24 py-3.5 bg-zinc-950/65 backdrop-blur-sm border border-zinc-700/50 rounded-xl text-white focus:ring focus:ring-yellow-500/50 focus:border-yellow-500/30 outline-none transition-all duration-200 text-base font-medium placeholder-zinc-500"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <div className="flex items-center">
                  <Image 
                    src="/logo.png" 
                    alt="EpochEra" 
                    width={50} 
                    height={50}
                    className=" rounded-full"
                  />
                  <span className="font-medium text-white text-sm">EpochEra</span>
                </div>
              </div>
            </div>
          </div>

          {/* USD Amount Display */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-300">
                USDT Equivalent
              </span>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-zinc-400" />
              </div>
              <input
                type="text"
                value={NABAmount ? `$${totalCost.toFixed(6)}` : '0.00'}
                readOnly
                className="block w-full p-2 pl-4 pr-24 py-3.5 bg-zinc-900 backdrop-blur-sm border border-zinc-700/50 rounded-xl text-zinc-200 font-medium focus:outline-none  transition-all duration-200 text-base"
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                <div className="flex items-center gap-3">
                  <Image 
                    src="/coin/usdt.webp" 
                    alt="USDT" 
                    width={25} 
                    height={25}
                    className="rounded-full "
                  />
                  <span className="text-white font-medium text-sm">USDT</span>
                </div>
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="flex items-center justify-center text-xs text-zinc-500 mt-3">
              <span className="bg-zinc-800/50 px-2.5 py-1 rounded-full border border-zinc-700/50">
                ${currentPrice.toFixed(4)} per EpochEra
              </span>
              <ArrowRight className="mx-2 w-3.5 h-3.5 text-zinc-400" />
              <span className="text-yellow-400 font-medium bg-yellow-900/20 px-2.5 py-1 rounded-full border border-emerald-900/30">
                1 EpochEra
              </span>
            </div>

      
            
          </div>
        </div>



        <div className="w-full flex-1 text-xs text-center text-zinc-500 mt-4 ">
          <p className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/50 rounded-full border border-zinc-800/50">
          <BadgeAlert className="w-6 h-6 text-red-400"/>
            <span>Prices are estimated and may vary based on market conditions</span>
          </p>
        </div>
      </div>
    </div>
  );
}