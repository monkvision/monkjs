import Constants from '../../const';

/**
 * @param params {[*]}
 * @param severity {'log'|'warn'|'error'}
 */
export default function log(params = [], severity = 'log') {
  // eslint-disable-next-line no-console
  if (!Constants.PRODUCTION) { console[severity](...params); }
}
