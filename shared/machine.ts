import { assign, createMachine } from 'xstate';
import {
  addDiscToGrid,
  crackAdjacentDiscs,
  Disc,
  DiscMap,
  emptyGrid,
  getMatchingGroups,
  getRandomDisc,
  getScore,
  setupGameGrid,
} from './drop7';
import { discMapTallColumn, gridTallColumn } from './example-grids';

import { cloneGrid, collapseGrid, Grid, removeByIds } from './grid';

const initialMovesPerLevel = 29;
const initialGameContext = {
  score: 0,
  level: 1,
  grid: emptyGrid,
  discMap: {},
  nextDisc: null,
  moves: initialMovesPerLevel,
  discCount: 0,
  currentChain: 0,
  matchedDiscIds: [],
};

export const drop7Machine =
  /** @xstate-layout N4IgpgJg5mDOIC5QQE4HsAOB2AdACzQFswBiAOQFEB1AfQHEBBAWQsVAzVgEsAXLtAHZsQAD0QBGAGwAWHAGYs0uQE4ArHIBMk8VqUAaEAE9EcyQA4cABkkbVdreOmSsWSQF83B1JlxQAhsQ4sGA8fAJQALQArhgkwhzcfILCYgiqWBo4ZuJmZpLq1tLpBsYICriScpaqyuJyquLVGsrSHl7o2Dj+gQDufrxc4REAZmgo0cEoOH28JAASAPIAahQASjQAwgsAMgCqTGTxnAPJSKKIZpYWdVjirmbS0srKluIliBri4jg1L2bP0iwckacjMbRA3k63TA036YUio3GUUm+DQADcwChBpEAMZoAA2UUIAjiZwSJyEZ1SGVkimyGlyeSccjk7wQtjkOCwZhUzVUGkBlXcnghHV8ARhM3hIzGE0xJAAyhRthQNgAVTY7faHMnHJKU0DUsy4erKS7mV5aUxs6Q6HAtJ4MrDpSy3ergyHiwKQjDYiIQLiwHGk9h6-gG84IHQaXDVf5qcR2Ow2NnNb6SK45M2grRAj1iroSnA4-FgPxYoaEPw8HF4SD+wM42AkESwHjVmF+YY8TEACkulgAlCRPYXAiWyxXIlWa3WIA2g-BdYlwykJI1VDhpPGXqpba9tDa5LJE8oWc71GZbML2j4xzDa2AcQBrP1QLEQFttjs4Ls9lC9qolhDiOBbQsWdYvm+H5HCupyGuu-I-MCkgZs8ahsnY3zOs4liAnuVzqPmd7gY+UFDKWGL4l+7Y9r+3Z9kBIGjqRkGvhRYBUbBFJrlG-KyFcNjiGo6imDobIqD8yifHu2iWJo+RyMRUJFoMOIoGAxACNKlFgNR3H6rxUh2nctxYNULgCqoNrqPIUgComVyWu6IosUWfgQAGQwTuW9YAEaCMiIYgOShlUhI2SWFyWDZo4x54babLmbgOHmfkwl4Q8ylejCYACPO0IkBQAAaACSaoGau4VpJyQHZDkUjAdo0hJdJVgsho5TOMajzZfeRVlRVy48dVjQWMCGiWJ1ki1FolxvEYiCobIMaKOkM2uMerTggIaAQHAwijgQxCVfBkYZDgk2dVeRTmTGrKLWUrg-Ny+SKM6LJ5H14HBKEfoxKdEapAo3z4TIloCq8C2lAomR1NYwHKNyShmKo31FlKfqInKUxSoDvEZLGjxTYpvLWo9Ui4ExSMxul0kxujvRwljsrIpiqIYlOER4oSxL49VV6cuYyjOA0tx4dZj3NBUlyyUBM3qOIjOSszQzY2zKD8whCDmVFdI6IyMiVA9pSPD8iOo0oqiXJ8yjKzgPp+gGQZa5GjTSJk6RIwmEvbmYqZIzgXwxTNqEss4Wj2z5XMzo+87O02rupFeUWVBkmjzbhWCYZNQc2ICV5qLaPJR2x0FcBAScSMeuBFDI3JSC8vI2hdNTbqo+T8i4WCl0+7GRLp+JV3x-xBzy8moV8x7Amyaf2uk27Ago2Zgq5YGqQI6maXlOmcXpw+JrkOCoQy9iNK4SMSZYyhZMjppMXhdtryR7meX60f+YFS6hnBQMSE4sh-io35K6JGihJBJTqFYbcNhcjcnARoe2eUCoSgPi0KKOQ66aBcI0Bks9HBbjsGeVw5gJpK2fipE6w0wraxrluHC0gIaMK+GyCIPItyuh5DGDKlQ7DZWHs0c29VsgZmsI4VhiZNyMO5CyeS19pHCg8EAA */
  createMachine(
    {
      context: initialGameContext,
      tsTypes: {} as import('./machine.typegen').Typegen0,
      schema: {
        context: {} as {
          grid: Grid;
          score: number;
          level: number;
          discMap: DiscMap;
          /** Next disc that is about to drop */
          nextDisc: { value: Disc; id: string } | null;
          /** Number of moves left in current level */
          moves: number;
          discCount: number;
          /** Current chain count during match/collapse loop */
          currentChain: number;
          matchedDiscIds: string[];
        },
        events: {} as
          | { type: 'NEW_GAME' }
          | { type: 'START_GAME' }
          | { type: 'HOVER_COLUMN'; column: number }
          | { type: 'SELECT_COLUMN'; column: number }
          | { type: 'RESTART' }
          | { type: 'COLLAPSE_DISCS' }
          | { type: 'CHECK_GRID' }
          | { type: 'CHECK_LEVEL' }
          | { type: 'INCREMENT_LEVEL' }
          | { type: 'EXIT' }
          | { type: 'INCREMENT_SCORE' },
      },
      initial: 'home',
      id: 'drop7',
      states: {
        home: {
          on: {
            NEW_GAME: {
              actions: 'consoleLogValue',
              target: 'game',
            },
          },
        },
        game: {
          entry: 'setupGame',
          initial: 'setting-up',
          states: {
            'setting-up': {
              always: {
                target: 'waiting-for-user',
              },
            },
            'waiting-for-user': {
              entry: 'getRandomDisc',
              initial: 'wait',
              states: {
                wait: {
                  on: {
                    HOVER_COLUMN: {
                      actions: 'hoverColumn',
                      target: 'hovering-column',
                    },
                  },
                },
                'hovering-column': {
                  always: {
                    target: 'wait',
                  },
                },
              },
              on: {
                SELECT_COLUMN: {
                  actions: 'dropDisc',
                  target: 'dropping-disc',
                },
              },
            },
            'dropping-disc': {
              always: {
                actions: 'collapseDiscs',
                target: 'checking-grid',
              },
            },
            'clearing-matched-discs': {
              exit: 'clearMatchedDiscs',
              after: {
                '800': {
                  actions: ['incrementScore', 'collapseDiscs'],
                  target: 'checking-grid',
                },
              },
            },
            'checking-grid': {
              after: {
                '500': [
                  {
                    cond: 'GRID_CLEARED',
                    target: 'adding-cleared-bonus',
                  },
                  {
                    cond: 'NO_DISC_MATCHES',
                    target: 'checking-level',
                  },
                  {
                    cond: 'DISC_MATCHES',
                    target: 'clearing-matched-discs',
                  },
                ],
              },
            },
            'checking-level': {
              after: {
                '500': [
                  {
                    cond: 'GRID_FULL',
                    target: 'end-game',
                  },
                  {
                    cond: 'MOVES_LEFT_IN_LEVEL',
                    target: 'waiting-for-user',
                  },
                  {
                    cond: 'NO_MOVES_LEFT_IN_LEVEL',
                    target: 'incrementing-level',
                  },
                ],
              },
            },
            'incrementing-level': {
              entry: 'incrementLevel',
              always: [
                {
                  cond: 'GRID_OVER',
                  target: 'end-game',
                },
                {
                  cond: 'GRID_NOT_OVER',
                  target: 'checking-grid',
                },
              ],
            },
            'adding-cleared-bonus': {
              always: {
                target: 'checking-level',
              },
            },
            'end-game': {
              on: {
                EXIT: {
                  target: '#drop7.home',
                },
              },
            },
          },
          on: {
            EXIT: {
              target: 'home',
            },
          },
        },
      },
    },
    {
      actions: {
        setupGame: assign((context) => {
          let [grid, discMap] = setupGameGrid(10);

          return {
            ...initialGameContext,
            grid,
            discMap,
            discCount: Object.keys(discMap).length,
          };

          // TODO: Turn this into a tutorial
          // return {
          //   grid: gridTallColumn,
          //   discMap: discMapTallColumn,
          //   discCount: 8,
          //   nextDisc: {
          //     id: 'disc-8',
          //     value: 2 as Disc,
          //   },
          // };
        }),
        getRandomDisc: assign((context) => {
          // Check for next disc, if it is available, it indicates we are in tutorial mode
          const discId = context.nextDisc
            ? context.nextDisc.id
            : 'disc-' + context.discCount;

          // TODO: Rename type and function to DiscValue?
          const discValue = context.nextDisc
            ? context.nextDisc.value
            : getRandomDisc();
          const grid = cloneGrid(context.grid);
          grid[0][3] = discId;

          return {
            nextDisc: {
              id: discId,
              value: discValue,
            },
            discMap: {
              ...context.discMap,
              [discId]: discValue,
              // [discId]: 1,
            },
            discCount: context.discCount + 1,
            grid,
            // Start chain again
            currentChain: 0,
          };
        }),
        hoverColumn: assign((context, event) => {
          const nextGrid = cloneGrid(context.grid);
          const nextDiscId = context.nextDisc?.id;

          if (nextDiscId) {
            nextGrid[0] = nextGrid[0].map((value, column) => {
              if (column === event.column) {
                return nextDiscId;
              }

              return null;
            });
          }

          return {
            grid: nextGrid,
          };
        }),
        dropDisc: assign((context, event) => {
          if (!context.nextDisc) {
            return {};
          }

          // Put disc on first row
          // TODO: Check if enough space
          const grid = cloneGrid(context.grid);
          grid[0][event.column] = context.nextDisc.id;

          console.log(
            '--- dropDisc',
            event.column,
            context.discMap,
            // discId,
            grid
          );

          if (context.nextDisc) {
            return {
              grid,
              moves: context.moves - 1,
              nextDisc: null,
            };
          }

          return {};
        }),
        clearMatchedDiscs: assign((context, event) => {
          // Get matched disc ids
          const matchedDiscIds = getMatchingGroups(
            context.grid,
            context.discMap
          );

          // Crack or destroy adjacent discs
          const [crackedGrid, discMap] = crackAdjacentDiscs(
            context.grid,
            context.discMap,
            matchedDiscIds
          );

          // Clear grid of matched ids
          const clearedGrid = removeByIds(crackedGrid, matchedDiscIds);

          console.log('clearMatchedDiscs', clearedGrid, matchedDiscIds);

          return {
            grid: clearedGrid,
            discMap,
            // Pass ids for scoring
            // TODO: Can use this for highlighting tiles
            matchedDiscIds,
          };
        }),
        collapseDiscs: assign((context) => {
          console.log('collapseDiscs', context.grid);

          return {
            grid: collapseGrid(context.grid),
          };
        }),
        incrementScore: assign((context) => {
          // const matchedIds = getMatchingGroups(context.grid, context.discMap);
          const currentChain = context.currentChain + 1;

          const score = getScore(context.matchedDiscIds.length, currentChain);

          console.log(
            'incrementScore',
            context.matchedDiscIds.length,
            currentChain
          );

          return {
            score: context.score + score,
            currentChain,
            matchedDiscIds: [],
          };
        }),
        incrementLevel: assign((context, event) => {
          const grid = cloneGrid(context.grid);
          const level = context.level + 1;
          const moves =
            initialMovesPerLevel - context.level <= 1
              ? 1
              : initialMovesPerLevel - context.level;
          let discMap = context.discMap;

          // Remove top row of grid
          grid.shift();

          if (grid.length) {
            const lastRow = grid.length;
            // Add new last row
            grid[lastRow] = [];

            // Create last row on grid and fill in disc map
            [...new Array(7)].forEach((_, column) => {
              const discId = 'disc-' + context.discCount + column;
              grid[lastRow][column] = discId;

              discMap = {
                ...discMap,
                [discId]: 'blank',
              };
            });
          }

          console.log('incrementLevel', grid);

          return {
            level,
            moves,
            grid,
            discMap,
            // Increment count by 7 as we added 7 new discs
            discCount: context.discCount + 7,
          };
        }),
        consoleLogValue: (context, event) => {
          // Wow! event is typed to { type: 'FOO' }
          // console.log(event);
          // raise('START_GAME');
        },
      },
    }
  ).withConfig({
    actions: {},
    guards: {
      GRID_CLEARED: () => {
        return false;
      },
      GRID_OVER: (context) => {
        // Get top row where next disc starts. This should be empty during the check states.
        const topRow = context.grid[0];
        const isClear = topRow.every((value) => value === null);

        console.log('GRID_OVER', topRow, !isClear);

        return !isClear;
      },
      GRID_NOT_OVER: () => {
        return true;
      },
      GRID_FULL: (context) => {
        // Get top row of game grid. Actual top row is for next disc.
        const gameGridTopRow = context.grid[1];
        const isFull = gameGridTopRow.every((value) => value !== null);

        console.log('GRID_FULL', gameGridTopRow, isFull);

        return isFull;
      },
      NO_DISC_MATCHES: (context) => {
        const groups = getMatchingGroups(context.grid, context.discMap);
        const noDiscMatches = groups.length === 0;

        if (noDiscMatches) {
          console.log('NO_DISC_MATCHES', groups);
        }

        return noDiscMatches;
      },
      DISC_MATCHES: (context) => {
        const groups = getMatchingGroups(context.grid, context.discMap);
        const hasDiscMatches = groups.length > 0;

        if (hasDiscMatches) {
          console.log('DISC_MATCHES', groups);
        }

        return hasDiscMatches;
      },
      MOVES_LEFT_IN_LEVEL: (context) => {
        return Boolean(context.moves);
      },
      NO_MOVES_LEFT_IN_LEVEL: (context) => {
        return context.moves === 0;
      },
    },
    services: {},
  });

// const drop7Service = interpret(drop7Machine).start();
