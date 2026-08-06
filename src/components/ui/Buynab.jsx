"use client";
import { Wallet, ArrowUpDown, ChevronDown } from "lucide-react";
import Button from "./Button";
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
import { useAppKitNetwork } from "@reown/appkit/react";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { IcoABI } from "@/abi/IcoABI";
import CoinSelector from "./CoinSelector";
import { useSearchParams } from "next/navigation";
import { extractDetailsFromError } from "@/utlis/extractDetailsFromError";
import Image from "next/image";
import toast from 'react-hot-toast';

export default function Buynab() {
  const { address } = useAccount();
  const queryClient = useQueryClient();
  const searchparm = useSearchParams();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [amount, setAmount] = useState("");
  const { chainId } = useAppKitNetwork();
  const [isAproveERC20, setIsApprovedERC20] = useState(true);
  // const [referrer, setReferrer] = useState(
  //   searchparm.get("ref") || zeroAddress
  // );
  const [referrer, setReferrer] = useState(searchparm.get("ref") === zeroAddress ? "" : searchparm.get("ref") || "");
  const [isValidReferrer, setIsValidReferrer] = useState(true);

  const validateEthereumAddress = (address) => {
    // Basic Ethereum address validation (0x followed by 40 hex characters, case-insensitive)
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return address === "" || ethAddressRegex.test(address);
  };

  const handleReferrerChange = (value) => {
    setReferrer(value === zeroAddress ? "" : value);
    setIsValidReferrer(validateEthereumAddress(value));
  };

  const { writeContractAsync, isPending, isSuccess, isError } =
    useWriteContract();

  const [selectedToken, setSelectedToken] = useState({
    tokenname: "BNB",
    id: "tether",
    imgurl: "/coin/usdt.webp",
    address: zeroAddress,
  });

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
        chainId: Number(chainId),
      },

      {
        ...contractConfig,
        functionName: "getReferrer",
        args: [address],
        chainId: Number(chainId) ?? 56,
      },
    ],
  });



  const tokenAddress =
    selectedToken.tokenname === "BNB" ? zeroAddress : selectedToken.address;

  const calculationresult = useReadContracts({
    contracts: [
      {
        ...iocConfig,
        functionName: "calculateUSDAmount",
        args: [tokenAddress, parseEther(amount)],
        chainId: Number(chainId),
      },
      {
        ...iocConfig,
        functionName: "getPaymentOption",
        args: [tokenAddress],
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

      return {
        getToken: dividedVa?.toFixed(2),
      };
    }
  }, [result, amount, calculationresult]);


  const minBuy = result?.data?.[1]?.result?.minBuyInUsd
    ? Number(formatEther(BigInt(result.data[1].result.minBuyInUsd)))
    : 0;

    // console.log("referrer", referrer);
  const handleBuy = async () => {
    try {
      const formattedAmount = parseUnits(amount, 18);
      const tokenAddress = selectedToken?.address;
      const res = await writeContractAsync({
        address: ICOContractAddress,
        abi: IcoABI,
        functionName: "buy",
        args: [
          0,
          tokenAddress,
          formattedAmount,
          (result?.data?.[2]?.result !== zeroAddress ? result?.data?.[2]?.result : (referrer || zeroAddress))
        ],
        value:
          selectedToken?.tokenname === "BNB" ? parseEther(amount) : BigInt(0),
      });
      if (res) {
        setAmount("");
        // setReferrer("");
        toast.success("Transaction completed");
      }
    } catch (error) {
      console.log(">>>>>>>>>>>>.error", error);
      toast.error(extractDetailsFromError(error.message));
    }
  };

  const approveToken = async () => {
    try {
      const formattedAmount =
        Number?.(amount) > 0
          ? parseEther?.(amount)
          : parseEther?.(
            BigInt((Number.MAX_SAFE_INTEGER ** 1.3)?.toString())?.toString()
          );
      const res = await writeContractAsync({
        abi: erc20Abi,
        address: selectedToken.address,
        functionName: "approve",
        args: [ICOContractAddress, formattedAmount],
        account: address,
      });
      if (res) {
        setIsApprovedERC20(true);
        toast.success("Token approved successfully");
      }
    } catch (error) {
      toast.error(extractDetailsFromError(error.message));
    }
  };

  const { data: Balance } = useBalance({
    address: address,
  });

  const resultOfCheckAllowance = useCheckAllowance({
    spenderAddress: ICOContractAddress,
    token: selectedToken.address,
  });

  useEffect(() => {
    if (resultOfCheckAllowance && address) {
      const price = parseFloat(amount === "" ? "0" : amount);
      const allowance = parseFloat(
        formatEther?.(resultOfCheckAllowance.data ?? BigInt(0))
      );
      if (allowance >= price) {
        setIsApprovedERC20(true);
      } else {
        setIsApprovedERC20(false);
      }
    }
  }, [resultOfCheckAllowance, address, amount]);

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: resultOfCheckAllowance.queryKey,
    });
    queryClient.invalidateQueries({
      queryKey: result.queryKey,
    });
  }, [blockNumber, queryClient, result, resultOfCheckAllowance]);


  const { data: resultOfTokenBalance } = useReadContract({
    abi: erc20Abi,
    address: selectedToken.address,
    functionName: "balanceOf",
    args: [address],
    account: address,
    query: {
      enabled: selectedToken.tokenname === "BNB" ? false : true,
    },
  });

  return (
    <div className="bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-xl border border-zinc-800 p-5 flex flex-col overflow-visible">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#BB9B49] to-[#B48811]/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-yellow-500/20">
          <Wallet className="w-3 h-3 sm:w-4 sm:h-4 text-[#EBD197]" />
        </div>
        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49]">
          <h3 className={`text-xl font-semibold leading-none tracking-tight `}>
            Buy EpochEra
          </h3>
        </div>
      </div>
      <div className="relative z-10">
        <label className="text-xs text-zinc-400 font-medium">You pay (MIN. $10)</label>
        <div className="relative mt-1">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="$0.00"
            className="w-full bg-zinc-950 rounded-xl p-3 pl-4 pr-28 text-white font-semibold focus:ring-2 focus:ring-yellow-500 outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <CoinSelector
              selectedToken={selectedToken}
              setSelectedToken={setSelectedToken}
            />
          </div>
        </div>

      </div>
      <div className="flex justify-center mt-6 mb-3">
        <button className="p-2 px-3 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-full border border-zinc-800">
          <ArrowUpDown className="w-5 h-5 text-yellow-400" />
        </button>
      </div>

      {/* <ArrowUpDown className="w-5 h-5 text-yellow-400" /> */}

      <div>
        <label className="text-xs text-zinc-400 font-medium">You receive</label>
        <div className="relative mt-1">
          <input
            type="text"
            value={calciulatedToken?.getToken || 0}
            readOnly
            className="w-full bg-zinc-800 rounded-xl p-3 pl-4 pr-16 text-white font-semibold focus:none outline-none"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white font-semibold  flex items-center ">
          <Image src="/logo.png" alt="EpochEra Coin Logo" width={50} height={50} />EpochEra</span>
        </div>
      </div>

      <div className="mt-4">
        <label className="text-xs text-zinc-400 font-medium">Referral ID (Optional)</label>
        <input
          type="text"
          value={referrer}
          onChange={(e) => handleReferrerChange(e.target.value)}
          placeholder="Enter referral id"
          className={`w-full bg-zinc-950 rounded-xl p-3 pl-4 mt-1 font-medium focus:ring-2 outline-none mb-1 ${!isValidReferrer ? 'border border-red-500 focus:ring-red-500' : 'text-white focus:ring-yellow-500 border-zinc-800'}`}
        />
        {!isValidReferrer && referrer !== "" && (
          <div className="text-red-500 text-xs mt-1 mb-2">
            Please enter a valid referral id or leave empty
          </div>
        )}
      </div>

      {address ? (
        <Button variant="primary" size="lg" className="mt-5 rounded-full text-white"
          disabled={
            (calculationresult?.data?.[1]?.result?.isStable &&
              Number(amount) < Number(minBuy)) ||
            (!calculationresult?.data?.[1]?.result?.isStable &&
              Number(
                formatEther(
                  BigInt(calculationresult?.data?.[0]?.result ?? 0)
                )
              ) < Number(minBuy)) ||
            isPending ||
            amount === "" ||
            Number(amount) <= 0 ||
            !isValidReferrer ||
            (selectedToken?.tokenname === "BNB"
              ? Number(Balance?.formatted) < Number(amount) ||
              Number(Balance?.formatted) === 0
              : Number(formatEther(BigInt(resultOfTokenBalance ?? 0))) <
              Number(amount))
          }
          onClick={() => {
            if (selectedToken?.tokenname === "BNB") {
              handleBuy();
            } else {
              !isAproveERC20 ? approveToken() : handleBuy();
            }
          }}>
          {
            isPending
              ? selectedToken?.tokenname === "BNB" || isAproveERC20
                ? "Buying..."
                : "Approving..."
              : selectedToken?.tokenname === "BNB" && amount === ""
                ? "Please enter amount"
                : selectedToken?.tokenname === "BNB" &&
                  Number(amount) <= 0
                  ? "Please enter correct amount"
                  : (
                    selectedToken?.tokenname === "BNB"
                      ? Number(Balance?.formatted) < Number(amount) ||
                      Number(Balance?.formatted) === 0
                      : Number(
                        formatEther(BigInt(resultOfTokenBalance ?? 0))
                      ) < Number(amount)
                  )
                    ? "Insufficient funds"
                    : selectedToken?.tokenname === "BNB" || isAproveERC20
                      ? "Buy Now"
                      : "Approve"
          }
        </Button>
      )
        :

        (<Button variant="primary" size="lg" className="mt-5 rounded-full">
          Connect Wallet
        </Button>
        )}

      {amount &&
        (calculationresult?.data?.[0]?.result ||
          calculationresult?.data?.[1]?.result) && (
          <div className="flex items-center justify-center text-lg text-red-400 ">
            {calculationresult?.data?.[1]?.result?.isStable &&
              Number(amount) < Number(minBuy) && (
                <p className="pt-2" >
                  Minimum: <span className="font-semibold">${minBuy}</span>  required
                </p>
              )}

            {
              <>
                {!calculationresult?.data?.[1]?.result?.isStable &&
                  Number(
                    formatEther(
                      BigInt(calculationresult?.data[0]?.result ?? 0)
                    )
                  ) < Number(minBuy) && (
                    <p className="p-1 font-semibold" >
                      Minimum: <span className="font-semibold">${minBuy}</span>  required
                    </p>
                  )}
              </>
            }
          </div>
        )}
    </div>
  );
}