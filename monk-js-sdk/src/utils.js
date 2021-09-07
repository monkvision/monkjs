/**
 * @param param {any}
 * @param type {log|warn|error}
 * @returns {boolean}
 */
export function log(param, type = 'log') {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console[type](param);

    return true;
  }

  return false;
}

/**
 * @returns {function(): undefined}
 */
export function noop() {
  return () => undefined;
}

/**
 * @param functionAsync
 * @param callbacks {Callbacks}
 * @param payload {{}}
 * @returns {Promise<boolean>}
 */
export async function callAsync(functionAsync, callbacks, payload) {
  callbacks.setTitle(functionAsync.name);
  callbacks.onStart(payload);

  try {
    const response = await functionAsync(callbacks);
    callbacks.onSuccess({ response });
  } catch (error) {
    callbacks.onError({ error });
  }

  return true;
}
