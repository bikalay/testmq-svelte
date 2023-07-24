import type {ItemData} from "src/types";
import {getMinMaxDates} from "../weather.service";
import {
  addDays,
  formatDate,
  getDifferenceInDays,
  getFirstDayOfYear,
  getLastDayOfYear,
} from "./date.utils";

/**
 * getMinMaxValues.
 * Returns array where first element is min value and second element is max value
 * @param {Array<ItemData>} data - Items array
 * @returns {Array<number>} - [min, max];
 */
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

/**
 * getChartPoints.
 * @param {Array<ItemData>} data - chart data
 * @param {number} width - chart width
 * @param {number} height - chart height
 * @param {number} offsetX - chart offset x
 * @param {number} offsetY - chart offset y
 */
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

/**
 * getYearScalePoints.
 *
 * @param {Array<ItemData>} data
 * @param {number} width
 * @param {number=} offsetX
 */
export function getYearScalePoints(
  data: Array<ItemData>,
  width: number,
  offsetX: number = 0,
) {
  const kx = (width - offsetX * 2) / (data.length - 1);
  const daySize = (width - offsetX) / data.length;
  const minDaySize = 120;

  if (daySize > minDaySize) {
    return data.map((item, index) => {
      return {
        ...item,
        x: Math.floor(offsetX + index * kx),
        label: formatDate(item.t),
      };
    });
  } else {
    return data.map((item, index) => {
      return {
        ...item,
        x: Math.floor(offsetX + index * kx),
        label:
          index % Math.floor(minDaySize / daySize) === 0
            ? formatDate(item.t)
            : "",
      };
    });
  }
}

/**
 * getChartFrame.
 * @param {string} storeName
 * @param {string} fromYear
 * @param {string} toYear
 * @param {number} width
 * @param {number} offset
 * @param {number} step
 */
export async function getChartFrame(
  storeName: string,
  fromYear: string,
  toYear: string,
  width: number,
  offset: number,
  step: number,
) {
  let fromDate: string, toDate: string, from: string, to: string;
  if (!fromYear || !toYear) {
    [from, to] = await getMinMaxDates(storeName);
  }
  fromDate = fromYear ? getFirstDayOfYear(fromYear) : from;
  const originalFrom = fromDate;
  if (offset) {
    fromDate = addDays(fromDate, Math.floor(offset / step));
  }
  toDate = toYear ? getLastDayOfYear(toYear) : to;
  const originalTo = toDate;
  const diff = getDifferenceInDays(fromDate, toDate);
  if (diff > width / step) {
    toDate = addDays(fromDate, width / step);
  }
  return [fromDate, toDate, originalFrom, originalTo];
}

/**
 * getYScalePont.
 * @param {number} point
 * @param {number} min
 * @param {number} max
 * @param {number} height
 * @param {number=} offsetY
 */
export function getYScalePoint(
  point: number,
  min: number,
  max: number,
  height: number,
  offsetY: number = 0,
): number {
  const ky = (height - offsetY * 2) / (max - min);
  return height - (offsetY + Math.floor((point - min) * ky));
}
