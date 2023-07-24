import {getData} from "../api.utils";
import type {ItemData} from "../../types";

global.fetch = jest.fn((url) => {
  switch (url) {
    case "/valid":
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{v: 1, t: 2}]),
      });
    default:
      return Promise.resolve({
        ok: false,
      });
  }
}) as jest.Mock;

jest.mock("../../properties", () => {
  return {API_ENDPOINT: ""};
});

describe("API Utils", () => {
  describe("getData", () => {
    it("should request data with fetch api", async () => {
      const result = await getData<ItemData>("/valid");
      expect(result.length).toBe(1);
      expect(result[0].v).toBe(1);
      expect(result[0].t).toBe(2);
      expect(fetch).toBeCalledWith("/valid");
    });
    it("should throw error", async () => {
      expect(async () => await getData<ItemData>("/invalid")).rejects.toThrow(
        Error,
      );
    });
  });
  describe("getData parallel calls", () => {
    it("parallel calls should make one api call", async () => {
      await Promise.all([
        getData<ItemData>("/valid"),
        getData<ItemData>("/valid"),
        getData<ItemData>("/valid"),
      ]);
      expect(global.fetch).toHaveReturnedTimes(1);
    });
  });
});
