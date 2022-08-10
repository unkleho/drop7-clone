import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { isValidPosition } from '../shared/drop7';
import { getPosition } from '../shared/grid';
import { useStore } from '../shared/store';
import { Drop7Disc } from './drop7-disc';

export const Drop7Game = () => {
  // const [state, send] = useMachine(drop7Machine);
  // console.log(state.value);
  const { state, send } = useStore();
  const [nextDiscColumn, setNextDiscColumn] = useState(4);

  return (
    <div className="my-4 max-w-sm mx-auto">
      {/* @ts-ignore */}
      <p>{state.value?.game ? state.value.game : state.value}</p>
      <p>{state.context.score}</p>
      <p>{state.context.moves}</p>
      <p>Next disc: {state.context.nextDisc?.value}</p>
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
            {state.context.grid.map((row, rowIndex) => {
              return row.map((_, columnIndex) => {
                return (
                  <div
                    className={[
                      'border-cyan-900 aspect-square',
                      rowIndex !== 0 ? 'border-t border-l' : '',
                      columnIndex === row.length - 1 && rowIndex !== 0
                        ? 'border-r'
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
                  {state.context.grid[0].map((_, column) => {
                    return (
                      <button
                        className="aspect-square"
                        style={{
                          gridRow: 1,
                          gridColumn: column + 1,
                        }}
                        key={column}
                        onClick={() => send({ type: 'SELECT_COLUMN', column })}
                        onMouseOver={() => {
                          setNextDiscColumn(column);
                        }}
                      >
                        {/* {column} */}
                      </button>
                    );
                  })}

                  {state.context.nextDisc && (
                    <Drop7Disc
                      value={state.context.nextDisc.value}
                      column={nextDiscColumn}
                      row={0}
                    />
                  )}
                </div>
              )}

              {/* Discs */}
              {Object.entries(state.context.discMap).map(([id, disc]) => {
                const position = getPosition(state.context.grid, id);

                if (isValidPosition(position)) {
                  const [column, row] = position;

                  return (
                    <Drop7Disc
                      id={id}
                      value={disc}
                      column={column}
                      row={row}
                      state="dropping"
                      key={id}
                    />
                  );
                }
              })}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};
