import isPlainObject from '../isPlainObject';

/**
 * Take an ACTIONS const and return a string list.
 * @param actions {{key: string}}
 * @returns {string}
 */
export default function actionsToString(actions) {
  if (isPlainObject(actions)) {
    throw Error('actions (1) argument must be a plain object in actionsToString function');
  }

  return `{${Object.values(actions).join('|')}}`;
}
