import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { buildGameGrid, DiscMap, GameGrid } from '../shared/drop7';
import { DiscState, Drop7Disc } from './drop7-disc';
import { usePrevious } from '../shared/hooks/use-previous';
import { getGridDiff, Grid } from '../shared/grid';

type Props = {
  grid: Grid;
  discMap: DiscMap;
  // gameGrid: GameGrid;
  discState?: DiscState;
};

export const Drop7GameGrid: React.FC<Props> = ({
  grid,
  discMap,
  // gameGrid,
  discState = 'waiting',
}) => {
  const nextDiscColumn = grid[0]?.findIndex((value) => value);
  const prevGrid = usePrevious(grid);
  const diffDiscIds = getGridDiff(prevGrid, grid);
  console.log(diffDiscIds);

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

      <AnimatePresence>
        {/* Discs */}
        {gameGrid.map((rows) => {
          return rows.map((gameDisc) => {
            if (
              gameDisc &&
              gameDisc.position[0] !== null &&
              gameDisc.position[1] !== null
            ) {
              const index =
                diffDiscIds.findIndex((id) => id === gameDisc.id) || 0;

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
                  index={index}
                  key={gameDisc.id}
                />
              );
            }

            return null;
          });
        })}
      </AnimatePresence>
    </motion.div>
  );
};
