import { useMemo } from 'react';

const { DOMParser } = require('xmldom');

export default function useXMLParser(xml) {
  return useMemo(() => new DOMParser().parseFromString(xml, 'text/xml'), [xml]);
}
