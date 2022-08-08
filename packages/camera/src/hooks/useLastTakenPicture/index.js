import { useReducer } from 'react';
import Actions from '../../actions';

function init() {
  return {
    picture: undefined,
    sightId: undefined,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case Actions.lastTakenPicture.SET_PICTURE:
      return action.payload;

    case Actions.lastTakenPicture.CLEAR:
      return null;

    default:
      throw new Error();
  }
}

export default function useLastTakenPicture() {
  const [state, dispatch] = useReducer(reducer, null, init);
  return { state, dispatch, name: 'lastTakenPicture' };
}
