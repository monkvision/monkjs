import { renderHook } from '@testing-library/react';
import { useCustomAttributes } from '../../../../src/components/DynamicSVG/hooks';

describe('useCustomAttributes hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should remove the pointer events of svg tags', () => {
    const element = { tagName: 'svg' } as unknown as SVGSVGElement;

    const { result, unmount } = renderHook(useCustomAttributes, {
      initialProps: { element, groups: [], style: {} },
    });

    expect(result.current).toEqual({ pointerEvents: 'box-none' });
    unmount();
  });

  it('should remove the pointer events of g tags', () => {
    const element = { tagName: 'g' } as unknown as SVGSVGElement;

    const { result, unmount } = renderHook(useCustomAttributes, {
      initialProps: {
        element,
        groups: [],
        style: {},
        getAttributes: jest.fn().mockReturnValue({}),
      },
    });

    expect(result.current).toEqual({ pointerEvents: 'box-none', style: {} });
    unmount();
  });

  it('should return null if no customization function is passed', () => {
    const element = { tagName: 'path' } as unknown as SVGSVGElement;

    const { result, unmount } = renderHook(useCustomAttributes, {
      initialProps: { element, groups: [], style: {} },
    });

    expect(result.current).toEqual({ style: {} });
    unmount();
  });

  it('should return the result of the customization function', () => {
    const element = { tagName: 'path' } as unknown as SVGSVGElement;
    const groups = [{ id: 'test-id-1' }, { id: 'test-id-2' }] as SVGGElement[];
    const customAttr = { style: { color: 'test-color' } };
    const getAttributes = jest.fn(() => customAttr);

    const { result, unmount } = renderHook(useCustomAttributes, {
      initialProps: { element, groups, getAttributes, style: customAttr.style },
    });

    expect(getAttributes).toHaveBeenCalledWith(element, groups);
    expect(result.current).toEqual(customAttr);
    unmount();
  });

  it('should apply style correctly', () => {
    const elementStyle = { stroke: '#fff' },
      customStyle = { color: 'test-color' };
    const element = { tagName: 'path', style: { stroke: '#fff' } } as SVGSVGElement;
    const groups = [{ id: 'test-id-1' }, { id: 'test-id-2' }] as SVGGElement[];
    const getAttributes = jest.fn(() => ({ style: customStyle }));
    const { result, unmount } = renderHook(useCustomAttributes, {
      initialProps: { element, groups, getAttributes, style: elementStyle },
    });
    expect(getAttributes).toHaveBeenCalledWith(element, groups);
    expect(result.current).toEqual({ style: { ...elementStyle, ...customStyle } });
    unmount();
  });
});
