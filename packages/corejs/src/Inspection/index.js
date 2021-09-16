import { Callbacks } from 'helpers';

/**
 * @param payload {{
 *   params: { id: uuid },
 *   query: { showDeletedObjects: boolean },
 * }}
 * @param callbacks {Callbacks}
 * @param serverInstance {Root.serverInstance}
 * @returns {Promise<boolean>}
 */
export async function getInspectionAsync(
  payload = {},
  callbacks = new Callbacks([]),
  serverInstance = this.serverInstance,
) {
  // eslint-disable-next-line no-param-reassign
  callbacks.title = getInspectionAsync.name;
  callbacks.onStart(payload);

  try {
    const { params, query } = payload;
    const response = await serverInstance.get(`/inspections/${params.id}`, {
      params: {
        show_deleted_objects: query.showDeletedObjects,
      },
    });
    callbacks.onSuccess({ response });
  } catch (error) {
    callbacks.onError({ error });
  }
}

class Inspection {
  constructor(data) {
    // Don’t let Api Data Structure your JavaScript Applications
    // Use https://github.com/paularmstrong/normalizr
    const { id } = data;

    this.id = id;
  }
}

export default Inspection;
