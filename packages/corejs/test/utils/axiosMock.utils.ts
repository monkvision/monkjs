import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import { snakeCase } from 'lodash';
import mapKeysDeep from 'map-keys-deep-lodash';

/**
 * The type alias for a jest spy on the axios.request() method.
 * *Response* - The type of the response body.
 */
export type AxiosRequestSpy<ResponseType = unknown> =
  jest.SpyInstance<Promise<AxiosResponse<ResponseType>>, [config: AxiosRequestConfig]>;

/**
 * Mock the axios.request() method with the given response body.<br><br>
 * ⚠ **WARNING** ⚠ In order for this method to properly mock the axios request method, the `axios` package must be
 * previously mocked. This means that you need to add `jest.mock('axios')` at the start of your file.
 * @param responseBody The body of the response that the mocked method will always return (the keys of the body will be
 * mapped to snake case in order to replicate the response model of the back-end).
 * @param [status] The status of the response.
 * @param [statusText] The status text of the response.
 * @return A Jest spy of the axios.request() method and the response returned.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function mockAxiosRequest<T extends Object>(
  responseBody: T,
  status = 200,
  statusText = 'OK',
): { response: AxiosResponse<T>, spy: AxiosRequestSpy<T> } {
  const response: AxiosResponse<T> = {
    data: mapKeysDeep(responseBody, (v, k) => snakeCase(k)) as unknown as T,
    status,
    statusText,
    headers: {},
    config: {},
  };
  jest.spyOn(axios, 'create').mockImplementation((): AxiosInstance => axios);
  return {
    response,
    spy: jest.spyOn(axios, 'request').mockImplementation(() => Promise.resolve(response)) as AxiosRequestSpy<T>,
  };
}
