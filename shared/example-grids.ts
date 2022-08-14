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
  [null, null, 'disc-6', 'disc-3', null, null, null],
];

export const discMapTallColumn: DiscMap = {
  'disc-1': 7,
  'disc-2': 2,
  'disc-3': 3,
  'disc-4': 3,
  'disc-5': 5,
  'disc-6': 6,
  'disc-7': 7,
};
