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
  diffDiscIds: {
    addedIds: [],
    updatedIds: [],
    removedIds: [],
  },
};

export const drop7Machine =
  /** @xstate-layout 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 */
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

          // return {
          //   ...initialGameContext,
          //   grid,
          //   discMap,
          //   discCount: Object.keys(discMap).length,
          // };

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
          return {
            ...initialGameContext,
            moves: 2,
            grid: gridEndGame,
            discMap: discMapEndGame,
            discCount: 9,
            nextDisc: {
              id: 'disc-9',
              value: 6 as DiscValue,
            },
          };
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
          const grid = cloneGrid(context.grid);
          grid[0][event.column] = context.nextDisc.id;

          console.log('--- dropDisc', event.column, context.discMap, grid);

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
