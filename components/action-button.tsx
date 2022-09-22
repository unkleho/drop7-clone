import React from "react";

type Props = {
  children: React.ReactNode;
  onClick: () => void;
};

export const ActionButton: React.FC<Props> = ({ children, onClick }) => {
  return (
    <button
      className="absolute bg-black bg-gradient-to-bl from-cyan-500/80 via-indigo-700/75 to-purple-800/60 p-[1px] shadow-md"
      style={{
        left: "50%",
        top: "56%",
        transform: "translate(-50%, -50%)",
      }}
      onClick={onClick}
    >
      <span className="block bg-slate-950 p-4 text-3xl">{children}</span>
    </button>
  );
};
