import React from 'react';

const CardBox = ({ icon, title, value, gradientFrom = 'from-[#EBD197]', gradientTo = 'to-[#BB9B49]', iconBgFrom = 'from-[#B48811]/20', iconBgTo = 'to-[#A2790D]/20', iconColor = 'text-[#EBD197]' }) => {
  return (
    <div className="flex items-center gap-3 bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-2xl rounded-2xl  p-3 sm:px-4 sm:py-6 border border-zinc-700">
      <div className={`w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br ${iconBgFrom} ${iconBgTo} backdrop-blur-sm rounded-full flex-shrink-0 flex items-center justify-center border border-[#B48811]/20`}>
        {React.cloneElement(icon, { className: 'w-4 h-4 sm:w-5 sm:h-5 ' + iconColor })}
      </div>
      <div className="flex flex-col">
        <span className={`text-base font-medium bg-clip-text text-transparent bg-gradient-to-r ${gradientFrom} ${gradientTo}`}>
          {title}
        </span>
        <span className="text-lg sm:text-xl font-bold text-white">
          {value}
        </span>
      </div>
    </div>
  );
};

export default CardBox;
