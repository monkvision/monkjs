import { createRef, RefObject } from 'react';
import { getCanvasHandle } from '../../../../src/Camera/hooks/utils';

describe('getCanvasHandle util function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a 2D context with the proper options', () => {
    const context = {};
    const ref = {
      current: { getContext: jest.fn(() => context) },
    } as unknown as RefObject<HTMLCanvasElement>;

    const result = getCanvasHandle(ref);

    expect(ref.current?.getContext).toHaveBeenCalledWith('2d', {
      alpha: false,
      willReadFrequently: true,
    });
    expect(result.canvas).toBe(ref.current);
    expect(result.context).toBe(context);
  });

  it('should throw an error if the ref is null', () => {
    const ref = createRef<HTMLCanvasElement>(); // This will be { current: null } initially
    const onError = jest.fn();
    expect(() => getCanvasHandle(ref, onError)).toThrow();
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should throw an error if the context is null', () => {
    const ref = {
      current: { getContext: jest.fn(() => null) },
    } as unknown as RefObject<HTMLCanvasElement>;
    const onError = jest.fn();

    expect(() => getCanvasHandle(ref, onError)).toThrow();
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });
});
