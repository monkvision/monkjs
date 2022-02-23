import { useReducer } from 'react';

import Actions from '../../actions';

function init({ sightIds, initialState }) {
  if (initialState) { return initialState; }

  const state = {};
  const initialComplianceState = { id: '', status: 'idle', error: null, requestCount: 0, result: null };

  sightIds.forEach((id) => {
    state[id] = { id, ...initialComplianceState };
  });

  return state;
}

function reducer(state, action) {
  if (action.type === Actions.compliance.RESET_COMPLIANCE) {
    return init(action.ids);
  }

  const { id } = action.payload;
  const prevCompliance = state[id];

  let requestCount = 0;

  if (action.increment) {
    if (prevCompliance) {
      requestCount = prevCompliance.requestCount;
    }
    requestCount += 1;
  }

  switch (action.type) {
    case Actions.compliance.UPDATE_COMPLIANCE:
      return ({
        ...state,
        [id]: { ...prevCompliance, ...action.payload, requestCount },
      });

    default:
      throw new Error();
  }
}

/**
 * @param ids
 * @return {{
   * dispatch: (function({}): void),
   * name: string,
   * state: {status: string, error, requestCount: number, result: {
     * binary_size: number,
     * compliances: {
       * iqc_compliance: {
         * is_compliant: boolean,
         * reason: string,
         * status: string,
       * },
     * },
     * id: string,
     * image_height: number,
     * image_width: number,
     * name: string,
     * path: string
    * },
  * },
 * }}
 */
export default function useCompliance({ sightIds, initialState }) {
  const [state, dispatch] = useReducer(reducer, { sightIds, initialState }, init);
  return { state, dispatch, name: 'compliance' };
}
