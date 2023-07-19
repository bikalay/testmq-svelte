import {
  addDays,
  getISODate,
  getYearFromISODate,
  getFirstDayOfYear,
  getLastDayOfYear,
  getDifferenceInDays,
} from "../date.utils";

describe("Date Utils", () => {
  describe("getISODate", () => {
    it("should return ISO date string", () => {
      expect(getISODate(new Date(2023, 0, 1))).toBe("2023-01-01");
    });
  });
  describe("getYearFromISODate", () => {
    it("should return year from ISO string", () => {
      expect(getYearFromISODate("2032-01-01")).toBe(2032);
    });
  });
  describe("addDays", () => {
    it("should return correct date with added days", () => {
      expect(addDays("2023-01-01", 100)).toBe("2023-04-11");
    });
  });
  describe("getLastDayOfYear", () => {
    it("should return  last day of year", () => {
      expect(getLastDayOfYear("2022")).toBe("2022-12-31");
    });
  });
  describe("getFirstDayOfYear", () => {
    it("should return first day of year", () => {
      expect(getFirstDayOfYear("2000")).toBe("2000-01-01");
    });
  });
  describe("getDifferenceInDays", () => {
      it("should return correct number of days", () => {
        expect(getDifferenceInDays("2022-01-01", "2022-01-15")).toBe(14);
      });
  });
});
