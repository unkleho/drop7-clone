import React from 'react';

type Props = {
  children: React.ReactNode;
  onClick: () => void;
};

export const ActionButton: React.FC<Props> = ({ children, onClick }) => {
  return (
    <button
      className="absolute bg-gradient-to-bl from-cyan-500/80 via-indigo-700/75 to-purple-800/60 p-[1px] shadow-md"
      style={{
        left: '50%',
        top: '56%',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 40px 5px #000',
      }}
      onClick={onClick}
    >
      <span className="block bg-slate-950 p-5">
        <span className="whitespace-nowrap text-3xl opacity-70 md:text-4xl">
          {children}
        </span>
      </span>
    </button>
  );
};
