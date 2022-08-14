import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { isValidPosition } from '../shared/drop7';
import { getPosition } from '../shared/grid';
import useDeviceDetect from '../shared/hooks/use-device-detect';
import { useKeyPress } from '../shared/hooks/use-key-press';
import { useStore } from '../shared/store';
import { Drop7Disc } from './drop7-disc';

export const Drop7Game = () => {
  const { isMobile } = useDeviceDetect();
  const { state, send } = useStore();
  const { context } = state;

  console.log('isMobile', isMobile);

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
    <div className="max-w-sm mx-auto">
      {/* @ts-ignore */}
      {/* <p>{state.value?.game ? state.value.game : state.value}</p> */}
      <header className="mb-4">
        <h1>Drop7</h1>
      </header>

      <div className="flex mb-4">
        <div className="flex-1 text-right">
          <p className="text-5xl">{context.score}</p>
        </div>
      </div>
      {/* <p>Current chain: {context.currentChain}</p> */}

      <div
        className="relative grid grid-cols-7 border-b border-cyan-800"
        style={{ gridTemplateRows: 'repeat(8, minmax(0, 1fr)' }}
      >
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

        {/* Grid Lines */}
        {/* TODO: Move this to component */}
        {context.grid.map((row, rowIndex) => {
          return row.map((_, columnIndex) => {
            return (
              <div
                className={[
                  'border-cyan-900 aspect-square',
                  rowIndex !== 0 ? 'border-t border-l' : '',
                  columnIndex === row.length - 1 && rowIndex !== 0
                    ? 'border-r'
                    : '',
                  nextDiscColumn === columnIndex && rowIndex !== 0
                    ? 'bg-gray-900'
                    : '',
                ].join(' ')}
                style={{
                  gridRow: rowIndex + 1,
                  gridColumn: columnIndex + 1,
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
            {Object.entries(context.discMap).map(([id, disc]) => {
              const position = getPosition(context.grid, id);

              if (isValidPosition(position)) {
                const [column, row] = position;
                const discState = [
                  'game.clearing-matched-discs',
                  'game.waiting-for-user',
                ].some(state.matches)
                  ? 'waiting' // spring
                  : 'dropping'; // tween bounce

                return (
                  <Drop7Disc
                    id={id}
                    value={disc}
                    column={column}
                    row={row}
                    state={discState}
                    key={id}
                  />
                );
              }
            })}
          </AnimatePresence>
        )}
      </div>

      {state.matches('game.end-game') && (
        <button onClick={() => send('EXIT')}>Home</button>
      )}

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
                      ? 'bg-slate-600'
                      : 'border border-slate-600',
                  ].join(' ')}
                  key={i}
                ></div>
              );
            })}
          </div>
          <p>Level {context.level}</p>
        </div>
      )}
    </div>
  );
};
