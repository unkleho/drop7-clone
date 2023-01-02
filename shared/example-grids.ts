import { DiscMap } from './drop7';
import { Grid } from './grid';

export const gridTallColumn: Grid = [
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, 'disc-4', null, null, null],
  [null, 'disc-1', 'disc-6', 'disc-3', null, null, null],
];

export const discMapTallColumn: DiscMap = {
  'disc-1': 'cracked',
  'disc-2': 2,
  'disc-3': 3,
  'disc-4': 3,
  'disc-5': 5,
  'disc-6': 6,
  'disc-7': 7,
};

export const gridAllClear: Grid = [
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, 'disc-1', 'disc-2', 'disc-3', 'disc-4', 'disc-5', null],
];

export const discMapAllClear: DiscMap = {
  'disc-1': 6,
  'disc-2': 2,
  'disc-3': 2,
  'disc-4': 3,
  'disc-5': 6,
  'disc-6': 6,
};

export const gridEndGame: Grid = [
  [null, null, null, null, null, null, null],
  [null, 'disc-7', null, null, null, null, null],
  [null, 'disc-6', null, null, null, null, null],
  [null, 'disc-5', null, null, null, null, null],
  [null, 'disc-4', null, null, null, null, null],
  [null, 'disc-3', null, null, null, null, null],
  [null, 'disc-2', null, null, null, null, null],
  [null, 'disc-1', null, null, null, null, null],
];

export const discMapEndGame: DiscMap = {
  'disc-1': 6,
  'disc-2': 2,
  'disc-3': 2,
  'disc-4': 3,
  'disc-5': 6,
  'disc-6': 6,
  'disc-7': 2,
};

// 3 chains
// 7 x 3
// 39 x 1
// 109 x 2
