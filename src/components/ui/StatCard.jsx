import React from 'react';
import Card from '@/components/ui/Card';

const StatCard = ({ icon, label, value }) => {
  return (
    <Card className="p-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-zinc-400 text-sm">{label}</div>
      </div>
    </Card>
  );
};

export default StatCard;
