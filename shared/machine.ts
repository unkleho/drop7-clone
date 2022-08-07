import { isContext } from 'vm';
import { assign, createMachine } from 'xstate';
import { addDiscToGrid, DiscMap, emptyGrid, getRandomDisc } from './drop7';

import type { Grid } from './grid';

export const drop7Machine =
  /** @xstate-layout N4IgpgJg5mDOIC5QQE4HsAOB2AdACzQFswBiAOQFEB1AfQHEBBAWQsVAzVgEsAXLtAHZsQAD0QBGAGwAWHAGYs0uQE4ArHIBMk8VqUAaEAE9EcyQA4cABkkbVdreOmSsWSQF83B1JlxQAhsQ4sGA8fAJQALQArhgkwhzcfILCYgiqWBo4ZuJmZpLq1tLpBsYICriScpaqyuJyquLVGsrSHl7o2Dj+gQDufrxc4REAZmgo0cEoJADKFAAyFADCACo0iwDycwCqTGTxnAPJSKKIZpo4juJ1StJOuSUmqhaV1oV5Ncpmqm0g3p3dYBwfwwg0iEC4sAAxnFjglDkJjqkri0cLdpI4zBpLHJpGZLGYHmUsBY6tZHNJlHI8eYfn9fAFAZCADZgPwoUERQh+HiQvCQCLgqGwGHsA5JBGgVJPWRyHS42zKSQyWqEpS4Swa6pqjVKcS0jr0wKQtBMpl+DDcIaCyHC-aJfgSk4IHRYnAZSlYFrKFziRSq1SSHCqTUufGWT1mZT6nxdBk4XlgSEAaw5UHZEBFIDh4pSEikqhwWMsdw0Vy+0kJAYsRUklg09acwZy0f+cYTyY5LIAbmAmZnsw7c866hZcpYdFIihk64Scrg8ZHx9ZVEWNC3DYDBpCUGBiAIwpFu73+2LB4iJHYC4rLJTizJa3I5KrlMo3VhZfU8hpcV917HAn4EDgkMzKsjuEARAARoIUS2rCp5HJKEiuK+0juiutbWMSFZGIgLiBnkyjWNklKaJof4AjgYACBBAIkBQAAaACSyx2vCQ6OLg0rjkUariLUqiElg6TyDiUiKDepb1hRDL0cxrHwfaiFOqosjCdUMhKJUVLUoSSqBlg4bmOO6QkR4nggAIaAQHAwh0vgRBgGxObnggGSFnWVLfukdbvoSCiBqZ+SKMJj55DJgTBKEHIxM5Z5IUS4iosJMjjg247iP57mkph3pmEov4WfZlF9AMQyjOMsFgCgcXKak5gFnkGT1OOeWYoSGhfFk+K5C4OLelSrRFQa-6AsCHLWrVjpIsWmSdcJvp2I4MgErhRKZDl+KSMoWiRmYEWMiybIclyPJ8hB1rwIp7GuaYmTOIq+T5Jo0jYpI-pJZqdYUi0vrolgB3xiaZoWhNEI2lNHHYrI+X1uINR1KSglrUUlhBiGOieuY-HfMNMaUe2KZDGmXAQJDrl1M4ViKDYjhqJUUjPnIb4fhq2gKFIgOE52YA9ky5MJZOzyRi+ShVlgOh6S4hbbS+WjYgo2KA1uO57geERHvz10uYL20khkjQaBkTifKtpR3IW76cWcwbLgDeOtgBQEcqBbL8tBAiwQLTqOCJwkS7kL0-e9a2hqiAbFq4GTONIa4OxuVE0REALe6kZxJWhso6LKz3mEJNSFvDpY3uYpFx+0+MMqnJhUjgD1KgG6jfm9s7w91i43v9GTl78BrV2UaPqQGtymGFuko8zC5EfiOQ4v95luEAA */
  createMachine(
    {
      context: { score: 0, level: 1, grid: [], discMap: {}, moves: 30 },
      tsTypes: {} as import('./machine.typegen').Typegen0,
      schema: {
        context: {} as {
          score: number;
          level: number;
          grid: Grid;
          discMap: DiscMap;
          moves: number;
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
          initial: 'setting-up',
          entry: 'setupGrid',
          states: {
            'setting-up': {
              always: {
                target: 'waiting-for-user',
              },
            },
            'waiting-for-user': {
              on: {
                SELECT_COLUMN: {
                  actions: 'dropDisc',
                  target: 'dropping-disc',
                },
              },
            },
            'dropping-disc': {
              always: {
                target: 'checking-grid',
              },
            },
            'clearing-matched-discs': {
              always: {
                actions: 'incrementScore',
                target: 'collapsing-discs',
              },
            },
            'collapsing-discs': {
              always: {
                target: 'checking-grid',
              },
            },
            'checking-grid': {
              always: [
                {
                  cond: 'NO_DISC_MATCHES',
                  target: 'checking-level',
                },
                {
                  cond: 'DISC_MATCHES',
                  target: 'clearing-matched-discs',
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
        dropDisc: assign((context, event) => {
          const discTotal = Object.keys(context.discMap).length;
          const discId = 'disc-' + discTotal;

          return {
            grid: addDiscToGrid(context.grid, event.column, discId),
            discMap: {
              ...context.discMap,
              [discId]: getRandomDisc(),
            },
            moves: context.moves - 1,
          };
        }),
        incrementScore: assign({
          score: (context, event) => {
            console.log('incrementScore', context);

            return context.score + 10;
          },
        }),
        incrementLevel: assign({
          level: (context, event) => {
            console.log('incrementLevel', context);

            return context.level + 1;
          },
        }),
        consoleLogValue: (context, event) => {
          // Wow! event is typed to { type: 'FOO' }
          console.log(event);
          // raise('START_GAME');
        },
      },
    }
  ).withConfig({
    actions: {},
    guards: {
      NO_DISC_MATCHES: (context) => {
        console.log('NO_DISC_MATCHES', context.grid);

        return true;
      },
      DISC_MATCHES: () => {
        console.log('DISC_MATCHES');
        return false;
      },
      GRID_CLEARED: () => {
        return true;
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
