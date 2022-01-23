import { useMemo, useReducer } from 'react';
import sightsData from '@monkvision/sights/dist/native';

import Actions from '../../actions';
import Constants from '../../const';

function init(initialState) {
  return initialState ? { ...initialState } : ({
    index: 0,
    takenPictures: {},
    currentSight: '',
  });
}

function reducer(state, action) {
  const previousSight = action.sightIds[state.index - 1];
  const nextSight = action.sightIds[state.index + 1];

  switch (action.type) {
    case Actions.sights.SET_PICTURE:
      return {
        ...state,
        takenPictures: {
          ...state.takenPictures,
          [action.payload.id || state.currentSight]: action.payload.picture,
        },
      };

    case Actions.sights.REMOVE_PICTURE:
      // eslint-disable-next-line no-console
      if (!Constants.PRODUCTION) { console.log(`Remove picture for #${action.payload.id} sight`); }

      return {
        ...state,
        takenPictures: {
          ...state.takenPictures,
          [action.payload.id]: undefined,
        },
      };

    case Actions.sights.SET_CURRENT_SIGHT:
      // eslint-disable-next-line no-console
      if (!Constants.PRODUCTION) { console.log(`Set current sight to #${action.payload}`); }
      return {
        ...state,
        index: action.sightIds.findIndex((id) => id === action.payload),
        currentSight: action.payload,
      };

    case Actions.sights.PREVIOUS_SIGHT:
      if (state.index === 0) { return state; }

      // eslint-disable-next-line no-console
      if (!Constants.PRODUCTION) { console.log(`Going previous sight #${previousSight}`); }

      return {
        ...state,
        index: state.index - 1,
        currentSight: previousSight,
      };

    case Actions.sights.NEXT_SIGHT:
      if (state.index === action.sightIds.length - 1) { return state; }

      // eslint-disable-next-line no-console
      if (!Constants.PRODUCTION) { console.log(`Going next sight #${nextSight}`); }

      return {
        ...state,
        index: state.index + 1,
        currentSight: nextSight,
      };

    case Actions.sights.RESET_TOUR:
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
