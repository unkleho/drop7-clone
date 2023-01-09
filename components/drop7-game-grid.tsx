import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { buildGameGrid, DiscMap, GameGrid } from '../shared/drop7';
import { DiscState, Drop7Disc } from './drop7-disc';
import { usePrevious } from '../shared/hooks/use-previous';
import { getGridDiff, getPosition, Grid } from '../shared/grid';
import useDeviceDetect from '../shared/hooks/use-device-detect';
import { getSliceCommands } from '../shared/donut-utils';

type Props = {
  grid: Grid;
  discMap: DiscMap;
  discState?: DiscState;
  /* TODO: Bit messy to have separate state, but need this for new discs on new level */
  nextLevelDiscIds?: string[];
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
  nextLevelDiscIds = [],
  children,
  send,
}) => {
  const { isMobile } = useDeviceDetect();

  const nextDiscColumn = grid[0]?.findIndex((value) => value);
  const prevGrid = usePrevious(grid);
  const prevDiscMap = usePrevious(discMap);
  const { addedIds, updatedIds, removedIds } = getGridDiff(prevGrid, grid);
  const gameGrid = buildGameGrid(grid, discMap);

  const handleColumnHover = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const x =
      event.nativeEvent.x - event.currentTarget.getBoundingClientRect().left;
    const width = event.currentTarget.getBoundingClientRect().width;
    const columnWidth = width / 7;
    const column = Math.floor(x / columnWidth);
    // console.log(x, column);
    send({ type: 'HOVER_COLUMN', column });
  };

  const handleColumnSelect = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const x =
      event.nativeEvent.x - event.currentTarget.getBoundingClientRect().left;
    const width = event.currentTarget.getBoundingClientRect().width;
    const columnWidth = width / 7;
    const column = Math.floor(x / columnWidth);
    // console.log(x, column);
    send({ type: 'HOVER_COLUMN', column });
    send({ type: 'SELECT_COLUMN', column });
  };

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

      {/* Select column button */}
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

                  const timeout = column == 3 ? 1 : 300;

                  setTimeout(() => {
                    send({ type: 'SELECT_COLUMN', column });
                  }, timeout);
                }}
              ></button>
            );
          })}
        </div>
      )}

      {/* TODO: In progress */}
      {/* {discState === 'waiting' && (
        <button
          className="absolute h-full w-full"
          onPointerMove={(event) => handleColumnHover(event)}
          onPointerUp={(event) => handleColumnSelect(event)}
        ></button>
      )} */}

      {/* Discs */}
      <AnimatePresence>
        {gameGrid.map((rows) => {
          return rows.map((gameDisc, i) => {
            if (
              gameDisc &&
              gameDisc.position[0] !== null &&
              gameDisc.position[1] !== null
            ) {
              // TODO: Move to gameGrid()?
              const isNextLevelEntering = nextLevelDiscIds.includes(
                gameDisc.id
              );

              let index = updatedIds.findIndex((id) => id === gameDisc.id);

              return (
                <Drop7Disc
                  id={gameDisc.id}
                  value={gameDisc.value}
                  column={gameDisc.position[0]}
                  row={gameDisc.position[1]}
                  state={isNextLevelEntering ? 'level-entering' : discState}
                  index={index >= 0 ? index : undefined}
                  // index={i}
                  key={gameDisc.id}
                />
              );
            }

            return null;
          });
        })}
      </AnimatePresence>

      {children}

      {/* Cracked disc mask */}
    </motion.div>
  );
};
