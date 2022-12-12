/**
 * Grid utilities for tile-based games
 */

/**
 * A 2D array to represent the grid
 */
export type Grid = (string | null)[][];

/**
 * Make clone of grid
 */
export function cloneGrid(grid: Grid) {
  const newGrid = grid.map((columns) => columns.slice());

  return newGrid;
}

/**
 * Check if two grids are the same
 */
export function isGridEqual(oldGrid: Grid, newGrid: Grid) {
  return (
    oldGrid.map((columns) => columns.join(',')).join(',') ===
    newGrid.map((columns) => columns.join(',')).join(',')
  );
}

/**
 * Get column and row values of id in grid
 * @returns [column, row]
 */
export function getPosition(
  grid: Grid,
  id: string
): [number | null, number | null] {
  let column = null;
  let row = null;

  grid.forEach((columns, currentRow) =>
    columns.find((cellId, currentColumn) => {
      if (cellId && cellId === id) {
        column = currentColumn;
        row = currentRow;
      }
    })
  );

  return [column, row];
}

/**
 * Collapse down any gaps in the grid
 */
export function collapseGrid(grid: Grid): Grid {
  // Store original number of rows
  const totalRows = grid.length;

  // Convert to an array of columns
  const rotatedGrid = rotateGrid(cloneGrid(grid));

  // Filter out nulls in between puyos
  const filteredGrid = rotatedGrid.map((columns) => {
    return columns.filter((column) => column);
  });

  // Pad out nulls
  const paddedGrid = filteredGrid.map((columns) =>
    padEnd(columns, totalRows, null)
  );

  // Rotate and Convert to array of rows
  // (Sorry, not the most efficient!)
  const newGrid = rotateGrid(rotateGrid(rotateGrid(paddedGrid)));

  return newGrid;
}

/**
 * Rotate grid
 */
function rotateGrid(grid: Grid): Grid {
  return grid[0].map((column, index) => {
    return grid.map((row) => row[index]).reverse();
  });
}

/**
 * Pad end of array
 */
function padEnd(array: any[], minLength: number, fillValue: any) {
  return Object.assign(new Array(minLength).fill(fillValue), array);
}

/**
 * Get ids of adjacent pieces
 * @param grid
 * @param puyoId
 * @returns string[]
 */
export function getAdjacentIds(grid: Grid, id: string): string[] {
  const [column, row] = getPosition(grid, id);
  const pieces = [];

  if (typeof column === 'number' && typeof row === 'number') {
    // Top
    if (grid[row - 1] && grid[row - 1][column]) {
      pieces.push(grid[row - 1][column]);
    }
    // Right
    if (grid[row][column + 1]) {
      pieces.push(grid[row][column + 1]);
    }
    // Bottom
    if (grid[row + 1] && grid[row][column]) {
      pieces.push(grid[row + 1][column]);
    }
    // Left
    if (grid[row][column - 1]) {
      pieces.push(grid[row][column - 1]);
    }
  }

  return pieces as string[];
}

/**
 * Remove pieces by ids
 */
export function removeByIds(grid: Grid, ids: string[]) {
  const newGrid = grid.map((row) => {
    return row.map((cell) => {
      if (cell && ids.includes(cell)) {
        return null;
      }

      return cell;
    });
  });

  return newGrid;
}

export function getContinuousIds(grid: Grid) {
  const ids: string[] = [];

  cloneGrid(grid)
    .reverse()
    .forEach((row) => {
      row.forEach((cell) => {
        if (cell) {
          ids.push(cell);
        }
      });
    });

  return ids;
}

/**
 * Clear grid and only keep discs that are going to be dropped.
 * Useful to work out staggered animations
 */
export function getDroppingGrid(grid: Grid) {
  const totalRows = grid.length;
  const lastRow = grid[totalRows - 1];

  // Loop over each column
  lastRow.forEach((_, column) => {
    // Loop over each row from the bottom up
    let row = totalRows - 1;
    // Boolean switch, default to removing id
    let removeId = true;

    while (row >= 0) {
      const id = grid[row][column];

      // If we hit an empty cell, switch to keeping id
      // as id has space to drop below
      if (id === null && removeId) {
        removeId = false;
      }

      // Remove disc
      if (id && removeId) {
        grid[row][column] = null;
      }

      row--;
    }
  });

  return grid;
}
