import React, { useState } from 'react';
import { Zap, TrendingUp, Copy, Check } from 'lucide-react';
import StagePriceChart from './StagePriceChart';
import ProgressBar from './ProgressBar';
import { DollarSign } from 'lucide-react';

function Graphview() {
  const [isCopied, setIsCopied] = useState(false);



  const purchaseHistoryData = [
    { id: 'TXN58292', amount: '15,000 EpochEra', value: '$165.00', date: 'Sep 10, 2025', status: 'Completed' },
    { id: 'TXN58285', amount: '5,000 EpochEra', value: '$55.00', date: 'Sep 09, 2025', status: 'Completed' },
    { id: 'TXN58271', amount: '10,000 EpochEra', value: '$110.00', date: 'Sep 07, 2025', status: 'Pending' },
  ];

  const statusClasses = {
    Completed: 'bg-yellow-500/10 text-yellow-400',
    Pending: 'bg-yellow-500/10 text-yellow-400',
    Failed: 'bg-red-500/10 text-red-400',
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="w-full rounded-md">
      {/* Price Chart Card */}
      <div className="bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-800 shadow-2xl rounded-xl p-3 sm:p-4 md:p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#BB9B49] to-[#B48811]/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-[#BB9B49]">
            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-[#EBD197]" />
          </div>
          <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49]">
            <h3 className={`text-xl font-semibold leading-none tracking-tight `}>
              EpochEra Value
            </h3>
          </div>
        </div>
        {/* Stage Progress Bar */}
        <div className="">
          <ProgressBar stage={27} raised={920000} goal={1000000} tokenPrice={0.01} />
        </div>
        {/* <StagePriceChart /> */}
      </div>
    
    </div>
  );
}

export default Graphview;
