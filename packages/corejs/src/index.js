import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import getInspectionApi from './services/inspection';
import json from './sights.json';

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

export const sights = {
  all: Object.values(json),
  combos: {
    withInterior: [
      json.abstractFront,
      json.abstractFrontRight,
      json.abstractFrontLateralRight,
      json.abstractMiddleLateralRight,
      json.abstractRearLateralRight,
      json.abstractRearRight,
      json.abstractRear,
      json.abstractRearLeft,
      json.abstractRearLateralLeft,
      json.abstractMiddleLateralLeft,
      json.abstractFrontLateralLeft,
      json.abstractFrontLeft,
      json.abstractDashboard,
      json.abstractInteriorFront,
      json.abstractInteriorRear,
      json.abstractTrunk,
    ],
  },
};
