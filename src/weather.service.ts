import type {ItemData} from "./types";
import {getData} from "./utils/api.utils";
import {
  count,
  getMaximalValueByField,
  getMinimalValueByField,
  insertMany,
  query,
} from "./utils/db.utils";
import {STORE_TEMPERATURE_NAME, STORE_PRECIPITATION_NAME} from "./db.config";
import {getYearFromISODate} from "./utils/date.utils";
export const TEMPERATURE_URL = "/temperature.json";
export const PRECIPITATION_URL = "/precipitation.json";

/**
 * initializeDBWithData.
 * Fills object store from api
 * @param {string} storeName - Object store name
 */
export async function initializeDBWithData(storeName: string) {
  const isEmpty = !(await count(storeName));
  let url = "";
  switch (storeName) {
    case STORE_TEMPERATURE_NAME:
      url = TEMPERATURE_URL;
      break;
    case STORE_PRECIPITATION_NAME:
      url = PRECIPITATION_URL;
      break;
  }
  if (isEmpty) {
    const data = await getData<ItemData>(url);
    await insertMany(storeName, data);
  }
}

/**
 * getDataCount.
 *
 * @param {string} storeName
 * @returns {Promise<number>}
 */
export async function getDataCount(storeName: string): Promise<number> {
  await initializeDBWithData(storeName);
  return await count(storeName);
}

/**
 * getWeatherData
 * @param {string} storeName
 * @param {string=} from
 * @param {string=} to
 * @returns {Promise<Array<ItemData>>}
 */
export async function getWeatherData(
  storeName: string,
  from?: string | null,
  to?: string,
): Promise<Array<ItemData>> {
  let result: Array<ItemData> = [];
  if (from && to) {
    result = await query<ItemData>(storeName, {
      indexName: "t",
      keyRange: IDBKeyRange.bound(from, to),
    });
  } else if (from) {
    result = await query<ItemData>(storeName, {
      indexName: "t",
      keyRange: IDBKeyRange.lowerBound(from),
    });
  } else if (to) {
    result = await query<ItemData>(storeName, {
      indexName: "t",
      keyRange: IDBKeyRange.upperBound(to),
    });
  } else {
    result = await query<ItemData>(storeName);
  }
  return result;
}

/**
 * getMinMaxYears.
 * @param  {string} storeName
 * @returns {Promise<Array<number>>}
 */
export async function getMinMaxYears(storeName: string): Promise<Array<number>> {
  await initializeDBWithData(storeName);
  const res = await Promise.all([
    getMinimalValueByField(storeName, "t"),
    getMaximalValueByField(storeName, "t"),
  ]);
  return res.map((date: string) => {
    return getYearFromISODate(date);
  });
}

/**
 * getMinMaxValues.
 *
 * @param {string} storeName
 * @returns {Promise<Array<number>>}
 */
export async function getMinMaxValues(storeName: string): Promise<Array<number>> {
  const res = await Promise.all([
    getMinimalValueByField(storeName, "v"),
    getMaximalValueByField(storeName, "v")
  ]);
  return res;
}
