import type {ItemData} from "./types";
import {getData} from "./utils/api.utils";
import {
  count,
  getDB,
  getMaximalValueByField,
  getMinimalValueByField,
  insertMany,
  query,
} from "./utils/db.utils";
import {STORE_TEMPERATURE_NAME} from "./db.config";
import {getYearFromISODate} from "./utils/date.utils";
export const TEMPERATURE_URL = "../data/temperature.json";

export async function initializeDBWithTemperature() {
  const db = await getDB();
  const isEmpty = !(await count(db, STORE_TEMPERATURE_NAME));
  if (isEmpty) {
    const temperature = await getData<ItemData>(TEMPERATURE_URL);
    await insertMany(db, STORE_TEMPERATURE_NAME, temperature);
  }
}

export async function getTemperatureCount() {
  await initializeDBWithTemperature();
  const db = await getDB();
  const _count = await count(db, STORE_TEMPERATURE_NAME);
  return _count;
}

/**
 * getTemperature.
 *
 * @param {string=} from
 * @param {string=} to
 * @returns {Promise<Array<ItemData>>}
 */
export async function getTemperature(
  from?: string | null,
  to?: string,
): Promise<Array<ItemData>> {
  let result: Array<ItemData> = [];
  await initializeDBWithTemperature();
  const db = await getDB();

  if (from && to) {
    result = await query<ItemData>(db, STORE_TEMPERATURE_NAME, {
      indexName: "t",
      keyRange: IDBKeyRange.bound(from, to),
    });
  } else if (from) {
    result = await query<ItemData>(db, STORE_TEMPERATURE_NAME, {
      indexName: "t",
      keyRange: IDBKeyRange.lowerBound(from),
    });
  } else if (to) {
    result = await query<ItemData>(db, STORE_TEMPERATURE_NAME, {
      indexName: "t",
      keyRange: IDBKeyRange.upperBound(to),
    });
  } else {
    result = await query<ItemData>(db, STORE_TEMPERATURE_NAME);
  }
  return result;
}

/**
 * getMinMaxYears.
 *
 * @returns {Promise<Array<number>>}
 */
export async function getMinMaxYears(): Promise<Array<number>> {
  await initializeDBWithTemperature();
  const db = await getDB();
  const res = await Promise.all([
    getMinimalValueByField(db, STORE_TEMPERATURE_NAME, "t"),
    getMaximalValueByField(db, STORE_TEMPERATURE_NAME, "t"),
  ]);
  return res.map((date: string) => {
    return getYearFromISODate(date);
  });
}
