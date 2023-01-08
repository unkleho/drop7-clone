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

function getHighScore() {
  if (typeof window === 'undefined') {
    return 0;
  }

  const highScoreString = localStorage.getItem('highScore');
  const highScore = highScoreString !== null ? parseInt(highScoreString) : 0;

  return highScore;
}

function setHighScore(score: number) {
  localStorage.setItem('highScore', score.toString());
}

const highScore = getHighScore();

// export const initialMovesPerLevel = 29; // Original game
export const initialMovesPerLevel = 20;
const initialGameContext = {
  score: 0,
  highScore,
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
  /** @xstate-layout N4IgpgJg5mDOIC5QQE4HsAOB2AdACzQFswBiAOQFEB1AfQHEBBAWQoG0AGAXUVAzVgCWAFwFoAdjxAAPRAEYALAGYc7AGxZ5qgEyqAHFl26AnFoA0IAJ5zVOfVnZHZqgKxHdq2YoMBfb+dSYuFAAhsQkFAAaAJIAKhzcSCB8giLikjIIWk427PKyzrqusrJGzs5Y5lYIALQluM6KhSUOLg5Gvv7o2DghxDiwYEIiYlDVAK4YJFKwQsFCYDjBAGbzKAAUzuzsAJQkAd29CwNDAiPjGPGSycKiEokZXs44nvKaRi4aikbyFZZy+Th5O8Sup5LoHEpnB0QPsgqEFgB3YI3M5LNAocYDFAkADKFAAMhQAMIxGhEgDy+IAqkwyJdEtdUndQBlnFpdDhFOxFGV5Dp2M4wUZKohHDgsAosOz3sZDOwsNDYT14TgkSjRmiMWMsarkUISAAJckANQoACUyZSaXSuFd+Dc0vdEILcKpVIpZFLZIZGg4RQg8rIcKpuVyTFkflpXoqunC+mrhhr0ZiwCh8GgAG6p06jADGaAANmNCGISPTePamelEHytOK3E4ymU3FhflUwTlFFouw1FD8Ggq-DDY8q+vsMDnqhABLBc2XbQzK7dqwh9Moux7ZLlVHygW25GL+Q5u4VXFgvDHAqOFrmC2BgihJ4Q5rm8JApzPc7ApjM5gtlqsazgjsewjocOC3vej5nM+Qivu+06zrA5ZJEujosnIApPK8xiuK8npuvI-rlEGqiOF2SjvEY3K6JeBwqvBuYANaTlAj4QD+szzIsKypmsW5bLsSrgYxLFnGxAgQChjLLk6CBbmKDiCnkWBlIUuhmH88kAkCHjvBo4LfIoih0XGN5vsxrHsZxf48YBAkgcJDEWWJowSVJsgJBWKSyRh8leOwwbdp4WhGBoUZ6P6xQ5FkXiel27iKB4pnXhBLlWZJNncQBfEOUJYHOWAlniexrBaF5qE+eh0hyM2ODvOy7rfOe3pRWRwbulsBgRbkziqClInpWcd5ZgWWX-rx6ybI5BV9KJk4jWABbSWhzI1f5Hi2AKkLfOwWQmMRhTPN2jiaHy4L5ANhXFaMi1jdMXETYB035Veg1Fa51R3awnl2lVa0ZJ4Ia2Fk2gSi47huv67ocvYno+roQJhf1Q5OXNQ23WAo3jXZfEvaBb3XZ933lX9DoA3ISWBV4uglEodj7ggZHKJ6Wxhdyjj6VdfSnLmKBgMQYiJl9WNLfOFUydVgPUfIwa0yY7rOJ4Sv+hFnI6KpHjdrFBTcwsvP84Lwt3WWv2Lv9K7xbgxj5OwdQeLp-rGbge0BWCrylOCUKo7N-4QNOZyQQ+74AEbiNqOM5eseUE-RfTBP7k5B-zEDVGHYjaitFtybIWgCpyiN9W4iPFBKqvvJyZTsLKXjyHbO56zgYBiKnhzhNEcQLt55Mrlk+e6El57aDyWgq1pxTKN8isupsRgmLIjcGwLzfC7O6KkFnPdyRpuB8luPw8qprayE7UrBl8Oi5-IgquDyvhDmIaAQHAkiwmTVZyZs9UUVov95wofVdD+mqOyJ4e08j6ERntLYJkfZXgIMQd+vl1puG-lGP+-9r6RS0rUfQnIDBfD3n2POfU9ZIKlogLsNgsANhcE2FsjNqhGEnu7Vw3w3Ahmro3Y4wsJjkIpggR4gI86lB0L-OuxR-R1xwGyXaIYoFOGMo3BMk5NQphQPwlctd6y0zoc2OwqsSjiklKFMM0Vr7KL1Ko5M2pUy6mEJouSfJXRhQ9F4aU1dFBO0FM8EwrgGh8jnqFSx6pqhqNsWmAgWZoJ5kLMWNaksBFskCorUeYVTGSK0myIMBRygehaJGeQjdxyTkQrmRxfl9B1gaO4dBHtQqM2KLLZJGhexsleLkRuycnwvjfKnMp8BzZbz8tFQKuQdAXTeEoKRrwZHX3sEXbQTgukY2qO5Cp60twekBMYME3JvTUWcE7Ps4oJQOAonoLmcC47mQ+gtUWBYNmAzrkYZ4EiPTnmvvKVWGhgxgkAa2LBmwinXLMjgJeRt7mjSeXIAwry3RfEMkrBQ3wZnNKwdfYyzCkplEbgnAOeY7zB1TunbUMLtLdnPvoZhNCyjniiiYDqwU1Bzz2m6RuzdW7wnJXnWmKg64aDUHkLBqslA7PdKpEEfIlGgtShClek41783JcwwKgZ5FKzzqPIiWklA5NnrnI+bg773yAA */
  createMachine(
    {
      context: initialGameContext,
      tsTypes: {} as import('./machine.typegen').Typegen0,
      schema: {
        context: {} as {
          grid: Grid;
          score: number;
          highScore: number;
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
                '1000': [
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
              entry: 'addClearedBonus',
              after: {
                '1000': {
                  target: 'checking-level',
                },
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
          const currentScore = getScore(
            context.matchedDiscIds.length,
            context.currentChain
          );
          const score = context.score + currentScore;
          const highScore = getHighScore();

          if (score > highScore) {
            setHighScore(score);
          }

          console.log(
            'incrementScore',
            context.matchedDiscIds.length,
            context.currentChain,
            getHighScore()
          );

          return {
            score,
            ...(score > highScore ? { highScore: getHighScore() } : {}),
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
        addClearedBonus: assign((context) => {
          console.log('addClearedBonus', context.score);

          return {
            score: context.score + 70000,
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
      GRID_CLEARED: (context) => {
        const grid = context.grid;
        let gridCleared = true;

        loop: for (const row of grid) {
          for (const cell of row) {
            if (cell) {
              gridCleared = false;
              break loop;
            }
          }
        }

        if (gridCleared) {
          console.log('GRID_CLEARED', gridCleared);
        }

        return gridCleared;
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
