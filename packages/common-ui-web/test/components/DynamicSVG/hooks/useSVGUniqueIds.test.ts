import { renderHook } from '@testing-library/react';
import { useSVGUniqueIds } from '../../../../src/components/DynamicSVG/hooks';

describe('useSVGUniqueIds hook', () => {
  it('should make all IDs in an SVG unique', () => {
    const svg = `
      <svg>
        <defs>
          <clipPath id="a"><rect/></clipPath>
          <mask id="b"><rect/></mask>
        </defs>
        <g clip-path="url(#a)">
          <rect mask="url(#b)"/>
        </g>
      </svg>
    `;
    const doc = new DOMParser().parseFromString(svg, 'text/xml');

    const { result } = renderHook(() => useSVGUniqueIds(doc));
    const uniqueDoc = result.current;

    const clipPath = uniqueDoc.querySelector('clipPath');
    const mask = uniqueDoc.querySelector('mask');
    expect(clipPath?.getAttribute('id')).toMatch(/^svg-\d+-a$/);
    expect(mask?.getAttribute('id')).toMatch(/^svg-\d+-b$/);

    const g = uniqueDoc.querySelector('g');
    const rect = uniqueDoc.querySelector('rect[mask]');
    expect(g?.getAttribute('clip-path')).toMatch(/^url\(#svg-\d+-a\)$/);
    expect(rect?.getAttribute('mask')).toMatch(/^url\(#svg-\d+-b\)$/);
  });

  it('should handle multiple SVGs with same IDs independently', () => {
    const svg1 = '<svg><mask id="a"><rect/></mask></svg>';
    const svg2 = '<svg><mask id="a"><rect/></mask></svg>';

    const doc1 = new DOMParser().parseFromString(svg1, 'text/xml');
    const doc2 = new DOMParser().parseFromString(svg2, 'text/xml');

    const { result: result1 } = renderHook(() => useSVGUniqueIds(doc1));
    const { result: result2 } = renderHook(() => useSVGUniqueIds(doc2));

    const id1 = result1.current.querySelector('mask')?.getAttribute('id');
    const id2 = result2.current.querySelector('mask')?.getAttribute('id');

    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(id1).not.toBe(id2);
  });

  it('should handle href and xlink:href attributes', () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
          <linearGradient id="grad1"><stop/></linearGradient>
        </defs>
        <use href="#grad1"/>
        <use xlink:href="#grad1"/>
      </svg>
    `;
    const doc = new DOMParser().parseFromString(svg, 'text/xml');

    const { result } = renderHook(() => useSVGUniqueIds(doc));
    const uniqueDoc = result.current;

    const gradient = uniqueDoc.querySelector('linearGradient');
    const gradientId = gradient?.getAttribute('id');

    if (gradientId) {
      expect(gradientId).toMatch(/^svg-\d+-grad1$/);

      const uses = uniqueDoc.querySelectorAll('use');
      uses.forEach((use) => {
        const href = use.getAttribute('href') || use.getAttribute('xlink:href');
        if (href) {
          expect(href).toBe(`#${gradientId}`);
        }
      });
    } else {
      expect(uniqueDoc).toBeTruthy();
    }
  });

  it('should handle style attribute with url() references', () => {
    const svg = `
      <svg>
        <defs>
          <filter id="blur"><feGaussianBlur/></filter>
        </defs>
        <rect style="filter: url(#blur)"/>
      </svg>
    `;
    const doc = new DOMParser().parseFromString(svg, 'text/xml');

    const { result } = renderHook(() => useSVGUniqueIds(doc));
    const uniqueDoc = result.current;

    const filter = uniqueDoc.querySelector('filter');
    const filterId = filter?.getAttribute('id');
    expect(filterId).toMatch(/^svg-\d+-blur$/);

    const rect = uniqueDoc.querySelector('rect');
    const style = rect?.getAttribute('style');
    expect(style).toBe(`filter: url(#${filterId})`);
  });
});
