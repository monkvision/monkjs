import { useMemo, useReducer } from 'react';
import sightsData from '@monkvision/sights/dist/native';

export const SET_PICTURE = 'SET_PICTURE';
export const REMOVE_PICTURE = 'REMOVE_PICTURE';
export const SET_CURRENT_SIGHT = 'SET_CURRENT_SIGHT';
export const PREVIOUS_SIGHT = 'PREVIOUS_SIGHT';
export const NEXT_SIGHT = 'NEXT_SIGHT';
export const RESET_TOUR = 'RESET_TOUR';

function init(initialState) {
  return initialState ? { ...initialState } : ({
    index: 0,
    takenPictures: {},
    currentSight: '',
  });
}

function reducer(state, action) {
  switch (action.type) {
    case SET_PICTURE:
      return {
        ...state,
        takenPictures: {
          ...state.takenPictures,
          [action.payload.id || state.currentSight]: action.payload.picture,
        },
      };

    case REMOVE_PICTURE:
      return {
        ...state,
        takenPictures: {
          ...state.takenPictures,
          [action.payload.id]: undefined,
        },
      };

    case SET_CURRENT_SIGHT:
      return {
        ...state,
        index: action.sightIds.findIndex((id) => id === action.payload),
        currentSight: action.payload,
      };

    case PREVIOUS_SIGHT:
      if (state.index === 0) { return state; }

      return {
        ...state,
        index: state.index - 1,
        currentSight: action.sightIds[state.index - 1],
      };

    case NEXT_SIGHT:
      if (state.index === action.sightIds.length - 1) { return state; }

      return {
        ...state,
        index: state.index + 1,
        currentSight: action.sightIds[state.index + 1],
      };

    case RESET_TOUR:
      return init(action.payload);

    default:
      throw new Error();
  }
}

export default function useSights(sightIds, initialState) {
  const [state, dispatch] = useReducer(reducer, initialState, init);

  const metadata = useMemo(
    () => Object.values(sightsData)
      .filter(({ id }) => sightIds.includes(id))
      .sort((a, b) => sightIds.indexOf(a.id) - sightIds.indexOf(b.id)),
    [sightIds],
  );

  const currentOverlay = useMemo(
    () => sightsData[state.currentSight]?.overlay,
    [state.currentSight],
  );

  return {
    state,
    dispatch: (action) => dispatch({ sightIds, metadata, ...action }),
    metadata,
    currentOverlay,
  };
}
