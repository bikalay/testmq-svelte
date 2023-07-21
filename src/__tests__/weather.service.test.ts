import {STORE_PRECIPITATION_NAME, STORE_TEMPERATURE_NAME} from "../db.config";
import {
  getMinMaxYears,
  getMinMaxValues,
  getDataCount,
  getWeatherData,
  TEMPERATURE_URL,
  initializeDBWithData,
} from "../weather.service";
import {count} from "../utils/db.utils";
jest.mock("../properties", () => {
  return {API_ENDPOINT: "../data"}
});

jest.mock("../utils/api.utils", () => {
  return {
    getData: jest.fn(() =>
      Promise.resolve([
        {v: 1, t: "2023-01-01"},
        {v: 2, t: "2023-01-02"},
        {v: 3, t: "2023-01-03"},
        {v: 4, t: "2023-01-04"},
        {v: 5, t: "2023-01-05"},
        {v: 6, t: "2024-01-06"},
      ]),
    ),
  };
});

describe("Weather Service", () => {
  beforeEach(async () => {
    await initializeDBWithData(STORE_TEMPERATURE_NAME);
  });
  describe("getWeatherData", () => {
    it("should return all temperature data", async () => {
      const temperature = await getWeatherData(STORE_TEMPERATURE_NAME);
      expect(require("../utils/api.utils").getData).toHaveBeenCalledWith(
        TEMPERATURE_URL,
      );
      expect(temperature).toHaveLength(6);
      expect(temperature[0].v).toBe(1);
      expect(temperature[0].t).toBe("2023-01-01");
    });
    it("should return data later 2023-1-3", async () => {
      const temperature = await getWeatherData(
        STORE_TEMPERATURE_NAME,
        "2023-01-04",
      );
      expect(temperature).toHaveLength(3);
      expect(temperature[0].v).toBe(4);
      expect(temperature[0].t).toBe("2023-01-04");
    });
    it("should return date before 2023-1-4", async () => {
      const temperature = await getWeatherData(
        STORE_TEMPERATURE_NAME,
        null,
        "2023-01-03",
      );
      expect(temperature).toHaveLength(3);
      expect(temperature[0].v).toBe(1);
      expect(temperature[0].t).toBe("2023-01-01");
    });
    it("should return data between 2023-1-2 and 2023-1-5", async () => {
      const temperature = await getWeatherData(
        STORE_TEMPERATURE_NAME,
        "2023-01-02",
        "2023-01-05",
      );
      expect(temperature).toHaveLength(4);
      expect(temperature[0].v).toBe(2);
      expect(temperature[0].t).toBe("2023-01-02");
    });
  });
  describe("getMinMaxYears", () => {
    it("should return min/max years", async () => {
      const [min, max] = await getMinMaxYears(STORE_TEMPERATURE_NAME);
      expect(min).toBe(2023);
      expect(max).toBe(2024);
    });
  });
  describe("getDataCount", () => {
    it("should return correct count", async () => {
      const count = await getDataCount(STORE_TEMPERATURE_NAME);
      expect(count).toBe(6);
    });
  });
  describe("getMinMaxValues", () => {
    it("should return correct min and max values", async () => {
      const [min, max] = await getMinMaxValues(STORE_TEMPERATURE_NAME);
      expect(min).toBe(1);
      expect(max).toBe(6);
    });
  });
  describe("initializeDBWithData", () => {
    it("should fill object store from api", async () => {
      const countBefore = await count(STORE_PRECIPITATION_NAME);
      expect(countBefore).toBe(0);
      await initializeDBWithData(STORE_PRECIPITATION_NAME);
      const countAfter = await count(STORE_PRECIPITATION_NAME);
      expect(countAfter).toBe(6);
    });
  });
});
