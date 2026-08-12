"use client";
import Buynab from "@/components/ui/Buynab";
import Profilecalculator from "@/components/ui/Profitcalculator";
import Graphview from "@/components/ui/Graph";
import ReferralProgram from "@/components/ui/ReferProgram";
import BuyNabTable from "@/components/ui/BuyNabTable";
import StagePriceChart from "@/components/ui/StagePriceChart";
import OverviewSection from "@/components/dashboard/OverviewSection";

// --- Main Dashboard Component ---
export default function Dashboard() {

    return (
        <div className="space-y-4 sm:space-y-6 md:space-y-8 bg-background min-h-screen ">
            {/* Overview Section */}
            <OverviewSection  />

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-6">
                {/* Left Column */}
                <div className="xl:col-span-3 space-y-4 sm:space-y-6">
                    {/* Price Chart Card */}
                    <Graphview/>

                    <StagePriceChart /> 

                    {/* Transaction History Card */}
                   <BuyNabTable/>

                    {/* Referral Link Card */}
                    <ReferralProgram  />
                </div>

                {/* Right Column */}
                <div className="xl:col-span-2 space-y-4 sm:space-y-6">
                    {/* Buy EpochEra Card */}
                    <Buynab/>

                    {/* Profit Calculator Card */}
                    <Profilecalculator/>

                    {/* Leaderboard Card */}
                    {/* <div className="bg-zinc-900 rounded-md border border-zinc-800 p-4 sm:p-6">
                        <h2 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-500/20">
                                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                            </div>
                            <span className="truncate">Leaderboard</span>
                        </h2>
                        <div className="space-y-3 sm:space-y-4">
                            {leaderboardData.map(user => (
                                <div key={user.rank} className="bg-zinc-800 rounded-lg p-3 sm:p-4 flex flex-col gap-2">
                                    <div className="flex items-center justify-between text-xs sm:text-sm">
                                        <span className="text-zinc-400 font-semibold">#{user.rank}</span>
                                        <span className="text-zinc-400 text-xs">Total Transactions</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs sm:text-sm">
                                        <span className="font-mono text-zinc-300 truncate pr-2">{user.address}</span>
                                        <span className="font-semibold text-white flex-shrink-0">{user.amount}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>                */}
                </div>
            </div>
        </div>
    );
}