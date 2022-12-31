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
  /** @xstate-layout N4IgpgJg5mDOIC5QQE4HsAOB2AdACzQFswBiAOQFEB1AfQHEBBAWQoG0AGAXUVAzVgCWAFwFoAdjxAAPRAEYALAGYc7AGxZ5qgEyqAHFl26AnFoA0IAJ5zVOfVnZHZqgKxHdq2YoMBfb+dSYuFAAhsQkFAAaAJIAKhzcSCB8giLikjIIWk427PKyzrqusrJGzs5Y5lYIALQluM6KhSUOLg5Gvv7o2DghxDiwYEIiYlDVAK4YJFKwQsFCYDjBAGbzKAAUzuzsAJQkAd29CwNDAiPjGPGSycKiEokZXs44nvKaRi4aikbyFZZy+Th5O8Sup5LoHEpnB0QPsgqEFgB3YI3M5LNAocYDFAkADKFAAMhQAMIxGhEgDy+IAqkwyJdEtdUndQBldJ4VF8tK5FKpFFosI5KnIDDgylouap5OwsAZdFp5NDYT14TgkSjRmiMWMsarkUISAAJckANQoACUyZSaXSuFd+Dc0vdEM4fjhVLzZFgsoZGg4hQg8rI3exFIoHOKFF7XoqunC+mrhhr0ZiwCh8GgAG6p06jADGaAANmNCGISPTePamelEPJxTgBWyXGVXHZ-WCcny+Q1FD8GlgY4FlX19hgc9UIAJYLmy7aGZXbtWELItk9dF4DG91yH-bJwSpnFpjI1D0Z2HKoX4YbGhwtcwWwMEUGPCHNc3hIOPJ7nYFMZnMFssqxrOCOx7Nehw4HeD5PmcL5CG+H4TlOsDlkk86OiycjsJ69bfE4Pzuqo7xGP67rKGGuT6I0Gj5AOBwqghuYANZjlAT4QL+szzIsKyphsWy7EqEGMSxZxsQIECoYyC5OkuobsLYWC7pouS8qeqg7tKgIuPKLrqCY4paHRca3u+zGsexnH-jxQGbKBQkMWZomjOJkmyAkFYpDJmFLqoDgcp6WAeAeeRYM4mm4JoIV6QKhmKMZN6QU5FkSVZ3GAXxdmCeBjlgOZYnsawWgeWhXkYdIcjfLgaiep6YI-BF2kNAoh4GFooaqAlwnJWc95ZgWaUAbx6xZWBg7dXlznVH1YAFlJ6HMhVckmG6SkNC6YYuEobZhs8XKuIZ5T6NGl4OX0IljjNA3TFxQ22QJY30edPWjFdrDuXaZWLRkniOG6dg6C4vLYb8VRgso9g9i47wNooF6dONuX5a9YD9YNNmZQ9Z2mZNl2o7NRUldJ5U-V8QbyrWRjUXK7DhX8CANLozxKTKmgRnKnWnTlfSnLmKBgMQYiJtN+MDfNX2Lrucq2B4iglPI5ScnTVTyvUfI6JTHPfF1Kq8-zgvC1dZYfXOEuybuzhBgrnqbMekJmPTctaM8wOvO4SlNAqXOI30wQQBOZxQY+H4AEbiNqM5Ewtks8kGXzAlgXzsFobi6P6-I2Aojg8tKXqlJ6Ot9GAYgQNUhzhNEcSzp5DrfYgWR+W6RE6G4QKGTuQUu7ytYyvkmheIXCx6wLxfC1O6KkOLteSyGTNy3Kuht7IquyG2-l5KelsK6CJi+JeYhoBAcCSLCn3T7Jmw4FT8qGVo2Hb2n9PVIeTzJ3k7iHkD4oJQQxBn1Wsk3BXz5LWQy99nB6H9LUfQOAvBrm+FkHsd8IGD3-t5JafIbANicM2FsMooFUyvvVVwegOp5E5gjJ6RxBjCwmGgkmiBHiAjvqUHQ4opTFDXqKFOUo-KL2wryeK3sqG6nVNUTUKYUD0LrggLw8hcKNlwW4fB9MshGHrJGDQJg2RyjcIPURwsJHalTAY6Ri4e5uiMInTwXpjBnkUP6OG8iShclKEgowJh2jCJMgYscRidQECzDBPMhZiyLWJjIg8CleQHlcHnOWq96YHiDAURWy53g-HlPokcY4kK5jMbJOU5EgQUVeLWKG-ogGtTslkL0BgnD6KDsE6ocEEKlzyfAU258fIwyvn5T0TRijSkflUDQ8jgoRkPGeHujSXpl3YgUnyy45aAmMGCEMu5N6OJ7PWJSDgQF6BhrM3GvVRaLKWgoXkopDBEUXms7C6cNBujBBAuw29Nhe0oT44eBs8b9XOT9bQuABS002IvIioZlaMOKDgfkmxXH5DsXDfRfsA55nvMHUuYcxDagBXIHkTwFb6BDB4dQ4IHZVHlrCn4HVCjHXfvo4updDh4syMUJmxQxlemXM1BxqiFawoFC6QyJRyj6J+aPMc49+asqsUGd0BgnZqBTn6JJJRrlfHsC6dwHi97eCAA */
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
