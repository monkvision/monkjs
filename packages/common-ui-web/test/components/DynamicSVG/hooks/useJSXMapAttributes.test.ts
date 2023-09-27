import { renderHook } from '@testing-library/react';
import { useJSXMapttributes } from '../../../../src/components/DynamicSVG/hooks';

describe('useJSXMapttributes hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const attributes: Record<string, string> = { width: '123', height: '456', tabindex: '77' };
  const specialAttributes: Record<string, string> = { class: 'className' };

  it('should return the elements normal attributes', () => {
    const element = {
      getAttributeNames: jest.fn(() => Object.keys(attributes)),
      getAttribute: jest.fn((key) => attributes[key]),
    } as unknown as Element;

    const { result, unmount } = renderHook(useJSXMapttributes, { initialProps: element });

    expect(result.current).toEqual(attributes);
    unmount();
  });

  Object.keys(specialAttributes).forEach((specialAttr) => {
    it(`should properly map the '${specialAttr}' attribute`, () => {
      const value = 'test-special-value';
      const element = {
        getAttributeNames: jest.fn(() => [...Object.keys(attributes), specialAttr]),
        getAttribute: jest.fn((key) => (key === specialAttr ? value : attributes[key])),
      } as unknown as Element;

      const { result, unmount } = renderHook(useJSXMapttributes, { initialProps: element });

      expect(result.current).toEqual({ ...attributes, [specialAttributes[specialAttr]]: value });
      unmount();
    });
  });
});
