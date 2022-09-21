import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { isValidPosition } from '../shared/drop7';
import { getPosition } from '../shared/grid';
import useDeviceDetect from '../shared/hooks/use-device-detect';
import { useKeyPress } from '../shared/hooks/use-key-press';
import { useStore } from '../shared/store';
import { DiscState, Drop7Disc } from './drop7-disc';

export const Drop7Game = () => {
  const { isMobile } = useDeviceDetect();
  const { state, send } = useStore();
  const { context } = state;

  // console.log('isMobile', isMobile);

  // Find disc in first row. This row is always for the next disc.
  const nextDiscColumn = context.grid[0]?.findIndex((value) => value);

  const movesInLevel = 30 - context.level;

  useKeyPress('ArrowLeft', [nextDiscColumn], undefined, () => {
    if (nextDiscColumn > 0) {
      // setNextDiscColumn(nextDiscColumn - 1);
      send({ type: 'HOVER_COLUMN', column: nextDiscColumn - 1 });
    }
  });

  useKeyPress('ArrowRight', [nextDiscColumn], undefined, () => {
    if (nextDiscColumn < 6) {
      // setNextDiscColumn(nextDiscColumn + 1);
      send({ type: 'HOVER_COLUMN', column: nextDiscColumn + 1 });
    }
  });

  useKeyPress('Enter', [nextDiscColumn], undefined, () => {
    send({ type: 'SELECT_COLUMN', column: nextDiscColumn });
  });

  return (
    <div className="flex flex-col p-4 sm:p-8 h-full">
      {/* @ts-ignore */}
      {/* <p>{state.value?.game ? state.value.game : state.value}</p> */}
      <header className="flex justify-between w-full mb-4">
        <div className="flex flex-1">
          <h1 className="flex items-start mr-8 text-xl leading-none font-semibold uppercase opacity-80">
            Drop
            <span
              className="leading-none text-transparent bg-clip-text bg-gradient-to-b from-blue-500 to-blue-800"
              style={{
                transform: 'scale(1.4) translateY(-1px)',
                transformOrigin: 'top left',
              }}
            >
              7
            </span>
          </h1>
          <p className="mt-[1px] text-sm opacity-50 leading-none">CLONE</p>
        </div>

        <div className="flex basis-96 mt-[1px] items-start justify-end md:justify-start">
          {state.matches('game') && (
            <button
              className="text-sm uppercase leading-none opacity-50"
              onClick={() => send('EXIT')}
            >
              Exit
            </button>
          )}
        </div>

        <div className="flex-1"></div>
      </header>

      <div className="max-w-sm mx-auto w-full">
        <div className="flex mb-4">
          <div className="flex-1 text-right">
            <p className="text-5xl opacity-80 font-light">{context.score}</p>
          </div>
        </div>

        <div
          className="relative grid grid-cols-7 gap-[1px] p-[1px] bg-gradient-to-bl from-cyan-500/80 via-indigo-700/75 to-purple-800/60"
          style={{ gridTemplateRows: 'repeat(8, minmax(0, 1fr)' }}
        >
          {/* Grid Lines */}
          {/* TODO: Move this to component */}
          {context.grid.map((row, rowIndex) => {
            return row.map((_, columnIndex) => {
              return (
                <div
                  className={[
                    'aspect-square bg-slate-950',
                    rowIndex === 0 ? '-m-[1px]' : '',
                    // rowIndex !== 0 ? 'border-t border-l' : '',
                    // columnIndex === row.length - 1 && rowIndex !== 0
                    //   ? 'border-r'
                    //   : '',
                    nextDiscColumn === columnIndex && rowIndex !== 0
                      ? 'opacity-80'
                      : '',
                  ].join(' ')}
                  style={{
                    gridRow: rowIndex + 1,
                    gridColumn: columnIndex + 1,
                    ...(rowIndex === 0
                      ? {
                          transform: 'translate(0, -1px)',
                        }
                      : {}),
                  }}
                  key={rowIndex + ' ' + columnIndex}
                ></div>
              );
            });
          })}

          {state.matches('game') && (
            <AnimatePresence>
              {/* Column Selector */}
              {state.matches('game.waiting-for-user') && (
                <div className="absolute top-0 grid grid-cols-7 w-full h-full">
                  {context.grid[0].map((_, column) => {
                    return (
                      <button
                        // className="aspect-square"
                        style={{
                          gridRow: 1,
                          gridColumn: column + 1,
                        }}
                        key={column}
                        onClick={() => {
                          if (isMobile) {
                            return;
                          }

                          send({ type: 'SELECT_COLUMN', column });
                        }}
                        onMouseOver={() => {
                          // console.log('>>> hover', column);
                          // setNextDiscColumn(column);
                          send({ type: 'HOVER_COLUMN', column });
                        }}
                        onTouchStart={() => {
                          send({ type: 'HOVER_COLUMN', column });

                          setTimeout(() => {
                            send({ type: 'SELECT_COLUMN', column });
                          }, 300);
                        }}
                      >
                        {/* {column} */}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Discs */}
              {Object.entries(context.discMap).map(([id, disc], index) => {
                const position = getPosition(context.grid, id);

                if (isValidPosition(position)) {
                  const [column, row] = position;

                  let discState: DiscState;

                  if (
                    [
                      'game.clearing-matched-discs',
                      'game.waiting-for-user',
                    ].some(state.matches)
                  ) {
                    discState = 'waiting'; // spring
                  } else if (['game.setting-up'].some(state.matches)) {
                    discState = 'entering';
                  } else {
                    discState = 'dropping'; // tween bounce
                  }

                  // const discState =
                  //   ? 'waiting' // spring
                  //   : 'dropping'; // tween bounce

                  return (
                    <Drop7Disc
                      id={id}
                      value={disc}
                      column={column}
                      row={row}
                      state={discState}
                      index={index}
                      key={id}
                    />
                  );
                }
              })}
            </AnimatePresence>
          )}

          {state.matches('home') && (
            <button
              className="absolute text-4xl"
              style={{
                left: '50%',
                top: '56%',
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => send('NEW_GAME')}
            >
              New Game
            </button>
          )}

          {state.matches('game.end-game') && (
            <button
              className="absolute text-4xl"
              style={{
                left: '50%',
                top: '56%',
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => send('EXIT')}
            >
              Home
            </button>
          )}

          {state.matches('game.clearing-matched-discs') &&
            context.currentChain > 0 && (
              <div className="relative flex col-span-7 col-start-1 row-start-1 items-center text-sm">
                <p className="uppercase opacity-80">
                  Chain x {context.currentChain + 1}
                </p>
              </div>
            )}
        </div>

        {state.matches('game') && (
          <div className="mt-4">
            <div
              className="grid gap-1 mb-2"
              style={{ gridTemplateColumns: 'repeat(29, 1fr)' }}
            >
              {[...new Array(movesInLevel)].map((_, i) => {
                return (
                  <div
                    className={[
                      'w-full aspect-square rounded-full',
                      context.moves > i
                        ? 'bg-gradient-to-bl from-slate-600 to-slate-800'
                        : 'border border-slate-600',
                    ].join(' ')}
                    key={i}
                  ></div>
                );
              })}
            </div>
            <p className="uppercase text-sm opacity-50">
              Level {context.level}
            </p>
          </div>
        )}
      </div>

      <footer className="flex mt-auto">
        <p className="ml-auto text-sm uppercase">
          <span className="opacity-50 ">By</span>{' '}
          <a href="https://twitter.com/unkleho" className="text-blue-500">
            @unkleho
          </a>
        </p>
      </footer>
    </div>
  );
};
