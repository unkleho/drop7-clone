import React from 'react';

export const MenuIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={['inline-flex w-4 flex-col gap-1', className || ''].join(' ')}
    >
      <div className="h-[1px] bg-gradient-to-bl from-cyan-500 via-indigo-700 to-purple-700/10"></div>
      <div className="h-[1px] bg-gradient-to-bl from-cyan-600 via-indigo-800 to-purple-900/20"></div>
      <div className="h-[1px] bg-gradient-to-bl from-cyan-700 via-indigo-900 to-purple-900/40"></div>
    </div>
  );
};
