import { useCallback, useEffect, useReducer } from 'react';
import { createReducer } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import noop from 'lodash.noop';

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

/**
   * NOTE(Ilyass):
   * Now we can pass the asyncThunk (customAsyncThunk) to request/refresh function by passing null
   * to the hook asyncThunk param, as well as we can pass some additional callbacks
   * (onStart...) to request/refresh.
   * (The additional callbacks will not override the ones received from the hook
   *  params, instead they will both be called)
   *  */
export default function useRequest(asyncThunk, callbacks = {}, shouldFetch = true) {
  const dispatch = useDispatch();
  const [state, setState] = useReducer(reducer, initialState);

  const request = useCallback(async (customAsyncThunk, additionalCallbacks = {}) => {
    const { onStart = noop, onSuccess = noop, onError = noop } = callbacks;

    try {
      if (!state.isLoading) {
        setState({ type: STARTED });
        if (additionalCallbacks?.onStart) { additionalCallbacks.onStart(); }
        onStart();

        const originalPromiseResult = await dispatch(asyncThunk || customAsyncThunk).unwrap();
        setState({ type: FULFILLED, payload: originalPromiseResult });
        if (additionalCallbacks?.onSuccess) { additionalCallbacks.onSuccess(); }
        onSuccess(originalPromiseResult);
      }
    } catch (rejectedValueOrSerializedError) {
      setState({ type: REJECTED, payload: rejectedValueOrSerializedError });
      if (additionalCallbacks?.onError) { additionalCallbacks.onError(); }
      onError(rejectedValueOrSerializedError);
    }
  }, [asyncThunk, callbacks, dispatch, state.isLoading]);

  useEffect(() => {
    if (state.requestCount === 0 && shouldFetch) { request(); }
  }, [request, shouldFetch, state.requestCount]);

  return { ...state, refresh: request, request };
}
