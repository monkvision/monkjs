jest.mock('../../../src/components/DynamicSVG/hooks', () => ({
  useXMLParser: jest.fn(() => ({ children: [{ tagName: 'svg' }] })),
}));

jest.mock('../../../src/components/DynamicSVG/SVGElement.tsx', () => ({
  SVGElement: jest.fn(() => <></>),
}));

import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { render } from '@testing-library/react';
import { useXMLParser } from '../../../src/components/DynamicSVG/hooks';
import { DynamicSVG, SVGElement } from '../../../src';

describe('DynamicSVG component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const svg = 'test-svg';

  it('should call the useXMLParser hook with the proper props', () => {
    const { unmount } = render(<DynamicSVG svg={svg} />);

    expect(useXMLParser).toHaveBeenCalledWith(svg);
    unmount();
  });

  it('should throw if the first children of the XML doc is not an SVG component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    (useXMLParser as jest.Mock).mockImplementationOnce(
      () => ({ children: [{ tagName: 'path' }] } as unknown as Document),
    );

    expect(() => render(<DynamicSVG svg={svg} />)).toThrowError();
    jest.spyOn(console, 'error').mockRestore();
  });

  it('should create an SVGElement component', () => {
    const { unmount } = render(<DynamicSVG svg={svg} />);

    expect(SVGElement).toHaveBeenCalled();
    unmount();
  });

  it('should pass the element to the SVGElement component', () => {
    const { unmount } = render(<DynamicSVG svg={svg} />);

    expectPropsOnChildMock(SVGElement, { element: (useXMLParser as jest.Mock)().children[0] });
    unmount();
  });

  it('should pass down props to the SVGElement component', () => {
    const extraProps = { width: 300, height: 123345 };
    const { unmount } = render(<DynamicSVG svg={svg} {...extraProps} />);

    expectPropsOnChildMock(SVGElement, extraProps);
    unmount();
  });
});
