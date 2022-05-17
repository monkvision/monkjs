import { useReducer } from 'react';

import Actions from '../../actions';

function init({ sightIds, initialState }) {
  if (initialState) { return initialState; }

  const state = {};
  const initialUploadState = { picture: null, status: 'idle', pictureId: null, error: null, uploadCount: 0 };

  sightIds.forEach((id) => {
    state[id] = { id, ...initialUploadState };
  });

  return state;
}

function reducer(state, action) {
  if (action.type === Actions.uploads.RESET_UPLOADS) {
    return init(action.ids);
  }

  const { id } = action.payload;
  const prevUpload = state[id];

  if (!prevUpload) {
    throw new Error(`Missing ID in uploads state. Got ${action.payload.id}`);
  }

  let { uploadCount } = prevUpload;
  if (action.increment) {
    uploadCount = prevUpload.uploadCount + 1;
  }

  switch (action.type) {
    case Actions.uploads.UPDATE_UPLOAD:
      return ({
        ...state,
        [id]: { ...prevUpload, uploadCount, ...action.payload },
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
   * state: { picture, status: string, pictureId: string, error: null, uploadCount: number }
 * }}
 */
export default function useUploads({ sightIds, initialState }) {
  const [state, dispatch] = useReducer(reducer, { sightIds, initialState }, init);
  return { state, dispatch, name: 'uploads' };
}
