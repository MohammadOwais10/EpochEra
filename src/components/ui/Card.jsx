import React from 'react';

const Card = ({ children, className = '', variant = 'primary' }) => {
  const baseStyle = "rounded-2xl border";
  const variants = {
    primary: "bg-[#121212] border-zinc-800",
    secondary: "bg-zinc-800 border-zinc-700",
    highlight: "bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/30",
  };

  return (
    <div className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
