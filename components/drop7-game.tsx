import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { buildGameGrid, isValidPosition } from '../shared/drop7';
import { getGridDiff, getPosition } from '../shared/grid';
import useDeviceDetect from '../shared/hooks/use-device-detect';
import { useKeyPress } from '../shared/hooks/use-key-press';
import { usePrevious } from '../shared/hooks/use-previous';
import { initialMovesPerLevel } from '../shared/machine';
import { useStore } from '../shared/store';
import { ActionButton } from './action-button';
import { DiscState, Drop7Disc } from './drop7-disc';
import { Icon } from './icon';

export const Drop7Game = () => {
  const { isMobile } = useDeviceDetect();
  const { state, send } = useStore();
  const { context } = state;

  const prevGrid = usePrevious(context.grid);
  // console.log('state', state.value?.game, getGridDiff(prevGrid, context.grid));
  console.log('diff', context.diffDiscIds);

  // console.log('isMobile', isMobile);

  // Find disc in first row. This row is always for the next disc.
  const nextDiscColumn = context.grid[0]?.findIndex((value) => value);

  const movesInLevel = initialMovesPerLevel - context.level + 1;

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

  let discState: DiscState;
  if (
    ['game.clearing-matched-discs', 'game.waiting-for-user'].some(state.matches)
  ) {
    discState = 'waiting'; // spring
  } else if (['game.setting-up'].some(state.matches)) {
    // TODO: setting-up state is too short
    discState = 'entering';
  } else {
    discState = 'dropping'; // tween bounce
  }

  return (
    <div className="flex h-full flex-col p-5 sm:p-8">
      <header className="mb-4 flex w-full justify-between">
        <div className="flex flex-1">
          <h1 className="mr-8 flex items-start text-xl font-medium uppercase leading-none tracking-wide opacity-80">
            Drop
            <span
              className="bg-gradient-to-b from-blue-500 to-blue-800 bg-clip-text leading-none text-transparent"
              style={{
                transform: 'scale(1.4) translateY(-1.5px)',
                transformOrigin: 'top left',
              }}
            >
              7
            </span>
            <div className="ml-4 h-4 w-1 bg-gradient-to-bl from-cyan-500/80 via-indigo-700/75 to-purple-700/40 pl-[1px] sm:-mt-8 sm:h-12">
              <div className="h-full w-full bg-slate-950"></div>
            </div>
            <p className="leading-noneup mt-[1px] pl-2 text-sm font-light leading-none tracking-wider opacity-80">
              Clone
            </p>
          </h1>
        </div>

        <div className="ml-auto mt-[1px] flex">
          {state.matches('game') && (
            <button
              className="-mt-4 -mr-4 pt-4 pr-4 text-sm font-light uppercase leading-none tracking-wider opacity-50"
              onClick={() => send('EXIT')}
            >
              <span className="bg-gradient-to-bl from-cyan-500 to-blue-800 bg-clip-text font-light leading-none text-transparent">
                {'< '}
              </span>
              Exit
            </button>
          )}

          {/* <Icon name="menu" /> */}
        </div>
      </header>

      <div className="mx-auto w-full max-w-md">
        <div className="mb-3 flex justify-between">
          <motion.div
            className="flex-1 text-right"
            variants={{
              hidden: {
                opacity: 0,
              },
              visible: {
                opacity: 1,
              },
            }}
            animate={state.matches('game') ? 'visible' : 'hidden'}
          >
            <p className="text-5xl font-light opacity-70">{context.score}</p>
          </motion.div>
        </div>

        <div
          className="relative grid grid-cols-7 gap-[1px] bg-gradient-to-bl from-cyan-500/80 via-indigo-700/75 to-purple-800/60 p-[1px]"
          style={{ gridTemplateRows: 'repeat(8, minmax(0, 1fr)' }}
        >
          {/* Grid Lines */}
          {/* TODO: Move this to component */}
          {context.grid.map((row, rowIndex) => {
            return row.map((id, columnIndex) => {
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
                <div className="absolute top-0 grid h-full w-full grid-cols-7">
                  {context.grid[0].map((_, column) => {
                    return (
                      <button
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
              {buildGameGrid(context.grid, context.discMap).map((rows) => {
                return rows.map((gameDisc) => {
                  if (gameDisc) {
                    let index = context.diffDiscIds.updatedIds.findIndex(
                      (id) => id === gameDisc.id
                    );

                    return (
                      <Drop7Disc
                        id={gameDisc.id}
                        value={gameDisc.value}
                        column={gameDisc.position[0]}
                        row={gameDisc.position[1]}
                        state={discState}
                        index={index}
                        key={gameDisc.id}
                      />
                    );
                  }

                  return null;
                });
              })}

              {/* Discs */}
              {/* {Object.entries(context.discMap).map(([id, disc], index) => {
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
                    // TODO: setting-up state is too short
                    discState = 'entering';
                  } else {
                    discState = 'dropping'; // tween bounce
                  }

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
              })} */}
            </AnimatePresence>
          )}

          {state.matches('home') && (
            <ActionButton onClick={() => send('NEW_GAME')}>
              New Game
            </ActionButton>
          )}

          {state.matches('game.end-game') && (
            <ActionButton onClick={() => send('EXIT')}>Home</ActionButton>
          )}

          {state.matches('game.clearing-matched-discs') &&
            context.currentChain > 0 && (
              <div className="relative col-span-7 col-start-1 row-start-1 flex items-center text-sm">
                <p className="uppercase opacity-80">
                  Chain x {context.currentChain + 1}
                </p>
              </div>
            )}
        </div>

        {state.matches('game') && (
          <div className="mt-4">
            <div
              className="mb-2 grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${initialMovesPerLevel}, 1fr)`,
              }}
            >
              {[...new Array(movesInLevel)].map((_, i) => {
                return (
                  <div
                    className={[
                      'aspect-square w-full rounded-full',
                      context.moves > i
                        ? 'bg-gradient-to-bl from-slate-600 to-slate-800'
                        : 'border border-slate-600',
                    ].join(' ')}
                    key={i}
                  ></div>
                );
              })}
            </div>
            <p className="text-sm uppercase tracking-wider opacity-50">
              Level {context.level}
            </p>
          </div>
        )}
      </div>

      <footer className="relative mt-auto flex items-end sm:p-2">
        <div className="absolute left-0 bottom-0 h-4 w-8 bg-gradient-to-bl from-cyan-500/80 via-indigo-700/75 to-purple-800/60 pl-[1px] pb-[1px]">
          <div className="h-full w-full bg-slate-950"></div>
        </div>
        <div className="absolute right-0 bottom-0 hidden h-12 w-4 bg-gradient-to-bl from-cyan-800/80 via-indigo-700/75 to-purple-800/60 pr-[1px] pb-[1px]">
          <div className="h-full w-full bg-slate-950"></div>
        </div>
        <p className="relative ml-auto text-sm uppercase">
          <a
            href="https://twitter.com/unkleho"
            className="bg-gradient-to-bl from-cyan-500 to-purple-800 bg-clip-text leading-none tracking-wider text-transparent"
          >
            @unkleho
          </a>
        </p>
      </footer>
    </div>
  );
};
