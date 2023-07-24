import {API_ENDPOINT} from "../properties";
const requests = {};
/**
 * Request for data @param {string} url request
 * @returns {Array<*>} data
 */
export async function getData<T>(url: string): Promise<T[]> {
  if (requests[url]) {
    return requests[url];
  }
  const promise = fetch(API_ENDPOINT + url).then((res) => {
    if (res.ok) {
      return res.json();
    }
    throw new Error();
  }).finally(() => {
    delete requests[url];
  });
  requests[url] = promise;

  return promise;
}
