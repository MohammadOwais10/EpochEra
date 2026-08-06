import React from 'react';

const Button = ({ children, onClick, disabled, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyle = "rounded-full font-semibold transition-all duration-150 ease-out flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#B48811]/50 active:scale-95 select-none";
  
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };
  
  const variants = {
    primary: "bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49] hover:from-[#EBD197] hover:via-[#A2790D] hover:to-[#BB9B49] hover:shadow-lg hover:-translate-y-0.5 text-white disabled:bg-zinc-700 disabled:text-slate-600 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer",
    secondary: "bg-zinc-800 hover:bg-zinc-700 hover:shadow-md text-white border border-zinc-700 hover:border-zinc-600",
    gradient: "bg-gradient-to-r from-[#EBD197] via-[#B48811] to-[#BB9B49] hover:from-[#EBD197] hover:via-[#A2790D] hover:to-[#BB9B49] hover:shadow-lg hover:-translate-y-0.5 text-white",
    outline:  "bg-gradient-to-br from-zinc-800 to-zinc-950  border-[#B48811] text-[#EBD197] hover:bg-[#B48811]/10 hover:border-[#B48811] hover:shadow-md",
    ghost: "text-[#EBD197] hover:bg-[#B48811]/10 hover:text-[#BB9B49]"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
export { Button };
