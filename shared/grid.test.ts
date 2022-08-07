import { describe, expect, it } from 'vitest';
import { collapseGrid, getAdjacentIds, removeByIds, type Grid } from './grid';

describe('Grid', () => {
  it('should that gaps in grid are collapsed', () => {
    const grid = [
      ['disc-2', null, null, null, null],
      [null, null, null, null, 'disc-5'],
      ['disc-1', 'disc-4', null, null, 'disc-3'],
    ];

    const newGrid = collapseGrid(grid);
    expect(newGrid).toEqual([
      [null, null, null, null, null],
      ['disc-2', null, null, null, 'disc-5'],
      ['disc-1', 'disc-4', null, null, 'disc-3'],
    ]);
  });

  it('should find adjacent puyos', () => {
    const grid: Grid = [
      [null, null, null, null, null, null],
      [null, 'user-1', 'user-0', null, null, null],
      [null, null, null, null, null, null],
      [null, null, '8', null, null, null],
      ['4', '6', '7', '9', null, null],
      ['0', '1', '2', '3', '5', null],
    ];

    const ids = getAdjacentIds(grid, '1');
    expect(ids).toEqual(['6', '2', '0']);
  });

  it('should remove pieces by ids', () => {
    const grid = [
      [null, null, null, null, null],
      ['disc-2', null, null, null, 'disc-5'],
      ['disc-1', 'disc-4', null, null, 'disc-3'],
    ];
    const newGrid = removeByIds(grid, ['disc-1', 'disc-5', 'disc-3']);
    expect(newGrid).toEqual([
      [null, null, null, null, null],
      ['disc-2', null, null, null, null],
      [null, 'disc-4', null, null, null],
    ]);
  });
});
