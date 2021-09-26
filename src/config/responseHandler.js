import { isPlainObject } from '@reduxjs/toolkit';
import camelCase from 'lodash.camelcase';
import mapKeys from 'lodash.mapkeys';

export default function responseHandler(response) {
  const { data } = response.json();

  if (isPlainObject(data)) {
    return mapKeys(data, (v, k) => camelCase(k));
  }

  return { ...response, data };
}
