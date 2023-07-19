import {DB_NAME, DB_VERSION, STORES_CONFIG} from "../db.config";

let DB: IDBDatabase | null = null;

export type ObjectStoreIndex = {
  name: string;
  unique?: boolean;
};
export type ObjectStore = {
  name: string;
  config: {autoIncrement: boolean};
  indexes?: ObjectStoreIndex[];
};

export type IndexQuery = {
  indexName: string;
  keyRange?: IDBKeyRange;
};

/**
 * initialize.
 * @returns {Promise<IDBDatabase>}
 */
export function initialize(
  dbName: string,
  dbVersion: number,
  oStores: Array<ObjectStore>,
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, dbVersion);
    request.onerror = () => {
      reject(request.error);
    };
    request.onupgradeneeded = () => {
      const db = request.result;
      oStores.forEach((os) => {
        let store: IDBObjectStore | undefined;
        if (!db.objectStoreNames.contains(os.name)) {
          store = db.createObjectStore(os.name, os.config);
        } else if (request.transaction) {
          store = request.transaction.objectStore(os.name);
        }
        if (os.indexes) {
          os.indexes.forEach((index) => {
            const {name, unique} = index;
            if (store && !store.indexNames.contains(name)) {
              store.createIndex(name, name, {unique});
            }
          });
        }
      });
    };
    request.onsuccess = () => {
      const db = request.result;
      resolve(db);
    };
  });
}

/**
 * getDB
 * @returns {Promise<IDBDatabase>}
 */
export async function getDB() {
  if (!DB) {
    DB = await initialize(DB_NAME, DB_VERSION, STORES_CONFIG);
  }
  return DB;
}

/**
 * Count
 * @param {IDBDatabase} db
 * @param {string} objectStoreName
 * @returns {Promise<number>}
 */
export function count(db: IDBDatabase, objectStoreName: string) {
  const transaction = db.transaction([objectStoreName], "readonly");
  const objectStore = transaction.objectStore(objectStoreName);
  const request = objectStore.count();
  return new Promise((resolve) => {
    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

/**
 * clear.
 * @param {IDBDatabase} db
 * @param {string} objectStoreName
 */
export function clear(db: IDBDatabase, objectStoreName: string) {
  const transaction = db.transaction([objectStoreName], "readwrite");
  const objectStore = transaction.objectStore(objectStoreName);
  const request = objectStore.clear();
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.result);
    };
  });
}

/**
 * query.
 * @param {IDBDatabase} db
 * @param {string} objectStoreName
 * @param {IndexQuery} query
 */
export function query<T>(
  db: IDBDatabase,
  objectStoreName: string,
  query?: IndexQuery,
): Promise<Array<T>> {
  const transaction = db.transaction([objectStoreName], "readonly");
  const objectStore = transaction.objectStore(objectStoreName);
  let request: IDBRequest;
  if (query) {
    const {indexName, keyRange} = query;
    const index = objectStore.index(indexName);
    request = index.getAll(keyRange);
  } else {
    request = objectStore.getAll();
  }
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * insertMany.
 *
 * @param {IDBDatabase} db
 * @param {string} objectStoreName
 * @param {Array} data
 */
export async function insertMany(
  db: IDBDatabase,
  objectStoreName: string,
  data: Array<any>,
) {
  const transaction = db.transaction([objectStoreName], "readwrite");
  const objectStore = transaction.objectStore(objectStoreName);
  const objectStoreConfig = STORES_CONFIG.find(
    (config) => config.name === objectStoreName,
  );
  data.forEach((item) => {
    objectStore.put(item);
  });
  return new Promise((resolve, reject) => {
    transaction.oncomplete = (event) => {
      resolve(event);
    };
    transaction.onerror = () => {
      reject(transaction.error);
    };
  });
}

/**
 * getMinimalValueByField.
 *
 * @param {IDBDatabase} db
 * @param {string} objectStoreName
 * @param {string} key
 * @returns {Promise<any>}
 */
export async function getMinimalValueByField(
  db: IDBDatabase,
  objectStoreName: string,
  key: string,
): Promise<any> {
  const transaction = db.transaction([objectStoreName], "readonly");
  const objectStore = transaction.objectStore(objectStoreName);
  const index = objectStore.index(key);
  const request = index.openCursor();
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor && cursor.value) {
        resolve(cursor.value[key]);
      }
      resolve(null);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * getMaximalValueByField.
 *
 * @param {IDBDatabase} db
 * @param {string} objectStoreName
 * @param {string} key
 * @returns {Promise<*>}
 */
export async function getMaximalValueByField(
  db: IDBDatabase,
  objectStoreName: string,
  key: string,
): Promise<any> {
  const transaction = db.transaction([objectStoreName], "readonly");
  const objectStore = transaction.objectStore(objectStoreName);
  const index = objectStore.index(key);
  const request = index.openCursor(null, "prev");
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const cursor = request.result;
      if (cursor && cursor.value) {
        resolve(cursor.value[key]);
      }
      resolve(null);
    };
    request.onerror = () => {
      reject(request.error);
    };
  });
}
