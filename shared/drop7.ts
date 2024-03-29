import {
  cloneGrid,
  collapseGrid,
  getAdjacentIds,
  GridPosition,
  removeByIds,
  type Grid,
} from './grid';

export type DiscValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 'blank' | 'cracked';

export type DiscMap = {
  [k in string]: DiscValue;
};

export type DiscState = 'waiting' | 'entering' | 'dropping';

export type GameDisc = {
  id: string;
  /** DiscValue value */
  value: DiscValue;
  position: GridPosition;
  state?: DiscState;
};

export type GameGrid = (GameDisc | null)[][];

export const emptyGrid: Grid = [
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
];

/**
 * Get random disc
 */
export const getRandomDisc = (mode: 'numbers' | 'all' = 'all') => {
  const allDiscs: DiscValue[] = [1, 2, 3, 4, 5, 6, 7, 'blank'];
  let discs = allDiscs;

  if (mode === 'numbers') {
    discs = allDiscs.filter((disc) => disc !== 'blank');
  }

  const randomInt = Math.floor(Math.random() * discs.length);
  return discs[randomInt];
};

/**
 * Drop disc into grid based on column
 */
export const addDiscToGrid = (grid: Grid, column: number, id: string) => {
  const newGrid = cloneGrid(grid);

  // Work out lowest empty cell
  let hasEmptyCellBelow = true;
  let count = 0;
  while (hasEmptyCellBelow) {
    // Check next cell below
    const nextCell = newGrid[count] && newGrid[count][column];
    hasEmptyCellBelow = nextCell === null;

    if (hasEmptyCellBelow) {
      count++;
    } else {
      // No empty cell, assign id to previous cell
      // TODO: Add handling and test for when newGrid[count - 1] is undefined
      newGrid[count - 1][column] = id;
      break;
    }
  }

  return newGrid;
};

/**
 * Check grid for disc numbers that match row or column length, then return ids.
 */
export function getMatchingGroups(grid: Grid, discMap: DiscMap): string[] {
  const rowGroups = getRowGroups(grid);
  const columnGroups = getColumnGroups(grid);

  // Join groups
  const groups = [...rowGroups, ...columnGroups];

  // Check group for length match
  const discIdsToRemove: string[] = [];
  groups.forEach((discIds) => {
    const groupLength = discIds.length;

    discIds.forEach((discId) => {
      const disc = discMap[discId];

      // Check if disc number matches groupLength
      if (disc === groupLength) {
        discIdsToRemove.push(discId);
      }
    });
  });

  const dedupedDiscIdsToRemove = [...new Set(discIdsToRemove)];

  // console.log('rowGroups', rowGroups);
  // console.log('columnGroups', columnGroups);
  // console.log('discIdsToRemove', discIdsToRemove);

  return dedupedDiscIdsToRemove;
  // return dedupedDiscIdsToRemove.map((id) => getPosition(grid, id));
}

/**
 * Loop over each row in `grid` and gather groups of discs
 */
function getRowGroups(grid: Grid) {
  const allRowGroups: string[][][] = [];

  // Loop over each row
  grid.forEach((row) => {
    const rowGroups: string[][] = [];
    let rowCount = 0;

    // Loop over each column and find group of discs
    row.forEach((cell, columnIndex) => {
      const prevCell = row[columnIndex - 1];

      if (cell) {
        rowGroups[rowCount] = [...(rowGroups[rowCount] || []), cell];
      } else if (prevCell) {
        // If there is a prev cell and no current cell, it means the group has ended
        // Start a new group by incrementing rowCount
        rowCount++;
      }
    });

    if (rowGroups.length) {
      allRowGroups.push(rowGroups);
    }
  });

  return allRowGroups.flat();
}

/**
 * Loop over each column in `grid` and gather groups of discs
 */
function getColumnGroups(grid: Grid) {
  const allColumnGroups: string[][][] = [];

  // Get groups by column
  grid[0].map((column, columnIndex) => {
    let columnCount = 0;
    const columnGroups: string[][] = [];

    grid.forEach((row, rowIndex) => {
      const cell = row[columnIndex];
      const prevCell = grid[rowIndex - 1]
        ? grid[rowIndex - 1][columnIndex]
        : undefined;

      if (cell) {
        columnGroups[columnCount] = [
          ...(columnGroups[columnCount] || []),
          cell,
        ];
      } else if (prevCell) {
        // If there is a prev cell but no current cell, it means the group has ended
        // Start a new group by incrementing count
        columnCount++;
      }
    });

    if (columnGroups.length) {
      allColumnGroups.push(columnGroups);
    }
  });

  return allColumnGroups.flat();
}

/**
 * Crack adjacent discs
 * cracked -> null
 * blank -> cracked
 */
export function crackAdjacentDiscs(
  grid: Grid,
  discMap: DiscMap,
  ids: string[]
): [Grid, DiscMap] {
  // Clone Grid
  const newGrid = cloneGrid(grid);

  // Clone discMap
  const newDiscMap = {
    ...discMap,
  };

  let allAdjacentIds: string[] = [];

  // Get ids that need to be cracked
  ids.forEach((id) => {
    const adjacentIds = getAdjacentIds(grid, id);
    allAdjacentIds = [...allAdjacentIds, ...adjacentIds];
  });

  // Dedupe ids as we don't wanna double crack
  const dedupedIds = [...new Set(allAdjacentIds)];

  // Crack those discs
  dedupedIds.forEach((id) => {
    const disc = discMap[id];

    if (disc === 'blank') {
      newDiscMap[id] = 'cracked';
    } else if (disc === 'cracked') {
      newDiscMap[id] = getRandomDisc('numbers');
    }
  });

  return [newGrid, newDiscMap];
}

/**
 * Check if position is valid. Helps with type narrowing
 * eg.
 * if (isValidPosition(position)) {
 *   const [column, row] = position;
 *	 newGrid[row][column] = null;
 * }
 *
 * @param position [column, row]
 * @returns
 */
export function isValidPosition(
  position: [number | null, number | null]
): position is [number, number] {
  const [column, row] = position;
  if ((row || row === 0) && (column || column === 0)) {
    return true;
  }

  return false;
}

/**
 * Work out score based on current chain
 * https://www.reddit.com/r/drop7/comments/b3dg1w/drop7_scoring/
 * 7 * (CHAIN ^ 2.5)
 */
export function getScore(clearedDiscs: number, currentChain: number) {
  return clearedDiscs * Math.floor(7 * Math.pow(currentChain, 2.5));
}

/**
 * Set up new random game grid with at least X number of discs
 * Recursively calls itself until initial amount of discs is available
 */
export function setupGameGrid(
  discCount: number = 10,
  count: number = 0,
  grid = cloneGrid(emptyGrid),
  discMap = {}
): [Grid, DiscMap] {
  [...new Array(discCount)].forEach((_, i) => {
    const discValue = getRandomDisc();
    const discId = 'disc-' + (i + count);
    const column = Math.floor(Math.random() * 7);

    discMap = {
      ...discMap,
      [discId]: discValue,
    };
    grid = addDiscToGrid(grid, column, discId);
  });

  const matchingDiscIds = getMatchingGroups(grid, discMap);

  grid = removeByIds(grid, matchingDiscIds);
  grid = collapseGrid(grid);

  const totalMatchingDiscs = matchingDiscIds.length;
  // console.log('totalMatchingDiscs', totalMatchingDiscs);

  // If no more matching discs, return final result
  if (matchingDiscIds.length === 0) {
    return [grid, discMap];
  }

  // Otherwise, recursively call function with required amount of new discs
  return setupGameGrid(totalMatchingDiscs, count + discCount, grid, discMap);
}

/**
 * Build game grid from grid of ids and disc map
 */
export function buildGameGrid(grid: Grid, discMap: DiscMap): GameGrid {
  return grid.map((rows, row) => {
    return rows.map((id, column) => {
      if (id === null) {
        return null;
      }

      return {
        id,
        value: discMap[id],
        position: [column, row],
      };
    });
  });
}
