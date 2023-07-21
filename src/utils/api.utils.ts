import {API_ENDPOINT} from "../properties";
/**
 * Request for data @param {string} url request
 * @returns {Array<*>} data
 */
export async function getData<T>(url: string): Promise<T[]> {
    const res = await fetch(API_ENDPOINT + url);

    if (res.ok) {
        return await res.json();
    }

    throw new Error();
}
