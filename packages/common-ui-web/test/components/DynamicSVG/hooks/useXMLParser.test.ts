const mockDocument = { test: 'test-value' } as unknown as Document;
const parseFromStringMock = jest.fn(() => mockDocument);
class DOMParserMock {
  parseFromString = parseFromStringMock;
}
Object.defineProperty(global, 'DOMParser', {
  value: DOMParserMock,
  configurable: true,
  writable: true,
});

import { renderHook } from '@testing-library/react-hooks';
import { useXMLParser } from '../../../../src/components/DynamicSVG/hooks';

describe('useXMLParser hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the parsed XML string using a DOMParser', () => {
    const xml = 'xml-string-test';

    const { result, unmount } = renderHook(useXMLParser, { initialProps: xml });

    expect(parseFromStringMock).toHaveBeenCalledWith(xml, 'text/xml');
    expect(result.current).toEqual(mockDocument);
    unmount();
  });
});
