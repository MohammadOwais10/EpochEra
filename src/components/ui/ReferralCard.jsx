"use client"
import React, { useEffect, useState } from 'react'

import ShareModal from './ShareModal';
import { Copy } from 'lucide-react';
import { useAccount, useBlockNumber, useReadContracts } from 'wagmi';
import toast from 'react-hot-toast';
import { sortAddress } from '@/utlis';

export default function ReferralCard({ type }) {
  const { address } = useAccount();

  const [url, setUrl] = useState("");
  const [url1, setUrl1] = useState("");

  const copyToClipboard = () => {
    if (type === "referId") {
      navigator.clipboard.writeText(address).then(() => {
        toast.success("Copied")
      });
    }
    else {
      navigator.clipboard.writeText(url1).then(() => {
        toast.success("Copied")
      });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(`${window.location.host}/?ref=${sortAddress(address || "")}`);
      setUrl1(`${window.location.host}/?ref=${address}`);

    }
  }, [address]);

  return (
    <div className="rounded-full  p-1 px-2 md:p-2 md:px-4 backdrop-blur-md bg-gradient-to-br from-yellow-300/40 to-yellow-800/40">

      <div className="grid grid-cols-1">
        <div className="">
          {address ?
            <div
              className="flex justify-between items-center gap-1 md:gap-4"
            >
             {type === "referId" 
             ? <p className="flex items-center  text-[11px] md:text-lg   text-white font-mono">{sortAddress(address)} &nbsp; <Copy onClick={copyToClipboard} color="#ffd700" style={{ cursor: "pointer" }} /></p>
             : <p className="flex items-center  text-[11px] md:text-lg   text-white font-mono">{url} &nbsp; <Copy onClick={copyToClipboard} color="#ffd700" style={{ cursor: "pointer" }} /></p>
            }
              <ShareModal referLink={url1} />
            </div>
            : <p className="flex items-center  text-[11px] md:text-lg  p-1 text-white font-mono">--</p>
          }
        </div>
      </div>
    </div>
  )
}
