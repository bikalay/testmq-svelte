import {STORE_TEMPERATURE_NAME} from "../../db.config";
import {
  getChartFrame,
  getChartPoints,
  getMinMaxValues,
  getYearScalePoints,
  getYScalePoint,
} from "../chart.utils";

jest.mock("../../weather.service", () => {
  return {
    getMinMaxDates: () => Promise.resolve(["1970-01-01", "1990-01-01"]),
  };
});

describe("Chat Utils", () => {
  describe("getMinMaxValues", () => {
    it("should return correct min and max values", () => {
      const [min, max] = getMinMaxValues([
        {t: "", v: 1},
        {t: "", v: 2},
        {t: "", v: -1},
        {t: "", v: 10},
        {t: "", v: 5},
      ]);
      expect(min).toBe(-1);
      expect(max).toBe(10);
    });
  });
  describe("getChatPoints", () => {
    it("should return correct points for positive chart from two points", async () => {
      const points = getChartPoints(
        [
          {v: 2, t: "2023-01-01"},
          {v: 5, t: "2023-01-02"},
        ],
        10,
        10,
      );
      expect(points).toEqual([
        {v: 2, t: "2023-01-01", x: 0, y: 10},
        {v: 5, t: "2023-01-02", x: 10, y: 0},
      ]);
    });
    it("should return correct points for positive chart from three points", async () => {
      const points = getChartPoints(
        [
          {v: 2, t: "2023-01-01"},
          {v: 5, t: "2023-01-02"},
          {v: 0, t: "2023-01-03"},
        ],
        10,
        10,
      );
      expect(points).toEqual([
        {v: 2, t: "2023-01-01", x: 0, y: 6},
        {v: 5, t: "2023-01-02", x: 5, y: 0},
        {v: 0, t: "2023-01-03", x: 10, y: 10},
      ]);
    });
    it("should return correct points for negative chart", async () => {
      const points = getChartPoints(
        [
          {v: -5, t: "2023-01-01"},
          {v: 5, t: "2023-01-02"},
          {v: 0, t: "2023-01-03"},
        ],
        10,
        10,
      );
      expect(points).toEqual([
        {v: -5, t: "2023-01-01", x: 0, y: 10},
        {v: 5, t: "2023-01-02", x: 5, y: 0},
        {v: 0, t: "2023-01-03", x: 10, y: 5},
      ]);
    });
  });
  describe("getYearScalePoints", () => {
    it("should return correct year scale points", () => {
      const result = getYearScalePoints(
        [
          {v: 1, t: "1970-01-01"},
          {v: 1, t: "1970-01-02"},
          {v: 1, t: "1970-01-03"},
          {v: 1, t: "1970-01-04"},
          {v: 1, t: "1970-01-05"},
          {v: 1, t: "1970-01-06"},
          {v: 1, t: "1970-01-07"},
          {v: 1, t: "1970-01-08"},
          {v: 1, t: "1970-01-09"},
          {v: 1, t: "1970-01-10"},
        ],
        300,
      );
      expect(result).toEqual([
        {v: 1, t: "1970-01-01", label: "01.01.1970", x: 0},
        {v: 1, t: "1970-01-02", label: "", x: 33},
        {v: 1, t: "1970-01-03", label: "", x: 66},
        {v: 1, t: "1970-01-04", label: "", x: 100},
        {v: 1, t: "1970-01-05", label: "05.01.1970", x: 133},
        {v: 1, t: "1970-01-06", label: "", x: 166},
        {v: 1, t: "1970-01-07", label: "", x: 200},
        {v: 1, t: "1970-01-08", label: "", x: 233},
        {v: 1, t: "1970-01-09", label: "09.01.1970", x: 266},
        {v: 1, t: "1970-01-10", label: "", x: 300},
      ]);
    });
    it("should return correct year scale points with labels for each item", () => {
      const result = getYearScalePoints(
        [
          {v: 1, t: "1970-01-01"},
          {v: 1, t: "1970-01-02"},
          {v: 1, t: "1970-01-03"},
        ],
        600,
      );
      expect(result).toEqual([
        {v: 1, t: "1970-01-01", label: "01.01.1970", x: 0},
        {v: 1, t: "1970-01-02", label: "02.01.1970", x: 300},
        {v: 1, t: "1970-01-03", label: "03.01.1970", x: 600},
      ]);
    });
  });
  describe("getChartFrame", () => {
    it("should return correct date frame without offset", async () => {
      let [from, to] = await getChartFrame(
        STORE_TEMPERATURE_NAME,
        "1980",
        "1980",
        1000,
        0,
        1,
      );
      expect(from).toBe("1980-01-01");
      expect(to).toBe("1980-12-31");
      [from, to] = await getChartFrame(
        STORE_TEMPERATURE_NAME,
        "",
        "",
        100,
        0,
        5,
      );
      expect(from).toBe("1970-01-01");
      expect(to).toBe("1970-01-21");
    });
    it("should return correct dates frame with offset", async () => {
      let [from, to] = await getChartFrame(
        STORE_TEMPERATURE_NAME,
        "1980",
        "1980",
        1000,
        9,
        1,
      );
      expect(from).toBe("1980-01-10");
      expect(to).toBe("1980-12-31");
      [from, to] = await getChartFrame(
        STORE_TEMPERATURE_NAME,
        "",
        "",
        100,
        45,
        5,
      );
      expect(from).toBe("1970-01-10");
      expect(to).toBe("1970-01-30");
    });
  });
  describe("getYScalePoint", () => {
    it("should return correct point", () => {
      const y = getYScalePoint(10, 0, 20, 100);
      expect(y).toBe(50);
    });
  });
});


