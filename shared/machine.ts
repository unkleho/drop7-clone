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

export const drop7Machine =
  /** @xstate-layout N4IgpgJg5mDOIC5QQE4HsAOB2AdACzQFswBiAOQFEB1AfQHEBBAWQsVAzVgEsAXLtAHZsQAD0QBGAGwAWHAGYs0uQE4ArHIBMk8VqUAaEAE9EcyQA4cABkkbVdreOmSsWSQF83B1JlxQAhsQ4sGA8fAJQALQArhgkwhzcfILCYgiqWBo4ZuJmZpLq1tLpBsYICriScpaqyuJyquLVGsrSHl7o2Dj+gQDufrxc4REAZmgo0cEoJADKFAAyFADCACo0iwDycwCqTGTxnAPJSKKIWGa49cpm1tc6lZIliNI6OC3Syhrn6ZZYdaptIG8nW6YBwQIwg0iEC4sAAxiQRLAeH4eKC-MNUSgABRVSwAShIQN8AVB4MhEWhcP2iX4QmOqTuyhw90qeSKGkcZkeCB0lleykslmyGlc4hycgBRK6JJwGHQsLg3CGhBRsLwkApMNhsARSJRaIxYGxqkFBKlINl8sV5JVPDVGsp2uphzpoFSLSZnzkKneChN0m5Jr5YukXssVwy4klHWJgXtsIA1uSoCguBBdcjUTh0ZisUGzTHpXH1Ynk6mIM6kq6TjypKocBpBU4zBycqoA0ZEKpzDgipJLBpB04TTloz4i6D40mhgAbMAANzAM7ixwSLpSiDMclkjd+byujVUXM7PLkrxFTne-YPW6wY+BMsGsJQYGIAjCkTni+XldpG55dj1so15VJe-bety7xMi4ch-HkGjSLk-yeIChYWn4EDQkMsJzn4L4QBEABGghRDqv5HG6EiuEy0gZGoWiCs4ZgdqULiSFkkgCuY4jKN6GiaPesagmAAgESCJAUAAGgAkss5HVgytE4Ee0iWI47YKDx4iqNyWDpPI25SIo4YcoOgkThJMlyauBxVv+7Y4Hp1QyEolRyLk1jcpI3mOT85hqek2TKB4KECGgEBwMIUoEMQ8n-hkDYDu5CHfCKcjcgo7GBfkih6d6eTmRawShOSMRxfSJi-L2ekyGpQ5qeIGUJXU1iCsoZxKGYyHtOOFp9AMQyjOMpFGuVlEIOY9Z5Bk9Rqe1uQaNynxTUKuQwe8WDua0KHmjKZJDI6Y01o0oYNl84h6Q0l7HqUCiZC1-Z5B85hXIVMpymgCqwEqkS2vaBGOvANk0hRNamJkzjAfk+SaKppiQQ0ViCgOUHPIoF1vcWYClkMKZpkdDKmLgPxOBy7zdrBDwnr6jmbS11h1L87g7WhMpTuSX5LgTEgyBYL3KC09TmL8i0ns4uBaALz2WN6WAy5joJPi+b4fhEnMztzPKcRYF0cgOGROFcN1PD2aWOGcs3WOkCvZph5I4WAeEasRAikZr6m4Hpvy5LDUFU6xcu9t2li0c4WiKBoNsiWJJKa1u4jVbBOiU+o5i6TUDbaXrwFmLxAks71sfA+uFVlO5zJYFD3bqAhMv+4gESNEyPy2N60iIS4HLdahPia1Ujkmt27emPl1z1wgjfZFYGTqLBQqCg0EohUAA */
  createMachine(
    {
      context: {
        score: 0,
        level: 1,
        grid: [],
        discMap: {},
        nextDisc: null,
        moves: 30,
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
              on: {
                SELECT_COLUMN: {
                  actions: 'dropDisc',
                  target: 'dropping-disc',
                },
              },
            },
            'dropping-disc': {
              after: {
                '300': {
                  actions: 'collapseDiscs',
                  target: 'checking-grid',
                },
              },
            },
            'processing-matched-discs': {
              entry: ['incrementScore', 'clearMatchedDiscs'],
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

          return {
            nextDisc: {
              id: discId,
              value: discValue,
            },
            discMap: {
              ...context.discMap,
              [discId]: discValue,
            },
            discCount: context.discCount + 1,
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
          console.log('incrementLevel');

          return {
            level: context.level + 1,
            moves: 30,
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
