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
      duration: 0.8,
      ease: easeOutBounce,
      // ease: bounceOut,
    };
  }

  return (
    <motion.div
      layout
      layoutId={id}
      className={[
        'flex items-center justify-center m-1 aspect-square text-center rounded-full text-xl pointer-events-none font-semibold',
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
      {/* {id} */}
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

// var b1 = 4 / 11,
//   b2 = 6 / 11,
//   b3 = 8 / 11,
//   b4 = 3 / 4,
//   b5 = 9 / 11,
//   b6 = 10 / 11,
//   b7 = 15 / 16,
//   b8 = 21 / 22,
//   b9 = 63 / 64,
//   b0 = 1 / b1 / b1;

// export function bounceIn(t) {
//   return 1 - bounceOut(1 - t);
// }

// export function bounceOut(t) {
//   return (t = +t) < b1
//     ? b0 * t * t
//     : t < b3
//     ? b0 * (t -= b2) * t + b4
//     : t < b6
//     ? b0 * (t -= b5) * t + b7
//     : b0 * (t -= b8) * t + b9;
// }

// export function bounceInOut(t) {
//   return ((t *= 2) <= 1 ? 1 - bounceOut(1 - t) : bounceOut(t - 1) + 1) / 2;
// }
