import { useMemo } from 'react';

/**
 * Custom hook used to parse an XML string and return a Document object. This hook is mainly used in the SDK to parse
 * SVG images from strings and iterate over the parsed document to create dynamic SVGs.
 */
export function useXMLParser(xml: string): Document {
  return useMemo(() => new DOMParser().parseFromString(xml, 'text/xml'), [xml]);
}
