import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { isValidPosition } from '../shared/drop7';
import { getPosition } from '../shared/grid';
import { useKeyPress } from '../shared/hooks/use-key-press';
import { useStore } from '../shared/store';
import { Drop7Disc } from './drop7-disc';

export const Drop7Game = () => {
  const { state, send } = useStore();
  const { context } = state;

  // Find disc in first row. This row is always for the next disc.
  const nextDiscColumn = context.grid[0]?.findIndex((value) => value);

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
    <div className="my-4 max-w-sm mx-auto">
      {/* @ts-ignore */}
      {/* <p>{state.value?.game ? state.value.game : state.value}</p> */}
      <p>Score: {context.score}</p>
      <p>Moves: {context.moves}</p>
      <p>Level: {context.level}</p>

      {state.matches('home') && (
        <button onClick={() => send('NEW_GAME')}>New Game</button>
      )}

      {state.matches('game') && (
        <>
          <div
            className="relative grid grid-cols-7 border-b border-cyan-800"
            style={{ gridTemplateRows: 'repeat(8, minmax(0, 1fr)' }}
          >
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
                        onClick={() => send({ type: 'SELECT_COLUMN', column })}
                        onMouseOver={() => {
                          // console.log('>>> hover', column);
                          // setNextDiscColumn(column);
                          send({ type: 'HOVER_COLUMN', column });
                        }}
                      >
                        {/* {column} */}
                      </button>
                    );
                  })}

                  {/* Next Disc */}
                  {/* {context.nextDisc && (
                    <Drop7Disc
                      id={context.nextDisc.id}
                      value={context.nextDisc.value}
                      column={nextDiscColumn}
                      row={0}
                    />
                  )} */}
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
          </div>

          {state.matches('game.end-game') && (
            <button onClick={() => send('EXIT')}>Home</button>
          )}
        </>
      )}
    </div>
  );
};
