import { useReducer } from 'react';
import Actions from '../../actions';

function init() {
  return { takenPictures: [] };
}

function reducer(state, action) {
  switch (action.type) {
    case Actions.additionalPictures.ADD_PICTURE:
      return {
        takenPictures: [...state.takenPictures, action.payload],
      };

    case Actions.additionalPictures.RESET_TOUR:
      return init();

    default:
      throw new Error();
  }
}

export default function useAdditionalPictures() {
  const [state, dispatch] = useReducer(reducer, null, init);
  return { state, dispatch, name: 'additionalPictures' };
}
