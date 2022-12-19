import React, { useState } from 'react';
import { Drop7GameGrid } from '../components/drop7-game-grid';
import { buildGameGrid, DiscMap } from '../shared/drop7';
import { Grid } from '../shared/grid';

export const gridTallColumn: Grid = [
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, 'disc-5', null, null, null],
  [null, null, null, 'disc-4', null, null, null],
  [null, 'disc-1', 'disc-6', 'disc-3', null, null, null],
];

export const grid2: Grid = [
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, 'disc-5', null, null, null],
  [null, null, null, 'disc-4', null, null, null],
  [null, 'disc-1', 'disc-6', 'disc-3', 'disc-7', null, null],
];

export const gridCleared: Grid = [
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, 'disc-1', null, null, null, null, null],
];

export const discMapTallColumn: DiscMap = {
  'disc-1': 'cracked',
  'disc-2': 2,
  'disc-3': 3,
  'disc-4': 3,
  'disc-5': 3,
  'disc-6': 6,
  'disc-7': 7,
};

const Drop7GameGridPage = () => {
  const discMap: DiscMap = discMapTallColumn;
  const [grid, setGrid] = useState<Grid>(gridTallColumn);

  return (
    <div className="max-w-sm p-4">
      <div className="flex gap-4">
        <button onClick={() => setGrid(gridCleared)}>Clear</button>
        <button onClick={() => setGrid(grid2)}>Add</button>
        <button onClick={() => setGrid(gridTallColumn)}>Reset</button>
      </div>

      <Drop7GameGrid
        grid={grid}
        discMap={discMap}
        discState="entering"
        send={({ type, column }) => console.log(type, column)}
      />
    </div>
  );
};

export default Drop7GameGridPage;
