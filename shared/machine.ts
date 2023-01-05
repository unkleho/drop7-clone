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
  discMapEndGame,
  discMapTallColumn,
  gridAllClear,
  gridEndGame,
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
  /* Discs ids added in new level */
  nextLevelDiscIds: [],
  // diffDiscIds: {
  //   addedIds: [],
  //   updatedIds: [],
  //   removedIds: [],
  // },
};

export const drop7Machine =
  /** @xstate-layout N4IgpgJg5mDOIC5QQE4HsAOB2AdACzQFswBiAOQFEB1AfQHEBBAWQoG0AGAXUVAzVgCWAFwFoAdjxAAPRAEYALAGYc7AGxZ5qgEyqAHFl26AnFoA0IAJ5zVOfVnZHZqgKxHdq2YoMBfb+dSYuFAAhsQkFAAaAJIAKhzcSCB8giLikjIIWk427PKyzrqusrJGzs5Y5lYIALQluM6KhSUOLg5Gvv7o2DghxDiwYEIiYlDVAK4YJFKwQsFCYDjBAGbzKAAUzuzsAJQkAd29CwNDAiPjGPGSycKiEokZXs44nvKaRi4aikbyFZZy+Th5O8Sup5LoHEpnB0QPsgqEFgB3YI3M5LNAocYDFAkADKFAAMhQAMIxGhEgDy+IAqkwyJdEtdUndQBlnFpdDhFOxFGV5Dp2M4wUZKohHDgsAosOz3sZDOwsNDYT14TgkSjRmiMWMsarkUISAAJckANQoACUyZSaXSuFd+Dc0vdEILcKpVIpZFLZIZGg4RQg8rIcKpuVyTFkflpXoqunC+mrhhr0ZiwCh8GgAG6p06jADGaAANmNCGISPTePamelEHytOK3E4ymU3FhflUwTlFFouw1FD8Ggq-DDY8q+vsMDnqhABLBc2XbQzK7dqwh9Moux7ZLlVHygW25GL+Q5u4VXFgvDHAqOFrmC2BgihJ4Q5rm8JApzPc7ApjM5gtlqsazgjsewjocOC3vej5nM+Qivu+06zrA5ZJEujosnIApPK8xiuK8npuvI-rlEGqiOF2SjvEY3K6JeBwqvBuYANaTlAj4QD+szzIsKyphsWy7Eq4GMSxZxsQIEAoYyy5OggW5ig4gp5FgZSFLoZh-HJAJAh47waOC3yKIodFxjeb7Max7GcX+PGAZsIFCQx5miaM4mSbICQVikMkYXJXjsMG3aeFoRgaFGej+sUORZF4npdu4igeCZ14Qc5lkSdZ3EAXx9mCWBTlgBZYnsawWieah3nodIcjNjg7zsu63znt6kVkcG7pbAY4W5M4qjJcJaVnHeWYFpl-68esuWgVeA2FS51TDWABZSWhzLVX5Hi2AKkLfOwWQmMRhTPN2jiaHy4L5P1BVFaMi2jdMXHjXZAnTfRfQiZOd2sB5dqVWtGSeCGthZNoEouO4br+u6HL2J6Pq6ECoV9UOjnvYNt1gCNY22TlL2o2Zc2fZjS2leV0lVQDiUBV4uglEodj7ggZHKJ6Wyhdyjh6VdfSnLmKBgMQYiJgtxOjStf0rs08jBrTJjus4ngK-64WcjoKkeN2MUFNzCy8-zgvC3dZY-YuEuyXFuDGPk7B1B4On+kZuB7f5YKvKU4JQij+V9MEEDTmckEPu+ABG4javOZOrZL3o5AUfYSj8WDfERmlaCpgXyHtNv6Hkgo6zgYBiBA1SHOE0RxAuXkOv9iBZAKtiJee2g8loSuacUyjfPLLqbEYJiyPnesC4XwuzuipDi9XK7qbgfJbj8PIqa2sgO1KwZfDoshRoKrg8r4Q5iGgEBwJIsK-VPsmbHVFFaLfWg2-IvW6P61Tsk8e18hz+jvArg6dFeBBiDnyrLJNw18ox33vgoJ+L9vS4Bpl8OefZ769R1sAny60uw2CTrTFwTYWyM2qEYTurt7BZwRsUdoXsZoqmOMLCY6CKaIEeICe+pQdC30zsUf0mccBsl2iGBGNt3TGWoW9REepJyahTCgRhNcEBeGljgxs+C7DKxKOKSU+EXCtwUPnBMUjkzalTLqYQciVx8ldKFD0XhpTsF0IoB2gpngmFcA0PkfcQr6MkaiIxOoCBZmgnmQsxY1rk3kWyAK8tW6hRCpuYiWQ+GFGai0SM8h87jknIhXM5jZL6DrA0dwEC3YhUZsUaWkSNC9jZK8XI+dA5BOqLBeCxdsnwFNhfXyUUAq5B0BdN4SgeGvD4Y-ewvV6pOHqejEu7FcldO5EGIUYIFnGAFA7Ps4oJQOAonoLmYjTKpUJkNUWcz1oKAcM8LhHpzyP3lMrDQwYwRP1bI-Vo6T9kpSHgbImI1TkAwMEYdqXwDIKwUN8IZFTXmPyMsQxKZR86+39nmO8Qdi6hzENqP5-xuzr2-l4Uo5RHHtxMO1IKag+57TdPnQuxdDhYsyPYoMuR5SZx3NA1QyslCAgSipEEfIjKDzEHzYeQtJxj35vS4hAVAyCIVvfVuKd2wej4b3LeS83B733kAA */
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
          nextLevelDiscIds: string[];

          // diffDiscIds: GridDiff;
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
                  cond: 'CAN_DROP_DISC',
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

          // TODO: Turn this into a tutorial
          // return {
          //   ...initialGameContext,
          //   moves: 3,
          //   grid: gridEndGame,
          //   discMap: discMapEndGame,
          //   discCount: 9,
          //   nextDisc: {
          //     id: 'disc-9',
          //     value: 6 as DiscValue,
          //   },
          // };
        }),
        getRandomDisc: assign((context) => {
          // Check for next disc, if it is available, it indicates we are in tutorial mode
          const discId = context.nextDisc
            ? context.nextDisc.id
            : 'disc-' + context.discCount;

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
            // diffDiscIds: initialGameContext.diffDiscIds,
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
          const grid = cloneGrid(context.grid);
          grid[0][event.column] = context.nextDisc.id;

          console.log('--- dropDisc', event.column, context.discMap, grid);

          if (context.nextDisc) {
            return {
              grid,
              moves: context.moves - 1,
              nextDisc: null,
              nextLevelDiscIds: [],
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
          };
        }),
        incrementScore: assign((context) => {
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
          const nextLevelDiscIds: string[] = [];

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
              nextLevelDiscIds.push(discId);

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
            nextLevelDiscIds,
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
      CAN_DROP_DISC: (context, event) => {
        const canDropDisc: boolean = context.grid[1][event.column] === null;
        return canDropDisc;
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
