import {getChartFrame, getChartPoints} from "../chart.utils";
jest.mock("../db.utils", () => {
  return {
    getDB: () => Promise.resolve({}),
    getMinimalValueByField: () => Promise.resolve({t: "1970-01-01"}),
    getMaximalValueByField: () => Promise.resolve({t: "1990-01-01"}),
  };
});

describe("Chat Utils", () => {
  describe("getChatPoints", () => {
    it("should return correct points for positive chart from two points", () => {
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
    it("should return correct points for positive chart from three points", () => {
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
    it("should return correct points for negative chart", () => {
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
  describe("getChartFrame", () => {
    it("should return correct date frame without offset", async () => {
      let [from, to] = await getChartFrame("1980", "1980", 1000, 0, 1);
      expect(from).toBe("1980-01-01");
      expect(to).toBe("1980-12-31");
      [from, to] = await getChartFrame("", "", 100, 0, 5);
      expect(from).toBe("1970-01-01");
      expect(to).toBe("1970-01-21");
    });
    it("should return correct dates frame with offset", async () => {
      let [from, to] = await getChartFrame("1980", "1980", 1000, 9, 1);
      expect(from).toBe("1980-01-10");
      expect(to).toBe("1980-12-31");
      [from, to] = await getChartFrame("", "", 100, 45, 5);
      expect(from).toBe("1970-01-10");
      expect(to).toBe("1970-01-30");
    });
  });
});
