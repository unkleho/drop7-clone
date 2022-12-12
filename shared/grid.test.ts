import { describe, expect, it } from 'vitest';
import {
  collapseGrid,
  getAdjacentIds,
  getContinuousIds,
  getDroppingGrid,
  removeByIds,
  type Grid,
} from './grid';

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

  it('should find adjacent pieces', () => {
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

  it('should get array of ids in from bottom left up. Good for animation.', () => {
    const grid = [
      [null, null, null, null, null],
      ['disc-2', null, null, null, 'disc-5'],
      ['disc-1', 'disc-4', null, null, 'disc-3'],
    ];
    const newGrid = getContinuousIds(grid);

    expect(newGrid).toEqual(['disc-1', 'disc-4', 'disc-3', 'disc-2', 'disc-5']);
  });

  it('should get grid of ids about to be dropped', () => {
    const grid = [
      [null, 'disc-6', null, 'disc-7', null],
      ['disc-1', 'disc-4', null, null, 'disc-3'],
      ['disc-2', null, null, 'disc-5', null],
    ];
    const newGrid = getDroppingGrid(grid);

    expect(newGrid).toEqual([
      [null, 'disc-6', null, 'disc-7', null],
      [null, 'disc-4', null, null, 'disc-3'],
      [null, null, null, null, null],
    ]);
  });
});
