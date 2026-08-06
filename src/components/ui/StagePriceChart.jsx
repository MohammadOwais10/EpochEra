"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  CartesianGrid,
  ReferenceDot,
  Label,
  ReferenceLine,
} from "recharts"
import { DollarSign, Info } from "lucide-react";

const STAGE_CONFIG = [
  { id: 'NONE', label: 'NONE', price: 0 },
  { id: 'SEED-SALE', label: 'SEED SALE', price: 0.0088 },
  { id: 'PRE-SALE', label: 'PRE SALE', price: 0.040 },
  { id: 'PRIVATE', label: 'PRIVATE SALE', price: 0.074 },
  { id: 'PUBLIC', label: 'PUBLIC SALE', price: 0.11 },
];

// Start stages from index 1
const data = STAGE_CONFIG.map((stage, index) => ({
  stage: index,  // Now stage 0 is NONE, stage 1 is SEED-SALE, etc.
  price: stage.price,
  label: stage.label,
  id: stage.id
}));

const currentStageIndex = 1; // 1 for SEED-SALE, 2 for PRE-SALE, etc.
const currentStage = currentStageIndex;
const currentStageData = STAGE_CONFIG[currentStageIndex];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const stageData = data.find(d => d.stage === label);
    return (
      <div className="bg-zinc-800 text-white text-sm px-3 py-2 rounded-2xl border border-zinc-700 shadow-2xl backdrop-blur-sm md:min-w-36">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded-full ${
              stageData?.id === currentStageData.id ? 'bg-yellow-500' : 'bg-zinc-500'
            }`}></div>
            <span className={`font-semibold ${stageData?.id === currentStageData.id ? 'text-yellow-400' : 'text-gray-400'}`}>{stageData?.label}</span>
          </div>
          <div className={`text-lg font-bold ${stageData?.id === currentStageData?.id ? 'text-yellow-400' : 'text-gray-400'}`}>
            ${payload[0].value.toFixed(4)}
          </div>
         
        </div>
      </div>
    )
  }
  return null
}

export default function StagePriceChart() {
  const currentPoint = data.find((d) => d.stage === currentStage) || data[0];

  return (
    <div className="w-full h-64 sm:h-80 md:h-96 bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-800 shadow-2xl rounded-xl p-3 sm:p-4 md:p-6 ">
      <div className="mb-3 sm:mb-4 md:mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#BB9B49] to-[#B48811]/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-yellow-500/20">
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-[#EBD197]" />
            </div>
            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49]">
              <h3 className="text-xl font-semibold leading-none tracking-tight">
                Stage Price Progression
              </h3>
            </div>
          </div>

        </div>
        <p className="text-zinc-400 text-xs sm:text-sm hidden sm:block">
          Token price changes across different stages
        </p>
      </div>

      <ResponsiveContainer width="100%" height="75%">
        <LineChart data={data} margin={{ top: 10, right: 15, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffd700" />
              <stop offset="50%" stopColor="#ffe44d" />
              <stop offset="100%" stopColor="#ffed4d" />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#52525b" strokeOpacity={0.3} />

          {/* Highlight current stage area */}
          <ReferenceArea
            x1={currentStage - 0.5}
            x2={currentStage + 0.5}
            fill="#f9731622"
            fillOpacity={0.4}
          />
          
          {/* Vertical reference lines */}
          {STAGE_CONFIG.map((stage, index) => {
            if (index === 0) return null; // Skip NONE stage
            const x = index;
            const isCurrent = x === currentStage;
            return (
              <ReferenceLine
                key={stage.id}
                x={x}
                stroke={isCurrent ? '#f97316' : '#3f3f46'}
                strokeWidth={1}
                strokeDasharray={isCurrent ? '0' : '3 3'}
              />
            );
          })}

          <XAxis
            dataKey="stage"
            type="number"
            domain={[0.5, STAGE_CONFIG.length - 0.5]}
            tick={{ 
              fill: "#9ca3af", 
              fontSize: 10, 
              fontWeight: 500, 
              dy: 5,
              angle: 0,
              textAnchor: 'middle'
            }}
            axisLine={{ stroke: "#71717a", strokeWidth: 1 }}
            tickLine={false}
            interval={0}
            ticks={STAGE_CONFIG.map((_, i) => i).filter(i => i > 0)}
            tickFormatter={(value) => {
              const stage = STAGE_CONFIG[value];
              return stage ? stage.id : '';
            }}
          />
          <YAxis
            domain={[0, 0.024]}
            tick={{ fill: "#e4e4e7", fontSize: 10, fontWeight: 500 }}
            axisLine={{ stroke: "#71717a", strokeWidth: 1 }}
            tickLine={{ stroke: "#71717a" }}
            tickFormatter={(value) => value > 0 ? value.toFixed(4) : ''}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Line from origin to current stage (solid) */}
          <Line
            data={[
              { stage: 0, price: 0 },
              { stage: 0.001, price: 0 },  // Tiny offset to ensure line starts from 0
              ...data.filter(d => d.stage > 0 && d.stage <= currentStage)
            ]}
            type="linear"
            dataKey="price"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            connectNulls={true}
          />

          {/* Dots for all stages */}
          {data.filter(d => d.stage > 0).map((point) => (
            <ReferenceDot
              key={point.stage}
              x={point.stage}
              y={point.price}
              r={5}
              fill={point.stage === currentStage ? '#ffd700' : 'gray'}
              stroke="#fff"
              strokeWidth={point.stage === currentStage ? 2 : 1}
              isFront={true}
            />
          ))}

          {/* Future stages (dashed line) - includes current stage point */}
          <Line
            data={[
              ...data.filter(d => d.stage === currentStage),
              ...data.filter(d => d.stage > currentStage)
            ]}
            type="monotone"
            dataKey="price"
            stroke="#f97316"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            isAnimationActive={false}
          />

          {/* Current stage point */}
          {/* <Line
            data={data.filter((d) => d.stage > 0 && d.stage <= currentStage)}
            type="monotone"
            dataKey="price"
            stroke="#f97316"
            strokeWidth={2}
            dot={{
              r: 4,
              fill: "#18181b",
              stroke: "#f97316",
              strokeWidth: 2,
              filter: "drop-shadow(0 2px 4px rgba(249, 115, 22, 0.3))",
            }}
            activeDot={{
              r: 6,
              fill: "#f97316",
              stroke: "#ffffff",
              strokeWidth: 2,
              filter: "drop-shadow(0 2px 6px rgba(249, 115, 22, 0.5))",
            }}
            isAnimationActive={true}
            animationDuration={2000}
          /> */}

    {/* Highlight current point with label */}
    {/* <ReferenceDot
      x={currentPoint.stage}
      y={currentPoint.price}
      r={6}
      fill="#f97316"
      stroke="#fff"
      strokeWidth={2}
    >
      <Label
        position="top"
        value={`$${currentPoint.price.toFixed(3)}`}
        // fill="#f97316"
        fontSize={10}
        fontWeight="bold"
        offset={8}
      />
    </ReferenceDot> */}
  </LineChart>
</ResponsiveContainer>

    </div>
  )
}
