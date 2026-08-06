import React, { useEffect } from 'react';
import { Check, X } from 'lucide-react';

const Toast = ({ message, type = 'success', isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] transform transition-all duration-300 ease-out">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border backdrop-blur-sm ${
        type === 'success' 
          ? 'bg-green-800/90 border-green-600 text-green-100' 
          : 'bg-red-800/90 border-red-600 text-red-100'
      }`}>
        {type === 'success' ? (
          <Check className="w-4 h-4 text-green-300" />
        ) : (
          <X className="w-4 h-4 text-red-300" />
        )}
        <span className="text-sm font-semibold">{message}</span>
      </div>
    </div>
  );
};

export default Toast;