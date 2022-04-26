import { useReducer } from 'react';
import sightsData from '@monkvision/sights/dist';
import Actions from '../../actions';

function init({ sightIds, initialState }) {
  if (initialState) { return initialState; }

  const tour = Object.values(sightsData)
    .filter(({ id }) => sightIds.includes(id))
    .sort((a, b) => sightIds.indexOf(a.id) - sightIds.indexOf(b.id));

  const firstSight = tour[0];

  return ({
    current: {
      id: firstSight.id,
      index: 0,
      metadata: firstSight,
    },
    ids: sightIds,
    remainingPictures: sightIds.length,
    takenPictures: {},
    tour,
  });
}

function reducer(state, action) {
  const previousSight = state.ids[state.current.index - 1];
  const nextSight = state.ids[state.current.index + 1];
  let id = action?.payload?.id;

  switch (action.type) {
    case Actions.sights.SET_PICTURE:
      return {
        ...state,
        takenPictures: {
          ...state.takenPictures,
          [id || state.current.id]: action.payload.picture,
        },
      };

    case Actions.sights.REMOVE_PICTURE:
      return {
        ...state,
        takenPictures: {
          ...state.takenPictures,
          [action.payload.id]: undefined,
        },
      };

    case Actions.sights.PREVIOUS_SIGHT:
    case Actions.sights.NEXT_SIGHT:
    case Actions.sights.SET_CURRENT_SIGHT:
      if (action.type === Actions.sights.PREVIOUS_SIGHT) {
        if (state.current.index === 0) { return state; }
        id = previousSight;
      }
      if (action.type === Actions.sights.NEXT_SIGHT) {
        if (state.current.index === state.ids.length - 1) { return state; }
        id = nextSight;
      }

      return {
        ...state,
        current: {
          id,
          index: state.ids.findIndex((i) => i === id),
          metadata: sightsData[id],
        },
      };

    case Actions.sights.RESET_TOUR:
      return init(action.payload);

    default:
      throw new Error();
  }
}

/**
 * @param ids
 * @return {{
   * dispatch: (function({}): void),
   * name: string,
   * state: {current, ids, remainingPictures, takenPictures: {}, tour, },
 * }}
 */
export default function useSights({ sightIds, initialState }) {
  const [state, dispatch] = useReducer(reducer, { sightIds, initialState }, init);
  return { state, dispatch, name: 'sights' };
}
