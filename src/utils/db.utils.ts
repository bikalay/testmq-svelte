import {writable} from "svelte/store";
import {DB_NAME, DB_VERSION, STORES_CONFIG} from "../db.config";
import {Mutex} from "./mutex";

let DB: IDBDatabase | null = null;

export type ObjectStoreIndex = {
  name: string;
  unique?: boolean;
};
export type ObjectStore = {
  name: string;
  config: {autoIncrement?: boolean, keyPath?: string};
  indexes?: ObjectStoreIndex[];
};

export type IndexQuery = {
  indexName: string;
  keyRange?: IDBKeyRange;
};

const mutex = new Mutex();

/**
 * initialize.
 * Initializes and returns db instance;
 * @param {string} dbName - DB Name;
 *  @param {number} dbVersion - DB Version
 * @returns {Promise<IDBDatabase>} - DB Instance;
 */
export function initialize(
  dbName: string,
  dbVersion: number,
  oStores: Array<ObjectStore>,
): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    console.log("initialize db");
    const request = window.indexedDB.open(dbName, dbVersion);
    request.onerror = () => {
      reject(request.error);
    };
    request.onupgradeneeded = () => {
      console.log("initialize onupgradeneeded");
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
      console.log("initialize onsuccess");
      const db = request.result;
      resolve(db);
    };
  });
}

/**
 * getDB
 * Creates new db instance if not initialized or returns existing db
 * @returns {Promise<IDBDatabase>} - DB Instance
 */
export async function getDB(): Promise<IDBDatabase> {
  const unlock = await mutex.lock();
  if (!DB) {
    DB = await initialize(DB_NAME, DB_VERSION, STORES_CONFIG);
  }
  unlock();
  return DB;
}

/**
 * Count
 * Returns number of rows in object store;
 * @param {string} storeName - Object Store Name
 * @param {IndexQuery=} query - Query
 * @returns {Promise<number>} - Number of rows
 */
export async function count(
  storeName: string,
  query?: IndexQuery,
): Promise<number> {
  const db = await getDB();
  const transaction = db.transaction([storeName], "readonly");
  const objectStore = transaction.objectStore(storeName);
  let request = null;
  if (query) {
    const {indexName, keyRange} = query;
    const index = objectStore.index(indexName);
    request = index.count(keyRange);
  } else {
    request = objectStore.count();
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
 * clear.
 * Clears object store
 * @param {string} objectStoreName - Object Store Name
 */
export async function clear(objectStoreName: string) {
  const db = await getDB();
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
 * Returns rows buy query
 * @param {string} objectStoreName - Object Store Name
 * @param {IndexQuery} query - Query
 * @returns {Promise<Array<T>>} - List of data rows
 */
export async function query<T>(
  objectStoreName: string,
  query?: IndexQuery,
): Promise<Array<T>> {
  const db = await getDB();
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
 * Inserts array of documents
 * @param {string} storeName - Object Store Name
 * @param {Array} data - list of data
 */
export async function insertMany(storeName: string, data: Array<any>) {
  const db = await getDB();
  const transaction = db.transaction([storeName], "readwrite");
  const objectStore = transaction.objectStore(storeName);
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
 * Returns minimal field value form object store
 * @param {string} objectStoreName - Object Store Name
 * @param {string} key - Field name
 * @returns {Promise<any>} - Minimal value
 */
export async function getMinimalValueByField(
  objectStoreName: string,
  key: string,
): Promise<any> {
  const db = await getDB();
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
 * Returns max field value from object store
 * @param {string} objectStoreName - Object Store Name
 * @param {string} key - Field name
 * @returns {Promise<*>} - Max value
 */
export async function getMaximalValueByField(
  objectStoreName: string,
  key: string,
): Promise<any> {
  const db = await getDB();
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
