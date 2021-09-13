/**
 * @param functionAsync
 * @param callbacks {Callbacks}
 * @param payload {{}}
 * @returns {Promise<boolean>}
 */
export default async function callAsync(functionAsync, callbacks, payload) {
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
