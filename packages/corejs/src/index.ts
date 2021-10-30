import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import getInspectionApi from "./services/inspection";

export { default as values } from "./values";
export { default as Sight } from "./classes/Sight";

export function getBaseQuery({
  baseUrl,
  customHeaders = [],
}: {
  baseUrl: string;
  customHeaders: any;
}) {
  return fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers: any, { getState }: any) => {
      const token = getState().auth.accessToken;

      headers.set("Access-Control-Allow-Origin", "*");
      customHeaders.forEach(([key, value]: [string, string]) => {
        headers.set(key, value);
      });

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  });
}

class MonkCore {
  _baseQuery: any;
  _inspection: any;

  constructor(baseQuery: any) {
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
