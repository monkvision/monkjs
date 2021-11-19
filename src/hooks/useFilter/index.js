import isEmpty from 'lodash.isempty';
import isArray from 'lodash.isArray';
import { useMemo, useCallback } from 'react';

/**
 * @name useFilter
 * filter with the given query a list of any objects with the given keys properties
 * Use to filter vehicles list by keys
 * For filtering inspections merge all the inspections vehicle properties into an array
 * Return an array containing the matching items.
 *
 * @param {Array<string>} keys - e.g ['vin', 'brand', 'id']
 * @param {string} query - search query
 * @param {Array<Object>} items - e.g [vehicles]
 * @param {number} [startAt] - optional minimal query length
 *
 * @returns {Array<Object>}
 */
export default function useFilter(keys, query, items, startAt = 1) {
  if (!isArray(keys) || !isArray(items)) {
    throw Error(`filterBy(keys:${typeof keys}, ...items:${typeof items}) error check arguments`);
  }

  const filterByKey = useCallback(() => {
    let filterList = [...items];
    if (isEmpty(query) || query?.length < startAt) { return items; }
    // eslint-disable-next-line no-restricted-syntax
    for (const key of keys) {
      const regex = new RegExp(`${query.trim()}`, 'i');
      filterList = filterList.filter(
        (item) => (key in item) && item[key].search(regex) >= 0,
      );
      if (isEmpty(filterList)) { filterList = items; } else { break; }
    }
    return filterList;
  }, [items, query, startAt, keys]);

  return useMemo(
    () => filterByKey(),
    [filterByKey],
  );
}
