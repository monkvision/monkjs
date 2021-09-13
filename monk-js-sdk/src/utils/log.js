/**
 * @param param {any}
 * @param type {log|warn|error}
 * @returns {boolean}
 */
export default function log(param, type = 'log') {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console[type](param);

    return true;
  }

  return false;
}
