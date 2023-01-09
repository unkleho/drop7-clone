import { motion, Transition, Variant, Variants } from 'framer-motion';
import { url } from 'inspector';
import React, { useRef } from 'react';
import { getSliceCommands } from '../shared/donut-utils';
import { DiscValue } from '../shared/drop7';

export type DiscState =
  | 'level-entering'
  | 'entering'
  | 'dropping'
  | 'waiting'
  | 'exiting';

type Props = {
  id?: string;
  value: DiscValue;
  row: number | null;
  column: number | null;
  state?: DiscState;
  index?: number;
};

const colourMap: {
  [k in DiscValue]: {
    bg: string;
    shadow?: string;
  };
} = {
  1: { bg: 'bg-gradient-to-bl from-green-500 to-green-800' },
  2: { bg: 'bg-gradient-to-bl from-yellow-500 to-yellow-800' },
  3: { bg: 'bg-gradient-to-bl from-orange-500 to-orange-800' },
  4: { bg: 'bg-gradient-to-bl from-red-500 to-red-900' },
  5: { bg: 'bg-gradient-to-bl from-purple-500 to-purple-900' },
  6: { bg: 'bg-gradient-to-bl from-cyan-500 to-cyan-900' },
  7: { bg: 'bg-gradient-to-bl from-blue-500 to-blue-800' },
  // cracked: { bg: 'bg-gradient-to-bl from-gray-600 to-gray-900' },
  cracked: { bg: '' },
  blank: { bg: 'bg-gradient-to-bl from-slate-600 to-slate-900' },
};

export const Drop7Disc: React.FC<Props> = ({
  id,
  value,
  row,
  column,
  state = 'waiting',
  index = 0,
}) => {
  if (row === null || column === null) {
    return null;
  }

  let transition;
  if (state === 'entering') {
    transition = {
      type: 'tween',
      duration: 0.3,
      delay: index * 0.03,
    };
  } else if (state === 'level-entering') {
    transition = {
      type: 'tween',
      duration: 0.3,
      delay: index * 0.03 + 0.4,
    };
  } else if (state === 'waiting') {
    transition = {
      type: 'spring',
    };
  } else if (state === 'dropping') {
    transition = {
      type: 'tween',
      duration: 0.7,
      delay: index * 0.02,
      ease: customEaseOutBounce,
    };
  }

  const variants: Variants = {
    initial: {
      opacity: 0,
      y: state === 'level-entering' ? 20 : -10,
    },
    show: {
      opacity: 1,
      y: 0,
    },
    hidden: (index = 0) => {
      return {
        opacity: 0,
        y: 20,
        transition: {
          // duration: 0,
          // NOTE: This doesn't work when game grid is updated, need to resort
          // to `exiting` state
          // delay: index * 0.03,
          type: 'tween',
          duration: 0.3,
        },
      };
    },
    exiting: {
      opacity: 0,
      y: 20,
      transition: {
        type: 'tween',
        duration: 0.3,
        delay: index * 0.53,
      },
    },
  };

  const colour = colourMap[value];
  // console.log(state);

  return (
    <motion.div
      layout={true}
      layoutId={id}
      className={[
        'pointer-events-none m-1 grid aspect-square grid-cols-1 grid-rows-1 place-items-center overflow-hidden rounded-full text-center font-medium',
        colour.bg,
      ].join(' ')}
      custom={index}
      transition={transition}
      variants={variants}
      initial={'initial'}
      // animate={state}
      animate={state === 'exiting' ? 'exiting' : 'show'}
      exit={'hidden'}
      style={{
        gridRow: row + 1,
        gridColumn: column + 1,
        // backgroundColor: colour.bg,
        willChange: 'transform',
        fontSize: 'min(6vw, 1.8rem)',
        // clipPath: 'url(#disc-cracked)',
      }}
    >
      <span className="disc-value-shadow col-start-1 row-start-1 -mt-1 opacity-60">
        {typeof value === 'number' ? value : null}
      </span>
      <span className="disc-value col-start-1 row-start-1 -mt-1 text-slate-300">
        {typeof value === 'number' ? value : null}
      </span>

      {value === 'cracked' ? <DiscCracked id={id} /> : null}

      {/* <span className="text-xs">{id}</span> */}

      <style jsx>{`
        .disc-value-shadow {
          text-shadow: ${[...new Array(24)].map((_, i) => {
            return `-${i}px ${i}px ${i * 0.2}px rgba(0, 0 ,0, ${1 - i * 0.07})`;
          })};
        }
      `}</style>
    </motion.div>
  );
};

const DiscCracked = ({ id }: { id: string | undefined }) => {
  const colour = colourMap['blank'];
  const maskId = `disc-cracked-${id}`;

  return (
    <>
      <div
        className={['aspect-square w-full', colour.bg].join(' ')}
        style={{ clipPath: `url(#${maskId})` }}
      ></div>

      {/* Cracked disc mask */}
      <svg viewBox="0 0 100 100" className="col-start-1 row-start-1">
        <clipPath id={maskId} clipPathUnits="objectBoundingBox">
          {[...new Array(10)].map((_, i) => {
            const angle = 360 / 10;
            const rotate = i * angle;
            // const pad = 14;
            const d = getSliceCommands(
              { id: 1, percent: 6.5 },
              0.5,
              1,
              0.2,
              rotate + 5.5
            );

            return (
              <motion.path d={d} key={rotate} className={'fill-gray-700'} />
            );
          })}

          <motion.circle r={0.22} cx="0.5" cy="0.5" />
        </clipPath>
      </svg>
    </>
  );
};

// https://dev.to/mustapha/how-to-create-an-interactive-svg-donut-chart-using-angular-19eo
function getCoordFromDegrees(angle: number, radius: number, svgSize: number) {
  const x = Math.cos((angle * Math.PI) / 180);
  const y = Math.sin((angle * Math.PI) / 180);
  const coordX = x * radius + svgSize / 2;
  const coordY = y * -radius + svgSize / 2;
  return [coordX, coordY];
}

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

// https://stackoverflow.com/questions/740308/how-do-i-modify-this-easing-function-to-bounce-less
function customEaseOutBounce(t: number, b = 0, c = 1, d = 1) {
  t /= d;
  if (t < 1.4 / 2.75) {
    return 3.858419 * t * t;
  } else if (t < 2.1 / 2.75) {
    t -= 1.75 / 2.75;
    return 7.5625 * t * t + 0.8775;
  } else if (t < 2.5 / 2.75) {
    t -= 2.3 / 2.75;
    return 7.5625 * t * t + 0.96;
  }
  t -= 2.625 / 2.75;
  return 7.5625 * t * t + 0.984375;
}
