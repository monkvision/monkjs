const attributesMock: Record<string, string> = { width: '123' };
const useJSXMapttributesMock = jest.fn(() => attributesMock);

const customAttributesMock: Record<string, string> = { height: '456' };
const useCustomAttributesMock = jest.fn(() => customAttributesMock);

const innerHTMLMock = 'test-inner-html';
const useInnerHTMLMock = jest.fn(() => innerHTMLMock);

const childrenGroupIdsMock = ['test-id'];
const useChildrenGroupIdsMock = jest.fn(() => childrenGroupIdsMock);

jest.mock('../../../src/components/DynamicSVG/hooks', () => ({
  useJSXMapttributes: useJSXMapttributesMock,
  useCustomAttributes: useCustomAttributesMock,
  useInnerHTML: useInnerHTMLMock,
  useChildrenGroupIds: useChildrenGroupIdsMock,
}));

import { render } from '@testing-library/react';
import { SVGElement } from '../../../src';
import {
  useChildrenGroupIds,
  useCustomAttributes,
  useInnerHTML,
} from '../../../src/components/DynamicSVG/hooks';

describe('SVGElement component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should place the JSX instrisic tag of the given element', () => {
    const element = { tagName: 'svg', children: [] } as unknown as Element;

    const { unmount, container } = render(<SVGElement element={element} />);

    const svgEl = container.querySelector(element.tagName);
    expect(svgEl).toBeDefined();
    unmount();
  });

  it('should pass the proper props to the useJSXMapttributes hook', () => {
    const element = { tagName: 'svg', children: [] } as unknown as Element;

    const { unmount } = render(<SVGElement element={element} />);

    expect(useJSXMapttributesMock).toHaveBeenCalledWith(element);
    unmount();
  });

  it('should pass the proper props to the useCustomAttributes hook', () => {
    const element = { tagName: 'svg', children: [] } as unknown as Element;
    const groupIds = ['test-id', 'test-id-23'];
    const getAttributes = jest.fn();

    const { unmount } = render(
      <SVGElement element={element} groupIds={groupIds} getAttributes={getAttributes} />,
    );

    expect(useCustomAttributesMock).toHaveBeenCalledWith({ element, groupIds, getAttributes });
    unmount();
  });

  it('should pass the proper props to the useInnerHTML hook', () => {
    const element = { tagName: 'svg', children: [] } as unknown as Element;
    const groupIds = ['test-id', 'test-id-23'];
    const getInnerText = jest.fn();

    const { unmount } = render(
      <SVGElement element={element} groupIds={groupIds} getInnerText={getInnerText} />,
    );

    expect(useInnerHTMLMock).toHaveBeenCalledWith({ element, groupIds, getInnerText });
    unmount();
  });

  it('should pass the proper props to the useChildrenGroupIds hook', () => {
    const element = { tagName: 'svg', children: [] } as unknown as Element;
    const groupIds = ['test-id', 'test-id-23'];

    const { unmount } = render(<SVGElement element={element} groupIds={groupIds} />);

    expect(useChildrenGroupIdsMock).toHaveBeenCalledWith({ element, groupIds });
    unmount();
  });

  it('should pass the attributes from the useJSXMapttributes hook down to the JSX tag', () => {
    const element = { tagName: 'svg', children: [] } as unknown as Element;

    const { unmount, container } = render(<SVGElement element={element} />);

    const svgEl = container.querySelector(element.tagName);
    expect(svgEl).toBeDefined();
    Object.keys(attributesMock).forEach((attr) => {
      expect(svgEl?.getAttributeNames()).toContain(attr);
      expect(svgEl?.getAttribute(attr)).toEqual(attributesMock[attr]);
    });
    unmount();
  });

  it('should pass the attributes from the useCustomAttributes hook down to the JSX tag', () => {
    const element = { tagName: 'svg', children: [] } as unknown as Element;

    const { unmount, container } = render(<SVGElement element={element} />);

    const svgEl = container.querySelector(element.tagName);
    expect(svgEl).toBeDefined();
    Object.keys(customAttributesMock).forEach((attr) => {
      expect(svgEl?.getAttributeNames()).toContain(attr);
      expect(svgEl?.getAttribute(attr)).toEqual(customAttributesMock[attr]);
    });
    unmount();
  });

  it('should pass down props to the JSX tag', () => {
    const element = { tagName: 'svg', children: [] } as unknown as Element;
    const props: Record<string, string> = { id: 'test-id', from: 'test-from' };

    const { unmount, container } = render(<SVGElement element={element} {...props} />);

    const svgEl = container.querySelector(element.tagName);
    expect(svgEl).toBeDefined();
    Object.keys(props).forEach((attr) => {
      expect(svgEl?.getAttributeNames()).toContain(attr);
      expect(svgEl?.getAttribute(attr)).toEqual(props[attr]);
    });
    unmount();
  });

  it('should set the inner HTML to the one from the useInnerHTML hook', () => {
    const element = { tagName: 'svg', children: [] } as unknown as Element;

    const { unmount, container } = render(<SVGElement element={element} />);

    const svgEl = container.querySelector(element.tagName);
    expect(svgEl).toBeDefined();
    expect(svgEl?.innerHTML).toEqual(innerHTMLMock);
    unmount();
  });

  it('should create children SVGElement components', () => {
    const element = {
      tagName: 'svg',
      children: [
        { tagName: 'g', children: [] },
        { tagName: 'path', children: [] },
      ],
    } as unknown as Element;

    const { unmount, container } = render(<SVGElement element={element} />);

    const svgEl = container.querySelector(element.tagName);
    expect(svgEl).toBeDefined();
    Array.from(element.children).forEach((child) => {
      expect(svgEl?.querySelector(child.tagName)).toBeDefined();
    });
    unmount();
  });

  it('should pass the group IDs to the children component', () => {
    const element = {
      tagName: 'svg',
      children: [{ tagName: 'g', children: [] }],
    } as unknown as Element;

    const { unmount } = render(<SVGElement element={element} />);

    expect(useChildrenGroupIdsMock).toHaveBeenCalledTimes(2);
    expect(useChildrenGroupIdsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        element: element.children[0],
        groupIds: childrenGroupIdsMock,
      }),
    );
    unmount();
  });

  it('should pass the customization functions to the children component', () => {
    const element = {
      tagName: 'svg',
      children: [{ tagName: 'g', children: [] }],
    } as unknown as Element;
    const getAttributes = jest.fn();
    const getInnerText = jest.fn();

    const { unmount } = render(
      <SVGElement element={element} getAttributes={getAttributes} getInnerText={getInnerText} />,
    );

    expect(useCustomAttributesMock).toHaveBeenCalledTimes(2);
    expect(useCustomAttributesMock).toHaveBeenCalledWith(
      expect.objectContaining({ element: element.children[0], getAttributes }),
    );
    expect(useInnerHTMLMock).toHaveBeenCalledTimes(2);
    expect(useInnerHTMLMock).toHaveBeenCalledWith(
      expect.objectContaining({ element: element.children[0], getInnerText }),
    );
    unmount();
  });
});
