import {
  DB_NAME,
  DB_VERSION,
  STORES_CONFIG,
  STORE_TEMPERATURE_NAME,
} from "../../db.config";
import {
  clear,
  count,
  getDB,
  getMaximalValueByField,
  getMinimalValueByField,
  initialize,
  insertMany,
  query,
} from "../db.utils";
import type {ItemData} from "../../types";

describe("DB Utils", () => {
  beforeEach(async () => {
    const db = await getDB();
    clear(db, STORE_TEMPERATURE_NAME);
  });
  describe("initialize", () => {
    it("should initilaze successful", async () => {
      const db = await initialize(DB_NAME, DB_VERSION, STORES_CONFIG);
      expect(db).toBeDefined();
    });
    it("should give error for wrong version", async () => {
      try {
        await initialize(DB_NAME, DB_VERSION - 1, STORES_CONFIG);
      } catch (err: any) {
        expect(err.toString()).toBe("VersionError");
      }
    });
  });
  describe("getDB", () => {
    it("should get the same db instance", async () => {
      const db = await getDB();
      expect(db).toBeDefined();
      const db2 = await getDB();
      expect(db2).toBeDefined();
      expect(db).toBe(db2);
    });
  });
  describe("count", () => {
    it("should return 0 for empty collection", async () => {
      const db = await getDB();
      const _count = await count(db, STORE_TEMPERATURE_NAME);
      expect(_count).toBe(0);
    });
  });
  describe("insertMany", () => {
    it("should insert data successful", async () => {
      const db = await getDB();
      await insertMany(db, STORE_TEMPERATURE_NAME, [
        {v: 1, t: 2},
        {v: 3, t: 4},
      ]);
      const _count = await count(db, STORE_TEMPERATURE_NAME);
      expect(_count).toBe(2);
    });
  });
  describe("clear", () => {
    it("should remove all data from an collection", async () => {
      const db = await getDB();
      await insertMany(db, STORE_TEMPERATURE_NAME, [{v: 5, t: 6}]);
      const _count = await count(db, STORE_TEMPERATURE_NAME);
      expect(_count).toBe(1);
      await clear(db, STORE_TEMPERATURE_NAME);
      const _count2 = await count(db, STORE_TEMPERATURE_NAME);
      expect(_count2).toBe(0);
    });
  });
  describe("query", () => {
    it("should return all records", async () => {
      const db = await getDB();
      await insertMany(db, STORE_TEMPERATURE_NAME, [
        {v: 1, t: 1},
        {v: 2, t: 2},
        {v: 3, t: 3},
        {v: 4, t: 4},
      ]);
      const result = await query<ItemData>(db, STORE_TEMPERATURE_NAME);
      expect(result).toHaveLength(4);
      expect(result[0]).toEqual({v: 1, t: 1});
      expect(result[1]).toEqual({v: 2, t: 2});
      expect(result[2]).toEqual({v: 3, t: 3});
      expect(result[3]).toEqual({v: 4, t: 4});
    });
    it("should return records by query", async () => {
      const db = await getDB();
      await insertMany(db, STORE_TEMPERATURE_NAME, [
        {v: 1, t: 1},
        {v: 2, t: 2},
        {v: 3, t: 3},
        {v: 4, t: 4},
      ]);
      const result = await query<ItemData>(db, STORE_TEMPERATURE_NAME, {
        indexName: "t",
        keyRange: IDBKeyRange.bound(1, 3),
      });
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({v: 1, t: 1});
      expect(result[1]).toEqual({v: 2, t: 2});
      expect(result[2]).toEqual({v: 3, t: 3});

      const result2 = await query<ItemData>(db, STORE_TEMPERATURE_NAME, {
        indexName: "t",
        keyRange: IDBKeyRange.lowerBound(4),
      });
      expect(result2).toHaveLength(1);
    });
  });
  describe("getMinimalValue", () => {
    it("should return minimal value", async () => {
      const db = await getDB();
      await insertMany(db, STORE_TEMPERATURE_NAME, [
        {v: 6, t: 6},
        {v: 2, t: 2},
        {v: 1, t: 1},
        {v: 4, t: 4},
      ]);
      const minValue = await getMinimalValueByField(db, STORE_TEMPERATURE_NAME,  "t");
      expect(minValue).toBe(1);
    });
  });
  describe("getMaximalValue", () => {
    it("should return max value", async () => {
      const db = await getDB();
      await insertMany(db, STORE_TEMPERATURE_NAME, [
        {v: 2, t: 2},
        {v: 4, t: 4},
        {v: 3, t: 3},
        {v: 1, t: 1},
      ]);
      const minValue = await getMaximalValueByField(db, STORE_TEMPERATURE_NAME, "t");
      expect(minValue).toBe(4);
    });
  });
});
