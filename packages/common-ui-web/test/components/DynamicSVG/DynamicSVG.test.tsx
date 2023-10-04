const SVG_ELEMENT_MOCK_TEST_ID = 'svg-element-test';

const documentMock = { children: [{ tagName: 'svg' }] } as unknown as Document;
const useXMLParserMock = jest.fn(() => documentMock);

jest.mock('../../../src/components/DynamicSVG/hooks', () => ({
  useXMLParser: useXMLParserMock,
}));

const SVGElementMock = jest.fn(() => <div data-testid={SVG_ELEMENT_MOCK_TEST_ID}></div>);

jest.mock('../../../src/components/DynamicSVG/SVGElement.tsx', () => ({
  SVGElement: SVGElementMock,
}));

import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { render, screen } from '@testing-library/react';
import { DynamicSVG } from '../../../src';

describe('DynamicSVG component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const svg = 'test-svg';

  it('should call the useXMLParser hook with the proper props', () => {
    const { unmount } = render(<DynamicSVG svg={svg} />);

    expect(useXMLParserMock).toHaveBeenCalledWith(svg);
    unmount();
  });

  it('should throw if the first children of the XML doc is not an SVG component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    useXMLParserMock.mockImplementation(
      () => ({ children: [{ tagName: 'path' }] } as unknown as Document),
    );

    expect(() => render(<DynamicSVG svg={svg} />)).toThrowError();
    useXMLParserMock.mockImplementation(() => documentMock);
    jest.spyOn(console, 'error').mockRestore();
  });

  it('should create an SVGElement component', () => {
    const { unmount } = render(<DynamicSVG svg={svg} />);

    expect(screen.queryByTestId(SVG_ELEMENT_MOCK_TEST_ID)).toBeDefined();
    unmount();
  });

  it('should pass the element to the SVGElement component', () => {
    const { unmount } = render(<DynamicSVG svg={svg} />);

    expectPropsOnChildMock(SVGElementMock, { element: documentMock.children[0] });
    unmount();
  });

  it('should pass down props to the SVGElement component', () => {
    const extraProps = { width: 300, height: 123345 };
    const { unmount } = render(<DynamicSVG svg={svg} {...extraProps} />);

    expectPropsOnChildMock(SVGElementMock, extraProps);
    unmount();
  });
});
