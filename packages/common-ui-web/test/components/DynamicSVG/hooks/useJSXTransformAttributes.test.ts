const inlineStyleMock = { height: '34px' };
const transformInlineCssMock = jest.fn(() => inlineStyleMock);
jest.mock('../../../../src/components/DynamicSVG/hooks/utils', () => ({
  transformInlineCss: transformInlineCssMock,
}));

import { renderHook } from '@testing-library/react-hooks';
import { CSSProperties } from 'react';
import { useJSXTransformAttributes } from '../../../../src/components/DynamicSVG/hooks';

describe('useJSXTransformAttributes hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  function createElement(attributes: Record<string, string | CSSProperties>): Element {
    return {
      getAttributeNames: jest.fn(() => Object.keys(attributes)),
      getAttribute: jest.fn((key) => attributes[key]),
    } as unknown as Element;
  }

  function expectHookToMapAttributes(
    attributes: Record<string, string>,
    expected: Record<string, string | CSSProperties>,
  ): void {
    const element = createElement(attributes);

    const { result, unmount } = renderHook(useJSXTransformAttributes, { initialProps: element });

    expect(result.current).toEqual(expected);
    unmount();
  }

  it('should return the elements normal attributes', () => {
    const attributes = { width: '123', height: '456', tabindex: '77' };
    expectHookToMapAttributes(attributes, attributes);
  });

  it('should return attributes in camelCase', () => {
    expectHookToMapAttributes({ 'stroke-width': '123' }, { strokeWidth: '123' });
  });

  it('should properly map the name of the class attribute', () => {
    expectHookToMapAttributes({ class: 'test' }, { className: 'test' });
  });

  it('should properly map the name of the xml:space attribute', () => {
    expectHookToMapAttributes({ 'xml:space': 'test' }, { xmlSpace: 'test' });
  });

  it('should properly map the name of the data-name attribute', () => {
    expectHookToMapAttributes({ 'data-name': 'test' }, { dataname: 'test' });
  });

  it('should properly map the inline style attribute', () => {
    const style = 'border-width: 200px';
    expectHookToMapAttributes({ style }, { style: inlineStyleMock });
    expect(transformInlineCssMock).toHaveBeenCalledWith(style);
  });
});
