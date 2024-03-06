import pako from 'pako';

/**
 * Compresses and encodes a string in base64 using the ZLib algorithm.
 */
export function zlibCompress(str: string): string {
  const binaryConverter = new TextEncoder();
  const binary = binaryConverter.encode(str);
  const compressed = pako.deflate(binary);
  return btoa(String.fromCharCode.apply(null, Array.from(compressed)));
}

/**
 * Decompresses a string that has been encoded in base64 and compressed using the Zlib algorithm.
 */
export function zlibDecompress(str: string): string {
  const compressed = new Uint8Array(
    atob(str)
      .split('')
      .map((c) => c.charCodeAt(0)),
  );
  const binary = pako.inflate(compressed);
  const binaryConverter = new TextDecoder('utf-8');
  return binaryConverter.decode(binary);
}
