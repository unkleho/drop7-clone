import { describe, expect, it } from 'vitest';
import {
  addDiscToGrid,
  buildGameGrid,
  crackAdjacentDiscs,
  GameGrid,
  getMatchingGroups,
  getScore,
  setupGameGrid,
} from './drop7';
import type { DiscMap } from './drop7';

describe('Add disc', () => {
  it('should drop disc to bottom', () => {
    const grid = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];

    const nextGrid = addDiscToGrid(grid, 0, 'disc-1');
    expect(nextGrid).toEqual([
      [null, null, null],
      [null, null, null],
      ['disc-1', null, null],
    ]);
  });

  it('should drop disc to second row', () => {
    const grid = [
      [null, null, null],
      [null, null, null],
      [null, 'disc-1', null],
    ];

    const nextGrid = addDiscToGrid(grid, 1, 'disc-2');
    expect(nextGrid).toEqual([
      [null, null, null],
      [null, 'disc-2', null],
      [null, 'disc-1', null],
    ]);
  });
});

describe('DiscValue number matching', () => {
  it('should check if disc numbers match group length by row', () => {
    const grid = [
      [null, null, null, null, null],
      [null, null, null, null, null],
      ['disc-1', 'disc-2', null, null, 'disc-3'],
    ];
    const discMap: DiscMap = {
      ['disc-1']: 2,
      ['disc-2']: 2,
      ['disc-3']: 3,
      ['disc-4']: 2,
    };

    const discsToRemove = getMatchingGroups(grid, discMap);
    expect(discsToRemove).toEqual(['disc-1', 'disc-2']);
  });

  it('should check if disc numbers match group length by column', () => {
    const grid = [
      [null, null, null, null, null],
      ['disc-2', null, null, null, null],
      ['disc-1', null, null, null, 'disc-3'],
    ];
    const discMap: DiscMap = {
      ['disc-1']: 2,
      ['disc-2']: 2,
      ['disc-3']: 3,
    };

    const discsToRemove = getMatchingGroups(grid, discMap);
    expect(discsToRemove).toEqual(['disc-2', 'disc-1']);
  });

  it('should check if disc numbers match group length by row and column', () => {
    const grid = [
      [null, null, null, null, null],
      ['disc-2', null, null, null, 'disc-5'],
      ['disc-1', 'disc-4', null, null, 'disc-3'],
    ];
    const discMap: DiscMap = {
      ['disc-1']: 2,
      ['disc-2']: 2,
      ['disc-3']: 3,
      ['disc-4']: 2,
      ['disc-5']: 3,
    };

    const discsToRemove = getMatchingGroups(grid, discMap);
    // console.log(discsToRemove);
    expect(discsToRemove).toEqual(['disc-1', 'disc-4', 'disc-2']);
  });

  it('should crack or break adjacent discs', () => {
    const grid = [
      [null, null, 'disc-3', null, null],
      ['cracked-1', 'disc-2', 'disc-4', null],
      ['disc-1', 'blank-1', 'blank-2', null, null],
    ];
    const discMap: DiscMap = {
      ['disc-1']: 3,
      ['disc-2']: 3,
      ['disc-3']: 6,
      ['disc-4']: 6,
      ['blank-1']: 'blank',
      ['blank-2']: 'blank',
      ['cracked-1']: 'cracked',
    };

    const newDiscMap = crackAdjacentDiscs(grid, discMap, ['disc-2', 'disc-3']);

    // Check new grid has cracked -> 1
    expect(newDiscMap[0]).toEqual([
      [null, null, 'disc-3', null, null],
      ['cracked-1', 'disc-2', 'disc-4', null],
      ['disc-1', 'blank-1', 'blank-2', null, null],
    ]);

    // Check disc map has cracked deleted
    expect(newDiscMap[1]).toEqual({
      ['disc-1']: 3,
      ['disc-2']: 3,
      ['disc-3']: 6,
      ['disc-4']: 6,
      ['blank-1']: 'cracked',
      ['blank-2']: 'blank',
      ['cracked-1']: expect.any(Number),
    });
  });

  describe('Score', () => {
    it('should get score 1 chain', () => {
      const score = getScore(1, 1);
      expect(score).toEqual(7);
    });

    it('should get score 2 chain', () => {
      const score = getScore(2, 2);
      expect(score).toEqual(78);
    });

    it('should get score 3 chain', () => {
      const score = getScore(2, 3);
      expect(score).toEqual(218);
    });

    it('should get score 4 chain', () => {
      const score = getScore(3, 4);
      expect(score).toEqual(672);
    });
  });

  describe('Setup Game Grid', () => {
    it('should return new grid with 10 discs', () => {
      const [grid] = setupGameGrid(10);

      let count = 0;
      grid.forEach((row) => {
        row.forEach((discId) => {
          if (discId) {
            count++;
          }
        });
      });

      expect(count).toBe(10);
    });
  });

  describe('Decorated Game Grid', () => {
    it('should return decorated game grid', () => {
      const grid = [
        [null, null, 'disc-3', null, null],
        ['cracked-1', 'disc-2', 'disc-4', null],
        ['disc-1', 'blank-1', 'blank-2', null, null],
      ];
      const discMap: DiscMap = {
        ['disc-1']: 3,
        ['disc-2']: 3,
        ['disc-3']: 6,
        ['disc-4']: 6,
        ['blank-1']: 'blank',
        ['blank-2']: 'blank',
        ['cracked-1']: 'cracked',
      };

      const gameGrid: GameGrid = buildGameGrid(grid, discMap);
      expect(gameGrid).toEqual<GameGrid>([
        [null, null, { id: 'disc-3', value: 6, position: [2, 0] }, null, null],
        [
          { id: 'cracked-1', value: 'cracked', position: [0, 1] },
          { id: 'disc-2', value: 3, position: [1, 1] },
          { id: 'disc-4', value: 6, position: [2, 1] },
          null,
        ],
        [
          { id: 'disc-1', value: 3, position: [0, 2] },
          { id: 'blank-1', value: 'blank', position: [1, 2] },
          { id: 'blank-2', value: 'blank', position: [2, 2] },
          null,
          null,
        ],
      ]);
    });
  });
});
