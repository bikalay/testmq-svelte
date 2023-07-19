import {STORE_TEMPERATURE_NAME} from "../db.config";
import {clear, count, getDB} from "../utils/db.utils";
import {getMinMaxYears, getTemperature, getTemperatureCount, TEMPERATURE_URL} from "../weather.service";

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
    const db = await getDB();
    await clear(db, STORE_TEMPERATURE_NAME);
  });
  describe("getTemperature", () => {
    it("should return all temperature data", async () => {
      const temperature = await getTemperature();
      expect(require("../utils/api.utils").getData).toHaveBeenCalledWith(
        TEMPERATURE_URL,
      );
      expect(temperature).toHaveLength(6);
      expect(temperature[0].v).toBe(1);
      expect(temperature[0].t).toBe("2023-01-01");
    });
    it("should return data later 2023-1-3", async () => {
      const temperature = await getTemperature("2023-01-04");
      expect(temperature).toHaveLength(3);
      expect(temperature[0].v).toBe(4);
      expect(temperature[0].t).toBe("2023-01-04");
    })
    it("should return date before 2023-1-4", async () => {
      const temperature = await getTemperature(null, "2023-01-03");
      expect(temperature).toHaveLength(3);
      expect(temperature[0].v).toBe(1);
      expect(temperature[0].t).toBe("2023-01-01");
    })
    it("should return data between 2023-1-2 and 2023-1-5", async () => {
      const temperature = await getTemperature("2023-01-02", "2023-01-05");
      expect(temperature).toHaveLength(4);
      expect(temperature[0].v).toBe(2);
      expect(temperature[0].t).toBe("2023-01-02");
    })
  });
  describe("getMinMaxYears", () => {
    it("should return min/max years", async () => {
      const [min, max] = await getMinMaxYears();
      expect(min).toBe(2023);
      expect(max).toBe(2024);
    })
  });
  describe("getTemperatureCount", () => {
    it("should return correct count", async () => {
      const count = await getTemperatureCount();
      expect(count).toBe(6);
    });
  });
});
