import isPlainObject from 'lodash.isplainobject';

function formatAxiosConfig(axiosConfig, getState) {
  const config = { headers: { 'Access-Control-Allow-Origin': '*' }, ...axiosConfig };

  if (typeof getState === 'function') {
    const stateToken = getState().auth.accessToken;
    if (stateToken) {
      config.headers.Authorization = `Bearer ${stateToken}`;
    }
  }

  return config;
}

/**
 * @link https://axios-http.com/docs/req_config
 * @param arg
 * @param getState
 * @returns {[*, (*&{headers: {'Access-Control-Allow-Origin': string}})]}
 */
export default (arg = {}, getState) => {
  if (!isPlainObject(arg)) {
    throw Error('Parameter `arg` must be a plain object.');
  }

  return formatAxiosConfig(arg, getState);
};
