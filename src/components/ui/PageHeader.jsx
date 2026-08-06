import React from 'react';

const PageHeader = ({ icon, title, description }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
        {React.cloneElement(icon, { className: "w-8 h-8 text-[#EBD197]" })}
        {title}
      </h1>
      <p className="text-zinc-400 mt-1">{description}</p>
    </div>
  );
};

export default PageHeader;
