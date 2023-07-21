/**
 * getISODate.
 * Returns date string in format YYYY-MM-DD, Ex: "1970-01-01"
 *
 * @param {Date} date - Date object
 * @returns {string} - Date string
 */
export const getISODate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * getYearFromISODate.
 * Returns full year from an ISO date string
 *
 * @param {string} date - date in ISO format
 * @returns {number} - full year
 */
export function getYearFromISODate(date: string): number {
  return parseInt(date.split("-")[0]);
}

/**
 * addDays
 * Returns Date String with added days
 * @param {string} dateString - date string in format YYYY-MM-DD
 * @param {number} days - number of days
 * @returns {string} - date string in format YYYY-MM-DD
 */
export function addDays(dateString: string, days: number): string {
  const date = new Date(dateString + "T00:00:00.000");
  date.setDate(date.getDate() + days);
  return getISODate(date);
}

/**
 * getFirstDayOfYear.
 *
 * @param {string} year - full year string, Ex: "1970"
 *  @returns {string} - date string, Ex: "1970-01-01"
 */
export function getFirstDayOfYear(year: string): string {
  return year + "-01-01";
}

/**
 * getLastDayOfYear.
 *
 * @param {string} year -full year string, Ex: "1970"
 * @returns {string} - date string, Ex: "1970-12-31"
 */
export function getLastDayOfYear(year: string): string {
  return year + "-12-31";
}


/**
 * getDifferenceInDays.
 * Returns two days difference in days
 *
 * @param {string} day1 - date string 1
 * @param {string} day2 - date string 2
 * @returns {number} - number of days
 */
export function getDifferenceInDays(day1: string, day2: string): number {
  const differenceInTime = new Date(day2).getTime() - new Date(day1).getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  return differenceInDays;
}
