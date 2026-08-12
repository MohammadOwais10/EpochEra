import React from 'react';
import Card from '@/components/ui/Card';

const StatCard = ({ icon, label, value, className = '' }) => {
  return (
    <Card variant="secondary" className={`p-6 flex items-center gap-4 ${className}`}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
        <div className="text-slate-400 text-sm mt-1">{label}</div>
      </div>
    </Card>
  );
};

export default StatCard;
