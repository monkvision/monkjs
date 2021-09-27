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
  constructor({ baseUrl, customHeaders }) {
    this._baseUrl = baseUrl;
    this._customHeaders = customHeaders;
  }

  get baseUrl() {
    return this._baseUrl;
  }

  set baseUrl(value) {
    this._baseUrl = value;
  }

  get customHeaders() {
    return this._customHeaders;
  }

  set customHeaders(value) {
    this._customHeaders = value;
  }

  get inspection() {
    const baseQuery = getBaseQuery({
      baseUrl: this.baseUrl,
      customHeaders: this.customHeaders,
    });

    return getInspectionApi(baseQuery);
  }
}

export default MonkCore;
