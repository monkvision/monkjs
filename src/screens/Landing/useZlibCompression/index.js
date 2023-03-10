import pako from 'pako';
import { useCallback } from 'react';

export default function useZlibCompression() {
  const compress = useCallback((input) => {
    const binaryConverter = new TextEncoder('utf-8');
    const binary = binaryConverter.encode(input);
    const compressed = pako.deflate(binary);
    return btoa(String.fromCharCode.apply(null, compressed));
  }, []);

  const decompress = useCallback((input) => {
    const compressed = new Uint8Array(atob(input).split('').map((c) => c.charCodeAt(0)));
    const binary = pako.inflate(compressed);
    const binaryConverter = new TextDecoder('utf-8');
    return binaryConverter.decode(binary);
  }, []);

  return { compress, decompress };
}
