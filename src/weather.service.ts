import type {ItemData} from "./types";
import {getData} from "./utils/api.utils";
import type {IndexQuery} from "./utils/db.utils";
import {count, insertMany, query} from "./utils/db.utils";
import {STORE_TEMPERATURE_NAME, STORE_PRECIPITATION_NAME} from "./db.config";
import {addDays, getDifferenceInDays} from "./utils/date.utils";
import {Mutex} from "./utils/mutex";
export const TEMPERATURE_URL = "/temperature.json";
export const PRECIPITATION_URL = "/precipitation.json";

const minMaxDates = {};

const mutex = new Mutex();

export function createQuery(from: string, to: string) {
  const query: IndexQuery = {indexName: "t"};
  if (from && to) {
    query.keyRange = IDBKeyRange.bound(from, to);
    return query;
  }
  return null;
}

export async function getDataFromApi(
  storeName: string,
  from?: string,
  to?: string,
) {
  let url = "";
  switch (storeName) {
    case STORE_TEMPERATURE_NAME:
      url = TEMPERATURE_URL;
      break;
    case STORE_PRECIPITATION_NAME:
      url = PRECIPITATION_URL;
      break;
  }
  const data = await getData<ItemData>(url);
  const firstItem = data[0];
  const fromIndex = from ? getDifferenceInDays(firstItem.t, from) : 0;
  const toIndex = to ? getDifferenceInDays(firstItem.t, to) + 1 : undefined;
  return data.slice(fromIndex, toIndex);
}

/**
 * getDataCount.
 *
 * @param {string} storeName
 *  @param {string=} from
 *  @param {string=} to
 * @returns {Promise<number>}
 */
export async function getDataCount(
  storeName: string,
  from?: string,
  to?: string,
): Promise<number> {
  const query = createQuery(from, to);
  return await count(storeName, query);
}

/**
 * getWeatherData.
 *
 * @param {string} storeName
 * @param {string} from
 * @param {string} to
 * @returns {Promise<Array<ItemData>>}
 */
export async function getWeatherData(
  storeName: string,
  from: string | null,
  to: string,
): Promise<Array<ItemData>> {
  const unlock = await mutex.lock();
  const q = createQuery(from, to);
  const _count = await count(storeName, q);
  const daysNumber = getDifferenceInDays(from, to) + 1;
  if (_count < daysNumber) {
    const data = await getDataFromApi(storeName, from, addDays(to, daysNumber));
    await insertMany(storeName, data);
  }
  unlock();
  return query<ItemData>(storeName, q);
}

/**
 * getMinMaxDates.
 *
 * @param {string} storeName
 * @param {string=} from
 * @param {string=} to
 * @returns {Promise<Array<string>>}
 */
export async function getMinMaxDates(
  storeName: string,
  from?: string,
  to?: string,
): Promise<Array<string>> {
  if (!minMaxDates[storeName]) {
    const data = await getDataFromApi(storeName, from, to);
    const firstItem = data[0];
    const lastItem = data[data.length - 1];
    minMaxDates[storeName] = [firstItem.t, lastItem.t];
  }
  return minMaxDates[storeName];
}
