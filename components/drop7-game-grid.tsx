import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { buildGameGrid, DiscMap, GameGrid } from '../shared/drop7';
import { DiscState, Drop7Disc } from './drop7-disc';
import { usePrevious } from '../shared/hooks/use-previous';
import { getGridDiff, getPosition, Grid } from '../shared/grid';
import useDeviceDetect from '../shared/hooks/use-device-detect';

type Props = {
  grid: Grid;
  discMap: DiscMap;
  discState?: DiscState;
  children?: React.ReactNode;
  send: (params: {
    type: 'SELECT_COLUMN' | 'HOVER_COLUMN';
    column: number;
  }) => void;
};

export const Drop7GameGrid: React.FC<Props> = ({
  grid,
  discMap,
  discState = 'waiting',
  children,
  send,
}) => {
  const { isMobile } = useDeviceDetect();

  const nextDiscColumn = grid[0]?.findIndex((value) => value);
  const prevGrid = usePrevious(grid);
  const prevDiscMap = usePrevious(discMap);
  const { addedIds, updatedIds, removedIds } = getGridDiff(prevGrid, grid);
  // console.log('----------------');
  // console.log('removedIds', removedIds);
  // console.log(
  //   'grid ids',
  //   grid
  //     .filter((row) => row)
  //     .map((row) =>
  //       row
  //         .map((id) => id)
  //         .filter((id) => id)
  //         .join(',')
  //     )
  // );

  const gameGrid = buildGameGrid(grid, discMap);

  return (
    <motion.div
      className="relative grid grid-cols-7 gap-[1px] bg-gradient-to-bl from-cyan-500/80 via-indigo-700/75 to-purple-800/60 p-[1px]"
      style={{ gridTemplateRows: 'repeat(8, minmax(0, 1fr)' }}
    >
      {/* Grid Lines */}
      {gameGrid.map((row, rowIndex) => {
        return row.map((id, columnIndex) => {
          return (
            <div
              className={[
                'aspect-square bg-slate-950',
                rowIndex === 0 ? '-m-[1px]' : '',
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

      {discState === 'waiting' && (
        <div className="absolute top-0 grid h-full w-full grid-cols-7">
          {grid[0].map((_, column) => {
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
      <AnimatePresence>
        {gameGrid.map((rows) => {
          return rows.map((gameDisc, i) => {
            if (
              gameDisc &&
              gameDisc.position[0] !== null &&
              gameDisc.position[1] !== null
            ) {
              const index = updatedIds.findIndex((id) => id === gameDisc.id);

              // if (removedIds.includes(gameDisc.id)) {
              //   console.log('removed', gameDisc.id);

              //   return null;
              // }

              // console.log('loop', gameDisc.id, index);

              // if (
              //   ['game.clearing-matched-discs', 'game.waiting-for-user'].some(
              //     state.matches
              //   )
              // ) {
              //   discState = 'waiting'; // spring
              // } else if (['game.setting-up'].some(state.matches)) {
              //   // TODO: setting-up state is too short
              //   discState = 'entering';
              // } else {
              //   discState = 'dropping'; // tween bounce
              // }

              return (
                <Drop7Disc
                  id={gameDisc.id}
                  value={gameDisc.value}
                  column={gameDisc.position[0]}
                  row={gameDisc.position[1]}
                  state={discState}
                  index={index >= 0 ? index : undefined}
                  // index={i}
                  key={gameDisc.id}
                />
              );
            }

            return null;
          });
        })}

        {/* {removedIds.map((id, index) => {
          const value = prevDiscMap[id];
          const [column, row] = getPosition(prevGrid, id);

          return (
            <Drop7Disc
              id={id}
              value={value}
              column={column}
              row={row}
              index={index}
              key={id}
              state="exiting"
            />
          );
        })} */}
      </AnimatePresence>

      {children}
    </motion.div>
  );
};
