"use client";
import Graphview from "@/components/ui/Graph";
import ProfitCalculator from "@/components/ui/Profitcalculator";
import StagePriceChart from "@/components/ui/StagePriceChart";

export default function CalculatorPage() {

  return (
    <div className="grid rounded-md grid-cols-1 gap-6 items-stretch">
      <Graphview />
      <ProfitCalculator />
      <StagePriceChart />
    </div>
  );
}