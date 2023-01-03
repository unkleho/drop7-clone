import { motion, Transition, Variant, Variants } from 'framer-motion';
import React, { useRef } from 'react';
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
      delay: index * 0.03 + 0.3,
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
      ease: flashEaseOut,
    };
  }

  const variants: Variants = {
    initial: {
      opacity: 0,
      y: state === 'level-entering' ? 10 : -10,
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
        backgroundColor: colour.bg,
        willChange: 'transform',
        fontSize: 'min(6vw, 1.8rem)',
      }}
    >
      <span className="disc-value-shadow col-start-1 row-start-1 -mt-1 opacity-60">
        {typeof value === 'number' ? value : null}
      </span>
      <span className="disc-value col-start-1 row-start-1 -mt-1 text-slate-300">
        {typeof value === 'number' ? value : null}
      </span>

      {value === 'cracked' ? <DiscCracked /> : null}

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

const DiscCracked = () => {
  return (
    <svg viewBox="0 0 100 100">
      {[...new Array(10)].map((_, i) => {
        const angle = 360 / 10;
        const rotate = i * angle;
        const pad = 14;
        return (
          <path
            d={`M 100 50
          A 50 50 0 0 0 ${getCoordFromDegrees(angle - pad, 50, 100)}
          L ${getCoordFromDegrees(angle - pad, 30, 100)}
          A 30 30 0 0 1 80 50`}
            key={rotate}
            transform={`rotate(${rotate - pad / 2})`}
            style={{
              transformOrigin: 'center',
            }}
            className={'fill-gray-700'}
          />
        );
      })}
      <circle r={22} cx="50" cy="50" className="fill-gray-700" />;
    </svg>
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

type Disc3DProps = {
  children: React.ReactNode;
};

const Disc3D: React.FC<Disc3DProps> = ({ children }) => {
  return (
    <div className="relative aspect-square w-full overflow-auto rounded-full">
      <div
        className="absolute h-full w-full"
        style={{
          // TODO: try rgba(var(--base-colour), 0.1) where base-colour is 0, 0, 0
          background: `radial-gradient(at 80% 20%,#FFF478,#FFB02E,#F70A8D)`,
        }}
      ></div>
      <div
        className="absolute h-full w-full"
        style={{
          background: `radial-gradient(#FFB849, rgba(255, 184, 71, 0))`,
        }}
      ></div>
      <div
        className="absolute h-full w-full"
        style={{
          background: `radial-gradient(at 55% 40%, rgba(245, 150, 57, 0) 60%, rgba(255, 125, 206, 1))`,
        }}
      ></div>
      <div
        className="absolute h-full w-full"
        style={{
          background: `radial-gradient(at 54% 40%, rgba(0, 0, 0, 0) 65%, rgba(0, 0, 0, 1))`,
          opacity: 0.6,
        }}
      ></div>
      <div
        className="absolute h-full w-full"
        style={{
          background: `radial-gradient(at 53% 45%, rgba(179, 35, 35, 0) 50%, rgba(0, 0, 0, 0.4))`,
          opacity: 1,
        }}
      ></div>

      <div className="relative h-full w-full">{children}</div>
    </div>
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

// https://stackoverflow.com/questions/740308/how-do-i-modify-this-easing-function-to-bounce-less
function flashEaseOut(t: number, b = 0, c = 1, d = 1) {
  // if ((t /= d) < 1 / 2.75) return c * (7.5625 * t * t) + b;
  // else if (t < 2 / 2.75) return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
  // else if (t < 2.5 / 2.75)
  //   return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
  // else return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;

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

function bounceEaseOut(gradient: number) {
  return 1 - bounceEase(1 - gradient);
}

// https://github.com/BabylonJS/Babylon.js/blob/80c65876dbcdf005c12c37d255a1fe020b36b62b/packages/dev/core/src/Animations/easing.ts
function bounceEase(gradient: number, bounces = 10, bounciness = 10): number {
  const y = Math.max(0.0, bounces);
  if (bounciness <= 1.0) {
    bounciness = 1.001;
  }
  const num9 = Math.pow(bounciness, y);
  const num5 = 1.0 - bounciness;
  const num4 = (1.0 - num9) / num5 + num9 * 0.5;
  const num15 = gradient * num4;
  const num65 =
    Math.log(-num15 * (1.0 - bounciness) + 1.0) / Math.log(bounciness);
  const num3 = Math.floor(num65);
  const num13 = num3 + 1.0;
  const num8 = (1.0 - Math.pow(bounciness, num3)) / (num5 * num4);
  const num12 = (1.0 - Math.pow(bounciness, num13)) / (num5 * num4);
  const num7 = (num8 + num12) * 0.5;
  const num6 = gradient - num7;
  const num2 = num7 - num8;
  return (
    (-Math.pow(1.0 / bounciness, y - num3) / (num2 * num2)) *
    (num6 - num2) *
    (num6 + num2)
  );
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
