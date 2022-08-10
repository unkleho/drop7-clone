import { isContext } from 'vm';
import { assign, createMachine } from 'xstate';
import {
  addDiscToGrid,
  crackAdjacentDiscs,
  Disc,
  DiscMap,
  emptyGrid,
  getMatchingGroups,
  getRandomDisc,
} from './drop7';

import { cloneGrid, collapseGrid, Grid, removeByIds } from './grid';

const movesPerLevel = 5;

export const drop7Machine =
  /** @xstate-layout N4IgpgJg5mDOIC5QQE4HsAOB2AdACzQFswBiAOQFEB1AfQHEBBAWQsVAzVgEsAXLtAHZsQAD0QBGAGwAWHAGYs0uQE4ArHIBMk8VqUAaEAE9EcyQA4cABkkbVdreOmSsWSQF83B1JlxQAhsQ4sGA8fAJQALQArhgkwhzcfILCYgiqWBo4ZuJmZpLq1tLpBsYICriScpaqyuJyquLVGsrSHl7o2Dj+gQDufrxc4REAZmgo0cEoOH28JAASAPIAahQASjQAwgsAMgCqTGTxnAPJSKKIZpYWdVjirmbS0srKluIliBri4jg1L2bP0iwckacjMbRA3k63TA036YUio3GUUm+DQADcwChBpEAMZoAA2UUIAjiZwSJyEZ1SGVkimyGlyeSccjk7wQtjkOCwZhUzVUGkBlXcnghHV8ARhM3hIzGE0xJAAyhRthQNgAVTY7faHMnHJKU0DUsy4erKS7mV5aUxs6Q6HAtJ4MrDpSy3ergyHiwKQjDYiIQLiwHEkESwHh+HgwvzDSMoAAUjUsAEoSJ6uhKcD6-QGg0dEvwDecEDpbFyNJZLICzZJJGazGz6hZKtVlLY7opxHYPWL04EMOgcXBuENCBGcXhIP7AzjYCGwxGozHMXHk6me9CcP20IPYMPIqOeOPJzmZ3mKSlEDJJPIpICMp3NDY2fzOf8WbVW5YWZpuz5ezCcXxMA-CxEcxwnCApyDWdQ3DSMcGjWM41UCsUzTDdAOA0D93A49p3gXV81OQ0JB0TlVGkS4v3MVRJGsesjEQZkrArSwNFsf5Pko1oRXQjMjxxABrP0oCxCA5zgxckJQ1c+MCAThKGUSuAgM99QvYspFUHBy0rcxPhyCjn3MHAijo9iBXyV4wV49d+InIS-SAjF8VJdg9QLDSvjNLIpDMFCBUsVtHgbSwsmcDRFHML5qiCmz2j-DdBhxFAwGIARpWcsBXLUzyqQkOxtOUOjlCqJwnC-VlGIQJ5lC5IE6lUPIBVyVRfyhDM-AgAMhkwkDJwAI0EZE3JAcl1Py4tXDqwE+S0CtnAeNkXGvPIXmi0rNB-WzEozMABEg6ESAoAANABJNVcuIotHFwJrpFeIolFuWpVGW9J5DkW1nAe1sS3ar1SFOi6rsLVIKK5FDaMeUwWVyaw2Rra8sFdC1O25cRlA8EUBDQCA4GENMCGIUGNIyHS2NBAUXUiqrSgUa90jydJAXUUFhQSjrAmCUI-RiUnJoUb5WZkS1Aq+BtybqawK2UbklH8gH-1hAYhkROUpilAWSIQDJcErB6tDZ1trWqqQ7tlvX8kx9isCVjcpT9dXkUxVEMWwiI8UJYltaLMwNE5cxiudO5GiKNlmgqS4KKs2t1HEe2M0dtXZRdlBfepCsuUonRGSvFkbVkGS600SsvgFRPvQ6X0hhPDOJErTInQaZ0GnKhj6alqo6LWrR-ni0Vdr7Achz9A8j0gk8CPcoiwZMGwcGcYr8nyTQHtN0oim+Vi2Nq20OztnauYAoCQLH3DJ-w+uEH9sLKgyTRLnN11n3LHApAFbk+VtHlK4AhzFKRGUqpQi55Jp1GcFYKKXE1CVCkDaUq9VgRVGsDcKQf8cAKScmAFy19bxNn+ACeo5hbgaERi4HStZnjzRZCjOQGDkqpXSplHB2U8G1muPeNiNIOEdyYiZWmt0eQyXyIfTmgMELdT9H1VKkEhoCGRHgoouBnS3FyGvWqkhloo1MrRSsrgMg-Q0Bg-ah0JTXx5MLBqZEtKmD4brGoOlOyfCCkHFkxij6A2vnDReWBl60XUIFDeiAIitnfpoNRLIUI1krADbxYVnTVBkEoSooJzRsgiLecJkU7gMhrJjK42M3BAA */
  createMachine(
    {
      context: {
        score: 0,
        level: 1,
        grid: [],
        discMap: {},
        nextDisc: null,
        moves: movesPerLevel,
        discCount: 0,
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
              after: {
                '100': {
                  actions: 'collapseDiscs',
                  target: 'checking-grid',
                },
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
                '500': {
                  actions: 'collapseDiscs',
                  target: 'checking-grid',
                },
              },
            },
            'checking-grid': {
              after: {
                '500': [
                  {
                    cond: 'NO_DISC_MATCHES',
                    target: 'checking-level',
                  },
                  {
                    cond: 'DISC_MATCHES',
                    target: 'processing-matched-discs',
                  },
                  {
                    cond: 'GRID_CLEARED',
                    target: 'adding-cleared-bonus',
                  },
                  {
                    cond: 'GRID_OVER',
                    target: 'end-game',
                  },
                ],
              },
            },
            'checking-level': {
              always: [
                {
                  cond: 'NO_MOVES_LEFT_IN_LEVEL',
                  target: 'incrementing-level',
                },
                {
                  cond: 'MOVES_LEFT_IN_LEVEL',
                  target: 'waiting-for-user',
                },
              ],
            },
            'incrementing-level': {
              entry: 'incrementLevel',
              always: {
                target: 'checking-grid',
              },
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
        setupGrid: assign({
          grid: (context) => {
            return emptyGrid;
          },
        }),
        getRandomDisc: assign((context) => {
          const discId = 'disc-' + context.discCount;
          // TODO: Rename type and function to DiscValue?
          const discValue = getRandomDisc();
          const grid = cloneGrid(context.grid);
          grid[0][3] = discId;

          return {
            nextDisc: {
              id: discId,
              value: discValue,
              // value: 1,
            },
            discMap: {
              ...context.discMap,
              [discId]: discValue,
              // [discId]: 1,
            },
            discCount: context.discCount + 1,
            grid,
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
        incrementScore: assign({
          score: (context, event) => {
            const matchedIds = getMatchingGroups(context.grid, context.discMap);
            console.log('incrementScore', matchedIds);

            // TODO: Keep track of chains and increase multiplier
            const score = matchedIds.length * 7;

            return context.score + score;
          },
        }),
        incrementLevel: assign((context, event) => {
          const grid = cloneGrid(context.grid);
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
            level: context.level + 1,
            moves: movesPerLevel,
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
      GRID_CLEARED: () => {
        return false;
      },
      GRID_OVER: () => {
        return true;
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
