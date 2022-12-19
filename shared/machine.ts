import { assign, createMachine } from 'xstate';
import {
  addDiscToGrid,
  crackAdjacentDiscs,
  DiscValue,
  DiscMap,
  emptyGrid,
  getMatchingGroups,
  getRandomDisc,
  getScore,
  setupGameGrid,
} from './drop7';
import {
  discMapAllClear,
  discMapTallColumn,
  gridAllClear,
  gridTallColumn,
} from './example-grids';

import {
  cloneGrid,
  collapseGrid,
  getGridDiff,
  Grid,
  GridDiff,
  removeByIds,
} from './grid';

// export const initialMovesPerLevel = 29; // Original game
export const initialMovesPerLevel = 20;
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
  diffDiscIds: {
    addedIds: [],
    updatedIds: [],
    removedIds: [],
  },
};

export const drop7Machine =
  /** @xstate-layout N4IgpgJg5mDOIC5QQE4HsAOB2AdACzQFswBiAOQFEB1AfQHEBBAWQoG0AGAXUVAzVgCWAFwFoAdjxAAPRAEYALAGYc7AGxZ5qgEyqAHFl26AnFoA0IAJ5zVOfVnZHZqgKxHdq2YoMBfb+dSYuFAAhsQ4sGBCImJQALQArhgkUrBCwUJgOMEAZhkoABTO7OwAlCQB2DghYRFRAjEJGBzcSCB8giLikjIIzlryOFpG7MZKioq6OrrmVgjy7Dh9RvOqI-NOWli+-uiV1ZkA7sHC9XHZaCgJESg4R8IkABIA8gBqFABKNADCTwAyAKpMMjNSTtE5dVo9XTOXSDdhYLCrIyqIxGGFYGaILSKGyKTZ6ewOQybLZ+EAVIKhQ7HaJnC5XMA3AgAN0Zp1iAGM0AAbeKEMQkEGtMGdCSQxBYcY4RTyTbOMZYZwuZyYhCKWQLRXqdjq7FOeTbcm7SlhO602LnS7xa4kADKFF+FC+ABVvn9AcCuKD+OCxaAehq3IsTLI3Gi3Lp5EZVVp9DgNUpVi5+rIfGSKVUqTgKhh2RABLAOYKvcKfaLunJdSphrINex5K5nCrLFi4wmJu5UcUjIaM-scBzuWBgih2YR0hy8JBYvnC7Bkql0pkcnl8rpimU+1nB8PRw1x0JJ9PZxzYELeGXRH7pIh1MpJVp2M5ZFpnAiDBiW71HDgNASjJKUY6qovbGpmYRHhyADW7JQKOEALmkGRZLkjKFBu5Rgf2kEwQ0cECBA55tJeEL+nI8iGLYMq6HiEyxs4eKqhquCaH0DaaFgJhaNxoGBOBmQ4bB8GIUuKGrkUpSYXx2FTtBQkEawsgtBeHRXhWCCpuugzaPKWi1k+OKfrMzE4Kx-TyuoXHYrxezbrJuFxPhCEpEhy6oQUEmblhdlgHJeHwawWjKcRqmkTeGkMUYpmeIihiyJGDGKKqiqwtiNFPk4igMdoNkmgJ9nskOrLciJyErmhnlSbZEEFQ0RVgNyREimprSzKoXg4GiGg0TFbgTOYAYGAM9bGG+7Xxc+uX8QOtVxPVJUuaJ5UeRhW41b5DmxPNinBc1YWDZGKgUV143QrIqowlFXUUeqXh9boU0yRthVgMVpVueJq3eetflza9DWBbtJHXgdw3HWN6pnaqejKAoWCeJomwpiB6bfZk9QcigYDEGI5rzcWQOhdesyKA4thDVlaLFPW0bhfFni2A29bPn0qYozs0lZhjWM43j-0lTt3pE+pmkDPItaKCYfWBqqmjDbdMKvpG7guI9WbBBA+YNDuI7TgARuI1oE0Lvoi3osIqymriS9RyWxtKhnuLWqhRssathGAYgQLE+wkBQAAaACSzpNcDkhtQoplNkYXiqDDL7neFempjgLs6M+oaTOx7vo2ImPY575qFhcpCh8LrWIE2AyvnHwx0cMMIDXInjKOoDb2OM-Q6jnftByHJYqab4oIHpcdHbIMKuLWaJvqqsShrgDFncMyJFKivhkmIaAQHAkgZgQxAm+Ww9BjH-Tcdx7AKEq0xfvPcZeDRyx6TKj5Kjn4SROaiRHy1ZFqoqUyj40Q6G4usROsx5iLCGCsNYV92qKA-madkloGQ3DNL-faEoJiDHFsMV8CZ3BMQMJ1JwAFboKB1FoJBNIUH0mtIyfAaBWR7jiFyXk-JMEg0QD1eMnFlbPhGIYIyiAZS4g1BqQwytJgIhoScBoqCGEoC4epPQzhpSykVAqJUTZZayE6qzPS7AphOHZkaTmYQcx5gLByFRw9awM0fOuRwxQhjuCSl+R894YZDARPCYwCgP461YbEA8R5vYnngKWcu-95BQI1C4VMj54ETw8bMdEqcbYxVWDKcYQTZo+3gnY-+CMWJKnkAYMhOoTCyywFoYMFEdF9HfPk56dV+bFLppdeM6UcQeARuqaGHVro9TujRB6qMLG53zrzF6xVOkBhhLCOO9FWbwhRCItUZN9CRkphJGmH8NZazYUOXW3sDZiGtAs8iLtbBuCbI+TiCJNDJQZiNbQwj9CIw-p7b2+xrkaWWAseKDZ2okg1LGaGkcGzW0RPHPSH9uYF1xuyYuWMAXDBsO4HUxRdT6FTBdeUgwlQoh1JMBuEyObVTAACvELFgF9G0F3Wsc9kSmSyhUlY8M06yFygCoonU8SygvlfUFt9ZixFjDYFmQjQx6GWLyjeQA */
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
          nextDisc: { value: DiscValue; id: string } | null;
          /** Number of moves left in current level */
          moves: number;
          discCount: number;
          /** Current chain count during match/collapse loop */
          currentChain: number;
          matchedDiscIds: string[];
          diffDiscIds: GridDiff;
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
              target: 'game',
              actions: 'consoleLogValue',
            },
          },
        },
        game: {
          entry: 'setupGame',
          initial: 'setting-up',
          states: {
            'setting-up': {
              after: {
                '500': {
                  target: '#drop7.game.waiting-for-user',
                  actions: [],
                  internal: false,
                },
              },
            },
            'waiting-for-user': {
              entry: 'getRandomDisc',
              initial: 'wait',
              states: {
                wait: {
                  on: {
                    HOVER_COLUMN: {
                      target: 'hovering-column',
                      actions: 'hoverColumn',
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
                  target: 'dropping-disc',
                  actions: 'dropDisc',
                },
              },
            },
            'dropping-disc': {
              always: {
                target: 'checking-grid',
                actions: 'collapseDiscs',
              },
            },
            'clearing-matched-discs': {
              exit: 'clearMatchedDiscs',
              after: {
                '800': {
                  target: '#drop7.game.incrementing-score',
                  actions: [],
                  internal: false,
                },
              },
            },
            'checking-grid': {
              after: {
                '500': [
                  {
                    target: '#drop7.game.adding-cleared-bonus',
                    cond: 'GRID_CLEARED',
                    actions: [],
                    internal: false,
                  },
                  {
                    target: '#drop7.game.checking-level',
                    cond: 'NO_DISC_MATCHES',
                    actions: [],
                    internal: false,
                  },
                  {
                    target: '#drop7.game.clearing-matched-discs',
                    cond: 'DISC_MATCHES',
                    actions: [],
                    internal: false,
                  },
                ],
              },
            },
            'checking-level': {
              after: {
                '500': [
                  {
                    target: '#drop7.game.end-game',
                    cond: 'GRID_FULL',
                    actions: [],
                    internal: false,
                  },
                  {
                    target: '#drop7.game.waiting-for-user',
                    cond: 'MOVES_LEFT_IN_LEVEL',
                    actions: [],
                    internal: false,
                  },
                  {
                    target: '#drop7.game.incrementing-level',
                    cond: 'NO_MOVES_LEFT_IN_LEVEL',
                    actions: [],
                    internal: false,
                  },
                ],
              },
            },
            'incrementing-level': {
              entry: 'incrementLevel',
              always: [
                {
                  target: 'end-game',
                  cond: 'GRID_OVER',
                },
                {
                  target: 'checking-grid',
                  cond: 'GRID_NOT_OVER',
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
            'incrementing-score': {
              entry: 'incrementScore',
              exit: 'collapseDiscs',
              always: {
                target: 'checking-grid',
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
          //     value: 2 as DiscValue,
          //   },
          // };

          // TODO: Turn this into a tutorial
          // return {
          //   ...initialGameContext,
          //   grid: gridAllClear,
          //   discMap: discMapAllClear,
          //   discCount: 8,
          //   nextDisc: {
          //     id: 'disc-8',
          //     value: 6 as DiscValue,
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
            diffDiscIds: initialGameContext.diffDiscIds,
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

          const currentChain = context.currentChain + 1;

          // Clear grid of matched ids
          const clearedGrid = removeByIds(crackedGrid, matchedDiscIds);

          console.log(
            'clearMatchedDiscs',
            clearedGrid,
            matchedDiscIds,
            currentChain
          );

          return {
            grid: clearedGrid,
            discMap,
            // Pass ids for scoring
            // TODO: Can use this for highlighting tiles
            matchedDiscIds,
            currentChain,
          };
        }),
        collapseDiscs: assign((context) => {
          console.log('collapseDiscs', context.grid);

          return {
            grid: collapseGrid(context.grid),
            diffDiscIds: getGridDiff(context.grid, collapseGrid(context.grid)),
          };
        }),
        incrementScore: assign((context) => {
          // const matchedIds = getMatchingGroups(context.grid, context.discMap);
          // const currentChain = context.currentChain + 1;

          const score = getScore(
            context.matchedDiscIds.length,
            context.currentChain
          );

          console.log(
            'incrementScore',
            context.matchedDiscIds.length,
            context.currentChain
          );

          return {
            score: context.score + score,
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
