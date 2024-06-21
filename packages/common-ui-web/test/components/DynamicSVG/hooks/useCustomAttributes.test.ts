import { renderHook } from '@testing-library/react-hooks';
import { useCustomAttributes } from '../../../../src/components/DynamicSVG/hooks';

describe('useCustomAttributes hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should remove the pointer events of svg tags', () => {
    const element = { tagName: 'svg' } as unknown as SVGSVGElement;

    const { result, unmount } = renderHook(useCustomAttributes, {
      initialProps: { element, groupIds: [], style: {} },
    });

    expect(result.current).toEqual({ pointerEvents: 'box-none' });
    unmount();
  });

  it('should remove the pointer events of g tags', () => {
    const element = { tagName: 'g' } as unknown as SVGSVGElement;

    const { result, unmount } = renderHook(useCustomAttributes, {
      initialProps: { element, groupIds: [], style: {} },
    });

    expect(result.current).toEqual({ pointerEvents: 'box-none' });
    unmount();
  });

  it('should return null if no customization function is passed', () => {
    const element = { tagName: 'path' } as unknown as SVGSVGElement;

    const { result, unmount } = renderHook(useCustomAttributes, {
      initialProps: { element, groupIds: [], style: {} },
    });

    expect(result.current).toEqual({ style: {} });
    unmount();
  });

  it('should return the result of the customization function', () => {
    const element = { tagName: 'path' } as unknown as SVGSVGElement;
    const groupIds = ['test-id-1', 'test-id-2'];
    const customAttr = { style: { color: 'test-color' } };
    const getAttributes = jest.fn(() => customAttr);

    const { result, unmount } = renderHook(useCustomAttributes, {
      initialProps: { element, groupIds, getAttributes, style: customAttr.style },
    });

    expect(getAttributes).toHaveBeenCalledWith(element, groupIds);
    expect(result.current).toEqual(customAttr);
    unmount();
  });

  it('should apply style correctly', () => {
    const elementStyle = { stroke: '#fff' },
      customStyle = { color: 'test-color' };
    const element = { tagName: 'path', style: { stroke: '#fff' } } as SVGSVGElement;
    const groupIds = ['test-id-1', 'test-id-2'];
    const getAttributes = jest.fn(() => ({ style: customStyle }));
    const { result, unmount } = renderHook(useCustomAttributes, {
      initialProps: { element, groupIds, getAttributes, style: elementStyle },
    });
    expect(getAttributes).toHaveBeenCalledWith(element, groupIds);
    expect(result.current).toEqual({ style: { ...elementStyle, ...customStyle } });
    unmount();
  });
});
