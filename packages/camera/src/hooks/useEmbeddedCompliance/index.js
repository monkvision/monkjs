import { useReducer } from 'react';

import Actions from '../../actions';

function init({ sightIds, initialState }) {
  if (initialState) { return initialState; }

  const state = {};
  const initialComplianceState = {
    id: '', // sight ID
    result: null,
  };

  sightIds.forEach((id) => {
    state[id] = { ...initialComplianceState, id };
  });

  return state;
}

function reducer(state, action) {
  if (action.type === Actions.embeddedCompliance.RESET_EMBEDDED_COMPLIANCE) {
    return init(action.ids);
  }

  const { id } = action.payload;
  const prevCompliance = state[id];

  switch (action.type) {
    case Actions.embeddedCompliance.UPDATE_EMBEDDED_COMPLIANCE:
      return ({
        ...state,
        [id]: { ...prevCompliance, ...action.payload },
      });

    default:
      throw new Error('Received an unknown action type, in "useEmbeddedCompliance"');
  }
}

export default function useEmbeddedCompliance({ sightIds, initialState }) {
  const [state, dispatch] = useReducer(reducer, { sightIds, initialState }, init);
  return { state, dispatch, name: 'embeddedCompliance' };
}
