import axios from 'axios';
import callAsync from 'utils/callAsync';

/**
 * @param payload {{
 *   params: { id: uuid },
 *   query: { showDeletedObjects: boolean },
 * }}
 * @param callbacks {Callbacks}
 * @returns {Promise<boolean>}
 */
export function getInspectionAsync(payload = {}, callbacks) {
  const { params, query } = payload;

  const functionAsync = () => {
    axios.get(`/inspections/${params.id}`, {
      params: {
        show_deleted_objects: query.showDeletedObjects,
      },
    });
  };

  return callAsync(functionAsync, callbacks, payload);
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
