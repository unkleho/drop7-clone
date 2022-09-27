import React from 'react';

type Props = {
  name: 'menu';
};

export const Icon: React.FC<Props> = ({ name }) => {
  let icon = null;

  if (name === 'menu') {
    icon = (
      <>
        <title>Menu</title>
        <path d="M64 384h384v-42.67H64zm0-106.67h384v-42.66H64zM64 128v42.67h384V128z" />
      </>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="ionicon w-5 fill-slate-300"
      viewBox="0 0 512 512"
    >
      {icon}
    </svg>
  );
};
