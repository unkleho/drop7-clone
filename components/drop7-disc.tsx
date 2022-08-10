import { motion } from 'framer-motion';
import React from 'react';
import { Disc } from '../shared/drop7';

type Props = {
  id?: string;
  value: Disc;
  row: number;
  column: number;
  state?: 'dropping' | 'waiting';
};

const colourMap: {
  [k in Disc]: {
    bg: string;
  };
} = {
  1: { bg: 'bg-green-800' },
  2: { bg: 'bg-yellow-800' },
  3: { bg: 'bg-orange-800' },
  4: { bg: 'bg-red-800' },
  5: { bg: 'bg-purple-800' },
  6: { bg: 'bg-cyan-800' },
  7: { bg: 'bg-blue-800' },
  cracked: { bg: 'bg-gray-700' },
  blank: { bg: 'bg-gray-700' },
};

export const Drop7Disc: React.FC<Props> = ({
  id,
  value,
  row,
  column,
  state = 'waiting',
}) => {
  let transition;
  if (state === 'waiting') {
    transition = {
      type: 'spring',
    };
  } else if (state === 'dropping') {
    transition = {
      type: 'tween',
      duration: 0.6,
      ease: easeOutBounce,
    };
  }

  return (
    <motion.div
      layout
      layoutId={id}
      className={[
        'flex items-center justify-center m-1 aspect-square text-center rounded-full text-xl pointer-events-none',
        colourMap[value].bg,
      ].join(' ')}
      transition={transition}
      style={{
        gridRow: row + 1,
        gridColumn: column + 1,
      }}
      exit={{
        opacity: 0,
      }}
    >
      {value === 'cracked' ? 'CR' : null}
      {typeof value === 'number' ? value : null}
    </motion.div>
  );
};

function easeOutBounce(x: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}
