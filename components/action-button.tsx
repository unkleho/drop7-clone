import React from 'react';

type Props = {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  onClick: () => void;
};

export const ActionButton: React.FC<Props> = ({
  className,
  style,
  children,
  onClick,
}) => {
  return (
    <button
      className={[
        'bg-gradient-to-bl from-cyan-500/80 via-indigo-700/75 to-purple-800/60 p-[1px] shadow-md',
        className || '',
      ].join(' ')}
      style={style}
      onClick={onClick}
    >
      <span className="block bg-slate-950 p-7">
        <span className="whitespace-nowrap text-2xl font-light uppercase tracking-widest opacity-80">
          {children}
        </span>
      </span>
    </button>
  );
};
