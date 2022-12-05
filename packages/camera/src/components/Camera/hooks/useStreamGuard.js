import { useEffect, useReducer } from 'react';

const STREAM_GUARD_CHECK_INTERVAL = 300;
const STREAM_GUARD_ALLOWED_INACTIVE_CHECKS = 2;
const STREAM_GUARD_ACTIONS = {
  NEW_STREAM: 0,
  INACTIVE_STREAM: 1,
  CLEANUP: 2,
};

/**
 * In Safari, calling `navigator.mediaDevices.getUserMedia()` closes previous streams created
 * by this method. Because of this, if someone using this package calls this method *after*
 * we created our stream, our stream will be cut off. To prevent this, we added a warning
 * about this behaviour in our documentation, and we created this hook, that periodically
 * checks if Monk's stream is still active. If not, we create a new one.
 *
 * Note : onStreamFailing should never change because the resulting callback is not updated.
 */
export default function useStreamGuard(stream, onStreamFailing) {
  const initialState = { stream: null, allowedInactiveChecks: 0, intervalId: null };
  const [, dispatch] = useReducer((state, action) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case STREAM_GUARD_ACTIONS.NEW_STREAM: {
        if (state.intervalId) {
          clearInterval(state.intervalId);
        }
        if (!action.stream) {
          return initialState;
        }
        const intervalId = setInterval(() => {
          if (!stream.active) {
            dispatch({ type: STREAM_GUARD_ACTIONS.INACTIVE_STREAM, stream: action.stream });
          }
        }, STREAM_GUARD_CHECK_INTERVAL);
        return {
          stream: action.stream,
          allowedInactiveChecks: stream.active ? 0 : STREAM_GUARD_ALLOWED_INACTIVE_CHECKS,
          intervalId,
        };
      }
      case STREAM_GUARD_ACTIONS.INACTIVE_STREAM: {
        if (state.stream !== action.stream) {
          return state;
        }
        if (state.allowedInactiveChecks > 0) {
          return { ...state, allowedInactiveChecks: state.allowedInactiveChecks - 1 };
        }
        onStreamFailing();
        if (state.intervalId) {
          clearInterval(state.intervalId);
        }
        return initialState;
      }
      case STREAM_GUARD_ACTIONS.CLEANUP: {
        if (action.stream !== state.stream) {
          return state;
        }
        if (state.intervalId) {
          clearInterval(state.intervalId);
        }
        return initialState;
      }
      default: {
        console.warn('Unexpected action dispatched in useStreamGuard.js :', action.type);
        return state;
      }
    }
  }, initialState);

  useEffect(() => {
    dispatch({ type: STREAM_GUARD_ACTIONS.NEW_STREAM, stream });
    return () => dispatch({ type: STREAM_GUARD_ACTIONS.CLEANUP, stream });
  }, [stream]);
}
