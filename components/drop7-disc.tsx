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
      duration: 0.7,
      // ease: (t: number) => easeOutBounce2(t, 100, 100 - t, 1000 / 60),
      ease: easeOutBounce,
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
  const n1 = 7.0625;
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

{
  /* <div className="relative overflow-auto w-8 aspect-square rounded-full">
<div
  className="absolute w-full h-full"
  style={{
    background: `radial-gradient(at 80% 20%,#FFF478,#FFB02E,#F70A8D)`,
  }}
></div>
<div
  className="absolute w-full h-full"
  style={{
    background: `radial-gradient(#FFB849, rgba(255, 184, 71, 0))`,
  }}
></div>
<div
  className="absolute w-full h-full"
  style={{
    background: `radial-gradient(at 55% 40%, rgba(245, 150, 57, 0) 60%, rgba(255, 125, 206, 1))`,
  }}
></div>
<div
  className="absolute w-full h-full"
  style={{
    background: `radial-gradient(at 54% 40%, rgba(0, 0, 0, 0) 65%, rgba(0, 0, 0, 1))`,
    opacity: 0.6,
  }}
></div>
<div
  className="absolute w-full h-full"
  style={{
    background: `radial-gradient(at 53% 45%, rgba(179, 35, 35, 0) 50%, rgba(0, 0, 0, 0.4))`,
    opacity: 1,
  }}
></div>
</div> */
}

// function easeOutBounce2(t: number, b: number, c: number, d: number) {
//   if ((t /= d) < 1 / 2.75) {
//     return c * (7.5625 * t * t) + b;
//   } else if (t < 2 / 2.75) {
//     return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
//   } else if (t < 2.5 / 2.75) {
//     return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
//   } else {
//     return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
//   }
// }

// var start = 0;
// var end = 300;
// var frameRate = 60 / 1000; // f/ms
// var duration = 1000; //ms
// var currentStep = 0;
// var newY = 0;
// var ball = document.querySelector('.ball');
// function animate() {
//   currentStep++;
//   // newY = easeOutElastic(currentStep, start, end - start, frameRate * duration);
// }
