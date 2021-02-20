import { DBConfig } from 'ngx-indexed-db';
import { migrationFactory } from './migrations';

export const dbConfig: DBConfig = {
  name: 'TheBestHourDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'hours',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'hour', keypath: 'hour', options: { unique: false } },
        { name: 'minutes', keypath: 'minutes', options: { unique: false } },
      ],
    },
  ],
  migrationFactory,
};
