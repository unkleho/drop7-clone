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

// 3 chains
// 7 x 3
// 39 x 1
// 109 x 2
