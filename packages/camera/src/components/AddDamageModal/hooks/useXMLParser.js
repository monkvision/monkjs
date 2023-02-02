import { useMemo } from 'react';

export default function useXMLParser(xml) {
  return useMemo(() => new DOMParser().parseFromString(xml, 'text/xml'), [xml]);
}
