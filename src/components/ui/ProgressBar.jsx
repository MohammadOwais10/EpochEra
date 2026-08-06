import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  useAccount,
  useBalance,
  useBlockNumber,
  useReadContract,
  useReadContracts,
  useWriteContract,
} from "wagmi";

import {
  contractConfig,
  ICOContractAddress,
  iocConfig,
  tokenConfig,
  TokenContractAddress,
} from "@/constants/contract";
import useCheckAllowance from "@/hooks/useCheckAllowance";
import {
  Address,
  erc20Abi,
  formatEther,
  formatUnits,
  parseEther,
  parseUnits,
  zeroAddress,
} from "viem";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
} from "@reown/appkit/react";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { IcoABI } from "@/abi/IcoABI";
import { convertToAbbreviated } from "@/utlis";

import Image from "next/image";

export default function ProgressBar() {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const { chainId } = useAppKitNetwork();
  const [amount, setAmount] = useState("");
  const result = useReadContracts({
    contracts: [
      {
        ...iocConfig,
        functionName: "getSaleTokenPrice",
        args: [0],
        chainId: Number(chainId) ?? 56,
      },
      {
        ...iocConfig,
        functionName: "saleType2IcoDetail",
        args: [0],
        chainId: Number(chainId) ?? 56,
      },
      {
        ...tokenConfig,
        functionName: "totalSupply",
        chainId: Number(chainId) ?? 56,
      },
      {
        ...iocConfig,
        functionName: "user2SaleType2Contributor",
        args: [address, 0],
        chainId: Number(chainId) ?? 56,
      },
      {
        ...iocConfig,
        functionName: "saleType2IcoDetail",
        args: [0],
        chainId: Number(chainId),
      },

      {
        ...contractConfig,
        functionName: "getReferrer",
        args: [address],
        chainId: Number(chainId) ?? 56,
      },
      {
        ...iocConfig,
        functionName: "getAcceptedTokenList",
        chainId: Number(chainId),
      },
    ],
  });



const calculationresult = useReadContracts({
  contracts: [
    // {
    //   ...iocConfig,
    //   functionName: "calculateUSDAmount",
    //   args: [tokenAddress, parseEther(amount)],
    //   chainId: Number(chainId),
    // },
    {
      ...iocConfig,
      functionName: "exchangelaunchDate",
      chainId: Number(chainId),
    },

    {
      ...iocConfig,
      functionName: "totalContributor",
      args: [1],
      chainId: Number(chainId),
    },

    // {
    //   ...iocConfig,
    //   functionName: "getPaymentOption",
    //   args: [tokenAddress],
    //   chainId: Number(chainId),
    // },

    {
      ...iocConfig,
      functionName: "owner",
      chainId: Number(chainId),
    },
  ],
});

  const calciulatedToken = useMemo(() => {
    if ((result && result?.data) || amount || calculationresult) {
      const tokenPrice = result?.data && result?.data[0]?.result;
      const dividedVa = calculationresult?.data
        ? (Number(
          formatEther(BigInt(calculationresult?.data[0]?.result ?? 0))
        ) > 0
          ? Number(
            formatEther(BigInt(calculationresult?.data[0]?.result ?? 0))
          )
          : Number(amount)) / Number(formatEther(BigInt(tokenPrice ?? 0)))
        : 0;
      const purchaseToken =
        result &&
        result?.data &&
        result?.data[3]?.result &&
        formatEther(BigInt(result?.data[3]?.result?.volume));
      const tokeninUSD =
        result && result?.data
          ? Number(formatEther(BigInt(result?.data[0]?.result ?? 0)))
          : 0;
      const totalTokenSupply =
        result &&
        result?.data &&
        result?.data[4]?.result &&
        formatEther(BigInt(result?.data[4]?.result?.saleTokenAmount));
      const totalTokenQty =
        result &&
        result?.data &&
        result?.data[4]?.result &&
        formatEther(BigInt(result?.data[4]?.result?.saleQuantity));

      const totalTokenSale =
        result &&
        result?.data &&
        result?.data[4]?.result &&
        formatEther(BigInt(result?.data[4]?.result?.saleTokenAmount));

      const purchaseTokenUSD = Number(purchaseToken) * Number(tokeninUSD);
      const totalTokenSupplyUSD = Number(totalTokenSupply) * Number(tokeninUSD);
      const totalSoldToken = Number(totalTokenSale) - Number(totalTokenQty);
      const totalSaleTokenUSD = Number(totalSoldToken) * Number(tokeninUSD);
      const launchDate = calculationresult?.data?.[1]?.result;
      const totalContributors = calculationresult?.data?.[2]?.result;
      const tokenPriceData = Number(formatEther(BigInt(tokenPrice ?? 0)));


      return {
        getToken: dividedVa?.toFixed(2),
        purchaseTokenUSD: purchaseTokenUSD.toFixed(2),
        totalTokenSupplyUSD: totalTokenSupplyUSD,
        totalSale: totalSaleTokenUSD.toFixed(2),
        purchaseToken: Number(purchaseToken).toFixed(2),
        launchDate: launchDate,
        totalContributors: Number(totalContributors),
        tokenPriceData: tokenPriceData,

      };
    }
  }, [result, amount, calculationresult]);

  const progressWidth =
  ((Number(calciulatedToken?.totalSale) + 530000) /
    Number(calciulatedToken?.totalTokenSupplyUSD)) *
  100;
 
  return (
    <div className="rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 backdrop-blur-md bg-gradient-to-br from-[#EBD197]/40 to-[#A2790D]/40">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 my-2">
      <div className="flex items-center gap-2 -ml-3">
        <Image src="/logo.png" alt="epochera coin" width={50} height={50}
          className="rounded-full"
        />
        <span data-aos="fade-right" className="text-white -ml-3">
          1 EpochEra
        </span>
        <span data-aos="fade-right" className="text-white mx-1">
          =
        </span>
        <Image src="/coin/usdt.webp" alt="epochera coin" width={20} height={20}
          className="w-6 h-6 bg-[#26A17B] rounded-full"
        />
        <span data-aos="fade-right" className="text-white">
          {calciulatedToken?.tokenPriceData} USDT
        </span>
      </div>
        <div>
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white">
          ${convertToAbbreviated(Number(calciulatedToken?.totalSale) + 5300 ) || 0} / ${""}
          {convertToAbbreviated(calciulatedToken?.totalTokenSupplyUSD) || 0}
          </h3>
        </div>
       
      </div>

      {/* Progress bar */}
      <div className="w-full">
        <div
          className="w-full h-[18px] rounded-full mb-2 overflow-hidden border-2 border-zinc-500 bg-gradient-to-r from-[#EBD197]  to-[#BB9B49]"
        >
          <div
            style={{
              width: `${progressWidth}%`, // Dynamically set width
            }}
            className="h-full rounded-full transition-all duration-300 ease-in-out bg-[#B48811]"
          ></div>
        </div>

        <div className="flex justify-between w-full">
          <span className="text-xs md:text-base text-white font-semibold">Seed Sale</span>
          <span className="text-xs md:text-base text-white font-semibold">Private Sale</span>
        </div>
      </div>
    </div>
  );
}
