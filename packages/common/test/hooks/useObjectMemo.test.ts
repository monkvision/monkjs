import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useObjectMemo } from '../../src';

describe('useObjectMemo hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the object passed as a param', () => {
    const obj = { ok: 'hello', ees: 24, few: undefined };
    const { result, unmount } = renderHook(useObjectMemo, { initialProps: obj });

    expect(result.current).toEqual(obj);

    unmount();
  });

  it('should call useMemo with a function generating the object passed as a param', () => {
    const spy = jest.spyOn(React, 'useMemo');
    const obj = { hello: 'world', test: 24, ok: null };
    const { unmount } = renderHook(useObjectMemo, { initialProps: obj });

    expect(spy).toHaveBeenCalledWith(expect.any(Function), expect.anything());
    const generateFn = spy.mock.calls[0][0];
    expect(generateFn()).toEqual(obj);

    unmount();
  });

  it('should pass the object values in the useMemo dependencies', () => {
    const spy = jest.spyOn(React, 'useMemo');
    const obj = { cdf: 'world', ewf: 223, efgg: undefined, qdok: null, asd: 24 };
    const { unmount } = renderHook(useObjectMemo, { initialProps: obj });

    expect(spy).toHaveBeenCalledWith(expect.anything(), expect.arrayContaining(Object.values(obj)));

    unmount();
  });
});
