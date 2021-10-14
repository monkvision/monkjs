import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import getInspectionApi from './services/inspection';

export function getBaseQuery({ baseUrl, customHeaders = [] }) {
  return fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;

      headers.set('Access-Control-Allow-Origin', '*');
      customHeaders.forEach(([key, value]) => {
        headers.set(key, value);
      });

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  });
}

class MonkCore {
  constructor(baseQuery) {
    this._baseQuery = baseQuery;
    this._inspection = getInspectionApi(baseQuery);
  }

  get baseQuery() {
    return this._baseQuery;
  }

  get inspection() {
    return this._inspection;
  }
}

export default MonkCore;

export { default as Sight } from './classes/Sight';
