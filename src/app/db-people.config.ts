import { DBConfig } from "ngx-indexed-db";

export const dbConfig: DBConfig = {
  name: 'PeopleDB',
  version: 1,
  objectStoresMeta: [{
    store: 'people',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'name', keypath: 'name', options: { unique: true } },
      { name: 'email', keypath: 'email', options: { unique: true } },
    ]
  }]
}