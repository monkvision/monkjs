import { useCallback, useEffect, useReducer } from 'react';
import { createReducer } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const STARTED = 'started';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

const initialState = {
  error: false,
  isLoading: false,
  loading: 'idle',
  requestCount: 0,
  response: {},
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(STARTED, (state) => {
      state.error = false;
      state.isLoading = true;
      state.loading = 'pending';
      state.requestCount += 1;
      state.response = initialState.response;
    })
    .addCase(FULFILLED, (state, action) => {
      state.error = false;
      state.isLoading = false;
      state.loading = 'idle';
      state.response = action.payload;
    })
    .addCase(REJECTED, (state, action) => {
      state.error = true;
      state.isLoading = false;
      state.loading = 'idle';
      state.response = action.payload;
    });
});

export default function useRequest(asyncThunk) {
  const dispatch = useDispatch();
  const [state, setState] = useReducer(reducer, initialState);

  const request = useCallback(async () => {
    try {
      if (!state.isLoading) {
        setState({ type: STARTED });

        const originalPromiseResult = await dispatch(asyncThunk).unwrap();
        setState({ type: FULFILLED, payload: originalPromiseResult });
      }
    } catch (rejectedValueOrSerializedError) {
      setState({ type: REJECTED, payload: rejectedValueOrSerializedError });
    }
  }, [asyncThunk, dispatch, state.isLoading]);

  useEffect(() => {
    if (state.requestCount === 0) { request(); }
  }, [request, state.requestCount]);

  return { ...state, refresh: request };
}
