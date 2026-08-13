import React from 'react';
import Card from '@/components/ui/Card';

const StatCard = ({ icon, label, value, className = '', trend = null }) => {
  return (
    <Card variant="secondary" className={`p-6 flex items-center gap-4 group relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#B48811]/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative w-14 h-14 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10 group-hover:scale-110 group-hover:shadow-[#B48811]/20 transition-all duration-300 text-white">
        {icon}
      </div>
      
      <div className="relative flex-1">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-3xl font-bold text-white tracking-tight group-hover:text-[#EBD197] transition-colors duration-300">{value}</div>
            <div className="text-slate-400 text-sm mt-1 group-hover:text-slate-300 transition-colors duration-300">{label}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
