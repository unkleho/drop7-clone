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
} from './drop7';
import { discMapTallColumn, gridTallColumn } from './example-grids';

import { cloneGrid, collapseGrid, Grid, removeByIds } from './grid';

const initialMovesPerLevel = 29;

export const drop7Machine =
  /** @xstate-layout N4IgpgJg5mDOIC5QQE4HsAOB2AdACzQFswBiAOQFEB1AfQHEBBAWQsVAzVgEsAXLtAHZsQAD0QBGAGwAWHAGYs0uQE4ArHIBMk8VqUAaEAE9EcyQA4cABkkbVdreOmSsWSQF83B1JlxQAhsQ4sGA8fAJQALQArhgkwhzcfILCYgiqWBo4ZuJmZpLq1tLpBsYICriScpaqyuJyquLVGsrSHl7o2Dj+gQDufrxc4REAZmgo0cEoOH28JAASAPIAahQASjQAwgsAMgCqTGTxnAPJSKKIZpYWdVjirmbS0srKluIliBri4jg1L2bP0iwckacjMbRA3k63TA036YUio3GUUm+DQADcwChBpEAMZoAA2UUIAjiZwSJyEZ1SGVkimyGlyeSccjk7wQtjkOCwZhUzVUGkBlXcnghHV8ARhM3hIzGE0xJAAyhRthQNgAVTY7faHMnHJKU0DUsy4erKS7mV5aUxs6Q6HAtJ4MrDpSy3ergyHiwKQjDYiIQLiwHGk9h6-gG84IHQaXDVf5qcR2Ow2NnNb6SK45M2grRAj1iroSnAYdA4uDcIaEPw8HF4SD+wM42AkESwHjVmF+YY8TEACksAEoSJ7C4ES2gy7AK5EqzW6xAG0H4LrEuGUogZJJ5FJARlE5oU0ZEPzOf8WbVlBpLCzNPmfKOYTj8WA-FjK9Xa-WA0uW22Ozgux7FBe0uQdhwLaEcCfF83xnD950XJsjlXU5DQkRpVBwaR4xeVRbVebQbTkWRE2UFlnXUMxbGFdp70gz8cQAaz9KAsQgX92x7ADuz7VRLDAkd6LrJiWLY5CKXXKNE0ydQpAzZ41DZOxvmdZxLEBPCrnUO8oSLBjmKGZ8MXxDj-0A3j+KHQS9OEgzIiMsB8XE-VJOk2QrhscQ1HUUwdDZFQfkvRMnBBLRtJFazAkGHEUDAYgBGlByTOctcqQkbRvkaaQNAFZxjUsZQbW5QLsKcY1nS0DQdK9TsIADIZoNfesACNBGREMQHJFy0qjHkZJZS41C0PIZDZbJMMeRRlP5BotGqh8cDAAQF2hEgKAADQASTVFLUMjRxcFUB5XiKJRblqVQ2WdE1iKkRQCs+HL5tWjbtt2iNUjwrk+NUGQlEqUFzTZSQQa5V0LUTbkvI8EUBDQCA4GEEcCGId7JIyHArw0HMiiwSwY1ZI8ylcH5uXyRRnQGmjRTootglCP0YjRnqFG+DSZEtAVXjeImFEyOprH45RuSUMxVGeospT9RE5SmKVmbQhAMljR58fyc9sckNk7p+IXlfyLycqwCXejhaXZWRTFUQxWCIjxQliQVyMqM5cxlGcBpbnUy6ieaCpLjw-JrDUYETclM2hhly2UCd6l+K5bCdEZTcWRtWQ+IKvHnm5PJsjDnAfT9b8cVjiR1JkrBhYTb3sLMVNhZwL5K8kd2AecOaIogotx0nacIlnT8F2L5dQxQj6TBsHBnFb371C560iaKb5+P4gUATuW1jc72nAka22B4Q4fS4QKjLCnvnNEuO7XSUq9G5sQEqLUW0eXz-TRK4CBj7qQEsN+x+pAvF5EVGSLQxb5H5C4LetFdK71sn6JK39NL2jwl8B4e4VDA3dlhbIwJbhAhkLebesCYTRVivFRKYBjJINyFPGwYt+SNFcMLfyBUsgi1NBndSyh85+Dqn6PeLU2oj06mGPaqRHAZisKpDMYUxaPDGmwyaRRgSaCBNhfOS0VoSm-i0M+OQiiVBjF7BkwNHB-xqAoEGPIdDiDDsfAaU9m75HVvPLWRMIg8iwq6dBiYW7cjItVBxZ9nTVD+qYAaQMPGJgmj4jS9RzAZBhm4IAA */
  createMachine(
    {
      context: {
        score: 0,
        level: 1,
        grid: emptyGrid,
        discMap: {},
        nextDisc: null,
        moves: initialMovesPerLevel,
        discCount: 0,
        currentChain: 0,
      },
      tsTypes: {} as import('./machine.typegen').Typegen0,
      schema: {
        context: {} as {
          score: number;
          level: number;
          grid: Grid;
          discMap: DiscMap;
          nextDisc: { value: Disc; id: string } | null;
          moves: number;
          discCount: number;
          currentChain: number;
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
          entry: 'setupGrid',
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
            'processing-matched-discs': {
              entry: 'incrementScore',
              after: {
                '0': {
                  target: 'clearing-matched-discs',
                },
              },
            },
            'clearing-matched-discs': {
              exit: 'clearMatchedDiscs',
              after: {
                '800': {
                  actions: 'collapseDiscs',
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
                    target: 'processing-matched-discs',
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
        setupGrid: assign((context) => {
          let grid = cloneGrid(emptyGrid);
          let discMap = {};
          const discCount = 10;

          [...new Array(discCount)].forEach((_, i) => {
            const discValue = getRandomDisc();
            const discId = 'disc-' + i;
            const column = Math.floor(Math.random() * 7);

            discMap = {
              ...discMap,
              [discId]: discValue,
            };
            grid = addDiscToGrid(grid, column, discId);
          });

          return {
            grid,
            discMap,
            discCount,
          };

          // TODO: Turn this into a tutorial
          // return {
          //   grid: gridTallColumn,
          //   discMap: discMapTallColumn,
          //   discCount: 8,
          //   nextDisc: {
          //     id: 'disc-8',
          //     value: 2,
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

          // const grid = addDiscToGrid(
          //   context.grid,
          //   event.column,
          //   context.nextDisc.id
          // );

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
          const matchedIds = getMatchingGroups(context.grid, context.discMap);

          // Crack or destroy adjacent discs
          const [crackedGrid, discMap] = crackAdjacentDiscs(
            context.grid,
            context.discMap,
            matchedIds
          );

          // Clear grid of matched ids
          const clearedGrid = removeByIds(crackedGrid, matchedIds);

          console.log('clearMatchedDiscs', clearedGrid, matchedIds);

          return {
            grid: clearedGrid,
            discMap,
          };
        }),
        collapseDiscs: assign((context) => {
          console.log('collapseDiscs', context.grid);

          return {
            grid: collapseGrid(context.grid),
          };
        }),
        incrementScore: assign((context) => {
          const matchedIds = getMatchingGroups(context.grid, context.discMap);
          const currentChain = context.currentChain + 1;

          const score = getScore(matchedIds.length, currentChain);
          console.log('incrementScore', matchedIds.length, currentChain);

          return {
            score: context.score + score,
            currentChain,
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
