import React from 'react';

const Card = ({ children, className = '', variant = 'primary' }) => {
  const baseStyle = "rounded-2xl border backdrop-blur-xl transition-all duration-300";
  const variants = {
    primary: "bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 hover:border-slate-600/50",
    secondary: "bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 hover:border-slate-600/50",
    highlight: "bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/30 hover:border-emerald-500/50",
    golden: "bg-gradient-to-br from-[#B48811]/10 to-[#BB9B49]/10 border-[#B48811]/30 hover:border-[#B48811]/50",
  };

  return (
    <div className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
