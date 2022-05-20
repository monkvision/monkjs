import { useReducer } from 'react';
import monk from '@monkvision/corejs';

import actions from '../../config/actions';

function init(ids) {
  const state = {};
  const initialUploadState = { picture: null, status: 'idle', error: null, uploadCount: 0 };

  ids.forEach((id) => {
    state[id] = { id, ...initialUploadState };
  });

  return state;
}

function reducer(state, action) {
  if (action.type === actions.uploads.RESET) {
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
    case actions.uploads.UPDATE:
      return ({
        ...state,
        [id]: { ...prevUpload, ...action.payload, uploadCount },
      });

    default:
      throw new Error();
  }
}

export default function useUploads(ids) {
  return useReducer(reducer, ids, init);
}

export async function handleUpload(payload, state, dispatch, callback) {
  const { picture, sights, inspectionId } = payload;

  if (!inspectionId) {
    throw Error(`Please provide a valid "inspectionId". Got ${inspectionId}.`);
  }

  const { id, label } = sights.current.metadata;
  const { uri } = picture;

  try {
    dispatch({
      type: actions.uploads.UPDATE,
      increment: true,
      payload: { id, picture, status: 'pending', label },
    });

    const filename = `${id}-${inspectionId}.jpg`;
    const multiPartKeys = { image: 'image', json: 'json', filename, type: 'image/jpg' };

    const acquisition = { strategy: 'upload_multipart_form_keys', file_key: multiPartKeys.image };
    const json = JSON.stringify({
      acquisition,
      tasks: [monk.types.TaskName.DAMAGE_DETECTION],
      additional_data: {
        ...sights.current.metadata,
        width: picture.width,
        height: picture.height,
        exif: picture.exif,
        overlay: undefined,
      },
    });

    const data = new FormData();
    data.append(multiPartKeys.json, json);

    const blobUri = await fetch(uri);
    const blob = await blobUri.blob();
    const file = await new File(
      [blob],
      multiPartKeys.filename,
      { type: multiPartKeys.type },
    );

    data.append(multiPartKeys.image, file);

    await monk.entity.image.addOne(inspectionId, data);

    dispatch({
      type: actions.uploads.UPDATE,
      payload: { id, status: 'fulfilled' },
    });

    callback(payload, 'success');
  } catch (err) {
    dispatch({
      type: actions.uploads.UPDATE,
      increment: true,
      payload: { id, status: 'error', error: err },
    });

    callback(payload, 'error', err);
  }
}
