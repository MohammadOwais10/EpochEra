import { iocConfig } from '@/constants/contract';
import { useAppKitNetwork } from '@reown/appkit/react';
import React, { useMemo, useRef, useState } from 'react';
import { useReadContract, useReadContracts } from 'wagmi';
import { erc20Abi, zeroAddress } from "viem";

export default function CoinSelector({selectedToken,setSelectedToken}) { 
  const { chainId } = useAppKitNetwork();
  const numericChainId = Number(chainId) ;
  const result = useReadContracts({
    contracts: [
      {
        ...iocConfig,
        functionName: "getAcceptedTokenList",
        chainId: numericChainId,
      },
    ],
  });

  console.log("result",result.data);
  console.log("numericChainId",numericChainId);
  const tokenAddrss = useMemo(() => {
    const tokenlist = result && result.data && result.data[0]?.result;
    if (tokenlist && tokenlist?.length > 0) {
      const mergeArray = [...tokenlist, zeroAddress];
      return mergeArray;
    }
    return [];
  }, [result]);

  // Dropdown open state
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Helper for icon path
  function getIcon(symbol, address) {
    if (symbol === 'USDT') return '/coin/usdt.webp';
    if (address === zeroAddress) return '/coin/bnb.webp';
    if (symbol === 'BTCB') return '/coin/btcb.webp';
  
    return `/coin/${symbol?.toLowerCase() || 'unknown'}.png`;
  }

  // Helper for selected token display
  function SelectedDisplay() {
    if (!selectedToken) return <span className="text-gray-400">Select a coin</span>;
    return (
      <span className="flex items-center gap-2">
        <img src={getIcon(selectedToken.tokenname, selectedToken.address)} alt="icon" className="w-5 h-5 rounded-full" />
        <span className="text-white text-lg font-semibold">{selectedToken.tokenname}</span>
      </span>
    );
  }

  return (
    <div className=" relative" ref={dropdownRef}>
      <button
        type="button"
        className="w-full  rounded gap-2  text-white flex items-center justify-between"
        onClick={() => setOpen((o) => !o)}
      >
        <SelectedDisplay />
        <svg className={`w-4 h-4 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-2 w-full bg-black border rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {tokenAddrss.map((coin) => (
            <TokenOption
              key={coin}
              coin={coin}
              chainId={numericChainId}
              selectedToken={selectedToken}
              setSelectedToken={setSelectedToken}
              setOpen={setOpen}
              getIcon={getIcon}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TokenOption({ coin, chainId, selectedToken, setSelectedToken, setOpen, getIcon }) {
  const isBNB = coin === zeroAddress;
  const { data: symbol } = useReadContract({
    abi: erc20Abi,
    address: isBNB ? undefined : coin ,
    functionName: "symbol",
    chainId,
    query: { enabled: !isBNB },
  });
  const displaySymbol = isBNB ? 'BNB' : (symbol || '...');
  const iconSrc = getIcon(displaySymbol, coin);
  return (
    <button
      type="button"
      className={`flex items-center gap-2 w-full px-4 py-2 hover:bg-yellow-600 ${selectedToken?.address === coin ? 'bg-yellow-400 text-white' : 'text-white'}`}
      onClick={() => {
        setSelectedToken && setSelectedToken({ address: coin, tokenname: displaySymbol });
        setOpen(false);
      }}
    >
      <img src={iconSrc} alt={displaySymbol} className="w-5 h-5 rounded-full" />
      <span>{displaySymbol}</span>
    </button>
  );
}