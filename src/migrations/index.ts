import * as migration_20260816_150919 from './20260816_150919';
import * as migration_20260820_113350 from './20260820_113350';
import * as migration_20260825_061538 from './20260825_061538';

export const migrations = [
  {
    up: migration_20260816_150919.up,
    down: migration_20260816_150919.down,
    name: '20260816_150919',
  },
  {
    up: migration_20260820_113350.up,
    down: migration_20260820_113350.down,
    name: '20260820_113350',
  },
  {
    up: migration_20260825_061538.up,
    down: migration_20260825_061538.down,
    name: '20260825_061538'
  },
];
