import {getHashValue, setHashValue} from "../location.utils";

describe("Location Utils", () => {
  describe("setHashValue", () => {
    it("should write param to location hash", () => {
      setHashValue("fieldName", "fieldValue");
      expect(location.hash).toBe("#fieldName=fieldValue");
    });
    it("should write a few params to location hash", () => {
      setHashValue("fieldName", "fieldValue");
      setHashValue("field2Name", "field2Value");
      expect(location.hash).toBe(
        "#fieldName=fieldValue&field2Name=field2Value",
      );
    });
    it("should remove param from hash if set empty string", () => {
      setHashValue("fieldValue", "");
      expect("#field2Name=field2Value");
    });
  });
  describe("getHashValue", () => {
    it("should get correct value form hash", () => {
      const val = getHashValue("field2Name");
      expect(val).toBe("field2Value");
    });
  });
});
