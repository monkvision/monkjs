import { useReducer } from 'react';
import sightsData from '@monkvision/sights/dist';

import Actions from '../../actions';
import log from '../../utils/log';

function init(ids) {
  const tour = Object.values(sightsData)
    .filter(({ id }) => ids.includes(id))
    .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));

  const firstSight = tour[0];

  return ({
    current: {
      id: firstSight.id,
      index: 0,
      metadata: firstSight,
    },
    ids,
    remainingPictures: ids.length,
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
      log([`Remove picture for #${id} sight`]);

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
        log([`Going previous sight #${previousSight}`]);
        id = previousSight;
      }
      if (action.type === Actions.sights.NEXT_SIGHT) {
        if (state.current.index === state.ids.length - 1) { return state; }
        log([`Going next sight #${nextSight}`]);
        id = nextSight;
      }

      log([`Set current sight to #${id}`]);

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

export default function useSights(ids) {
  return useReducer(reducer, ids, init);
}
