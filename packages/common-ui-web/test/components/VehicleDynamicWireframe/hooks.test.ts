import { renderHook, act } from '@testing-library/react-hooks';
import { usePartsOverlay } from '../../../src/components/VehicleDynamicWireframe/hooks';
import {
  Dispatch,
  Reducer,
  ReducerAction,
  ReducerState,
  ReducerStateWithoutAction,
  useReducer,
} from 'react';
import React from 'react';
import { VehiclePart } from '@monkvision/types';

describe('usePartsOverlay hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should update selected parts via dispatch', () => {
    type ReduceSelectedParts = Reducer<
      Array<VehiclePart>,
      { type: 'push' | 'pop'; part: VehiclePart }
    >;
    const useReducerSpy = jest.spyOn(React, 'useReducer') as jest.SpyInstance<
      [ReducerState<ReduceSelectedParts>, Dispatch<ReducerAction<ReduceSelectedParts>>],
      [ReduceSelectedParts, ReducerState<ReduceSelectedParts>]
    >;
    renderHook(usePartsOverlay, { initialProps: [] });
    expect(useReducerSpy).toHaveBeenCalledTimes(1);
    if (useReducerSpy.mock.results[0].type === 'return') {
      const [state, dispatch] = useReducerSpy.mock.results[0].value;
      expect(state).toStrictEqual([]);
      act(() => dispatch({ type: 'push', part: VehiclePart.BACKGROUND }));
    }
    expect(useReducerSpy).toHaveBeenCalledTimes(2);
    if (useReducerSpy.mock.results[1].type === 'return') {
      const [state, dispatch] = useReducerSpy.mock.results[1].value;
      expect(state).toStrictEqual([VehiclePart.BACKGROUND]);
      act(() => dispatch({ type: 'pop', part: VehiclePart.BACKGROUND }));
      act(() => dispatch({ type: 'push', part: VehiclePart.BUMPER_FRONT }));
    }
    expect(useReducerSpy).toHaveBeenCalledTimes(4);
    if (useReducerSpy.mock.results[3].type === 'return') {
      const [state, dispatch] = useReducerSpy.mock.results[3].value;
      expect(state).toEqual([VehiclePart.BUMPER_FRONT]);
    }
  });

  it('should apply style and onClick for part with class car-part and selectable', () => {
    const { result } = renderHook(usePartsOverlay, { initialProps: [] });
    const getOverlayAttributes = result.current[1];
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.id = VehiclePart.ROOF;
    pathElement.classList.add('car-part', 'selectable');
    const attributes = getOverlayAttributes(pathElement, []);
    expect(attributes).toStrictEqual(
      expect.objectContaining({
        style: expect.objectContaining({
          display: 'block',
          pointerEvents: 'fill',
          cursor: 'pointer',
        }),
        onClick: expect.any(Function),
      }),
    );
  });

  it('should apply style but not onClick for path with class car-part and not selectable', () => {
    const { result } = renderHook(usePartsOverlay, { initialProps: [] });
    const getOverlayAttributes = result.current[1];
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.id = 'roof';
    pathElement.classList.add('car-part');
    const attributes = getOverlayAttributes(pathElement, []);
    expect(attributes.style!.display).toBe('block');
    expect(attributes.style!.cursor).toBeUndefined();
    expect(attributes.onClick).toBeUndefined();
  });

  it('should inherit the style for the group element', () => {
    const { result } = renderHook(usePartsOverlay, { initialProps: [] });
    const getOverlayAttributes = result.current[1];
    const groupElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    groupElement.classList.add('car-part', 'selectable');
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.id = 'roof';
    const attributes = getOverlayAttributes(pathElement, [groupElement]);
    expect(attributes.style!.display).toBe('block');
    expect(attributes.onClick).toBeUndefined();
    expect(attributes.style!.cursor).toBe('pointer');
  });
});
