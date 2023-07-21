import type {ItemData} from "src/types";
import {
  addDays,
  getDifferenceInDays,
  getFirstDayOfYear,
  getLastDayOfYear,
} from "./date.utils";
import {getMaximalValueByField, getMinimalValueByField} from "./db.utils";

export function getMinMaxValues(data: Array<ItemData>): Array<number> {
  let min = null;
  let max = null;
  data.forEach((item) => {
    if (min === null) {
      min = item.v;
    }
    if (max === null) {
      max = item.v;
    }
    if (min > item.v) {
      min = item.v;
    }
    if (max < item.v) {
      max = item.v;
    }
  });
  return [min, max];
}

export function getChartPoints(
  data: Array<ItemData>,
  width: number,
  height: number,
  offsetX: number = 0,
  offsetY: number = 0,
) {
  const [min, max] = getMinMaxValues(data);
  const kx = (width - offsetX * 2) / (data.length - 1);
  const ky = (height - offsetY * 2) / (max - min);
  return data.map((item, index) => {
    return {
      ...item,
      x: offsetX + index * kx,
      y: height - (offsetY + Math.floor((item.v - min) * ky)),
    };
  });
}

export function getYearScalePoints(data: Array<ItemData>, width, offsetX) {
  if ((width - offsetX) / data.length > 60) {
    const kx = (width - offsetX * 2) / (data.length - 1);
    return data.map((item, index) => {
      return {
        ...item,
        x: offsetX + index * kx,
        label: item.t.split("-").reverse().join("."),
      };
    });
  }
  if ((width - offsetX) / data.length > 30) {
    const kx = (width - offsetX * 2) / (data.length - 1);
    return data.map((item, index) => {
      return {
        ...item,
        x: offsetX + index * kx,
        label: index % 2 === 0 ? item.t.split("-").reverse().join(".") : "",
      };
    });
  }
  if ((width - offsetX) / data.length > 15) {
    const kx = (width - offsetX * 2) / (data.length - 1);
    return data.map((item, index) => {
      return {
        ...item,
        x: offsetX + index * kx,
        label: index % 4 === 0 ? item.t.split("-").reverse().join(".") : "",
      };
    });
  }
  if ((width - offsetX) / data.length > 5) {
    const kx = (width - offsetX * 2) / (data.length - 1);
    return data.map((item, index) => {
      return {
        ...item,
        x: offsetX + index * kx,
        label: index % 12 === 0 ? item.t.split("-").reverse().join(".") : "",
      };
    });
  }
  const kx = (width - offsetX * 2) / (data.length - 1);
  return data.map((item, index) => {
    return {
      ...item,
      x: offsetX + index * kx,
      label: index % 20 === 0 ? item.t.split("-").reverse().join(".") : "",
    };
  });
}

export async function getChartFrame(
  storeName: string,
  fromYear: string,
  toYear: string,
  width: number,
  offset: number,
  step: number,
) {
  let fromDate: string, toDate: string;
  if (fromYear) {
    fromDate = getFirstDayOfYear(fromYear);
  } else {
    fromDate = await getMinimalValueByField(storeName, "t");
  }
  const originalFrom = fromDate;
  if (offset) {
    fromDate = addDays(fromDate, Math.floor(offset / step));
  }
  if (toYear) {
    toDate = getLastDayOfYear(toYear);
  } else {
    toDate = await getMaximalValueByField(storeName, "t");
  }
  const originalTo = toDate;
  const diff = getDifferenceInDays(fromDate, toDate);
  if (diff > width / step) {
    toDate = addDays(fromDate, width / step);
  }
  return [fromDate, toDate, originalFrom, originalTo];
}

export function getYScalePont(
  point: number,
  min: number,
  max: number,
  height: number,
  offsetY: number,
): number {
  const ky = (height - offsetY * 2) / (max - min);
  return height - (offsetY + Math.floor((point - min) * ky));
}
