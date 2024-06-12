jest.mock('../../../src/components/DynamicSVG/hooks', () => ({
  useJSXTransformAttributes: jest.fn(() => ({ width: '123' })),
  useCustomAttributes: jest.fn(() => ({ height: '456' })),
  useInnerHTML: jest.fn(() => 'test-inner-html'),
}));

import { render } from '@testing-library/react';
import {
  useCustomAttributes,
  useInnerHTML,
  useJSXTransformAttributes,
} from '../../../src/components/DynamicSVG/hooks';
import { SVGElement } from '../../../src';

describe('SVGElement component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should place the JSX instrisic tag of the given element', () => {
    const element = {
      tagName: 'svg',
      children: [],
      getAttribute: (a: string) => a,
    } as unknown as SVGSVGElement;

    const { unmount, container } = render(<SVGElement element={element} />);

    const svgEl = container.querySelector(element.tagName);
    expect(svgEl).toBeDefined();
    unmount();
  });

  it('should pass the proper props to the useJSXMapttributes hook', () => {
    const element = {
      tagName: 'svg',
      children: [],
      getAttribute: (a: string) => a,
    } as unknown as SVGSVGElement;

    const { unmount } = render(<SVGElement element={element} />);

    expect(useJSXTransformAttributes).toHaveBeenCalledWith(element);
    unmount();
  });

  it('should pass the proper props to the useCustomAttributes hook', () => {
    const element = {
      tagName: 'svg',
      children: [],
      getAttribute: (a: string) => a,
    } as unknown as SVGSVGElement;
    const groupIds = ['test-id', 'test-id-23'];
    const getAttributes = jest.fn();

    const { unmount } = render(
      <SVGElement element={element} groupIds={groupIds} getAttributes={getAttributes} />,
    );

    expect(useCustomAttributes).toHaveBeenCalledWith({ element, groupIds, getAttributes });
    unmount();
  });

  it('should pass the proper props to the useInnerHTML hook', () => {
    const element = {
      tagName: 'svg',
      children: [],
      getAttribute: (a: string) => a,
    } as unknown as SVGSVGElement;
    const groupIds = ['test-id', 'test-id-23'];
    const getInnerText = jest.fn();

    const { unmount } = render(
      <SVGElement element={element} groupIds={groupIds} getInnerText={getInnerText} />,
    );

    expect(useInnerHTML).toHaveBeenCalledWith({ element, groupIds, getInnerText });
    unmount();
  });

  it('should pass the attributes from the useJSXMapttributes hook down to the JSX tag', () => {
    const element = {
      tagName: 'svg',
      children: [],
      getAttribute: (a: string) => a,
    } as unknown as SVGSVGElement;

    const { unmount, container } = render(<SVGElement element={element} />);

    const svgEl = container.querySelector(element.tagName);
    expect(svgEl).toBeDefined();
    const attributes = (useCustomAttributes as jest.Mock)();
    Object.keys(attributes).forEach((attr) => {
      expect(svgEl?.getAttributeNames()).toContain(attr);
      expect(svgEl?.getAttribute(attr)).toEqual(attributes[attr]);
    });
    unmount();
  });

  it('should pass the attributes from the useCustomAttributes hook down to the JSX tag', () => {
    const element = {
      tagName: 'svg',
      children: [],
      getAttribute: (a: string) => a,
    } as unknown as SVGSVGElement;

    const { unmount, container } = render(<SVGElement element={element} />);

    const svgEl = container.querySelector(element.tagName);
    expect(svgEl).toBeDefined();
    const attributes = (useCustomAttributes as jest.Mock)();
    Object.keys(attributes).forEach((attr) => {
      expect(svgEl?.getAttributeNames()).toContain(attr);
      expect(svgEl?.getAttribute(attr)).toEqual(attributes[attr]);
    });
    unmount();
  });

  it('should pass down props to the JSX tag', () => {
    const element = {
      tagName: 'svg',
      children: [],
      getAttribute: (a: string) => a,
    } as unknown as SVGSVGElement;
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
    const element = {
      tagName: 'svg',
      children: [],
      getAttribute: (a: string) => a,
    } as unknown as SVGSVGElement;

    const { unmount, container } = render(<SVGElement element={element} />);

    const svgEl = container.querySelector(element.tagName);
    expect(svgEl).toBeDefined();
    expect(svgEl?.innerHTML).toEqual((useInnerHTML as jest.Mock)());
    unmount();
  });

  it('should create children SVGElement components', () => {
    const element = {
      tagName: 'svg',
      children: [
        { tagName: 'g', children: [], getAttribute: (a: string) => a },
        { tagName: 'path', children: [], getAttribute: (a: string) => a },
      ],
      getAttribute: (a: string) => a,
    } as unknown as SVGSVGElement;

    const { unmount, container } = render(<SVGElement element={element} />);

    const svgEl = container.querySelector(element.tagName);
    expect(svgEl).toBeDefined();
    Array.from(element.children).forEach((child) => {
      expect(svgEl?.querySelector(child.tagName)).toBeDefined();
    });
    unmount();
  });

  it('should pass the customization functions to the children component', () => {
    const element = {
      tagName: 'svg',
      children: [{ tagName: 'g', children: [], getAttribute: (a: string) => a }],
      getAttribute: (a: string) => a,
    } as unknown as SVGSVGElement;
    const getAttributes = jest.fn();
    const getInnerText = jest.fn();

    const { unmount } = render(
      <SVGElement element={element} getAttributes={getAttributes} getInnerText={getInnerText} />,
    );

    expect(useCustomAttributes).toHaveBeenCalledTimes(2);
    expect(useCustomAttributes).toHaveBeenCalledWith(
      expect.objectContaining({ element: element.children[0], getAttributes }),
    );
    expect(useInnerHTML).toHaveBeenCalledTimes(2);
    expect(useInnerHTML).toHaveBeenCalledWith(
      expect.objectContaining({ element: element.children[0], getInnerText }),
    );
    unmount();
  });
});
