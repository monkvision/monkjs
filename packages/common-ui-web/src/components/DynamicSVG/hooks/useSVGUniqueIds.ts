import { useMemo } from 'react';

let idCounter = 0;

/**
 * Helper function that ensures special characters in IDs don't break the regex.
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Attributes that can contain URL references to SVG IDs
 */
const URL_ATTRIBUTES = [
  'mask',
  'clip-path',
  'clipPath',
  'fill',
  'stroke',
  'filter',
  'marker-start',
  'marker-mid',
  'marker-end',
  'href',
  'xlink:href',
];

/**
 * Makes all IDs in an SVG document unique by adding a prefix.
 * This prevents ID collisions when multiple SVGs are rendered on the same page.
 *
 * @param doc - The parsed SVG document
 * @param prefix - A unique prefix to add to all IDs
 */
function makeIdsUnique(doc: Document, prefix: string): void {
  const idMap = new Map<string, string>();

  const elementsWithId = doc.querySelectorAll('[id]');
  elementsWithId.forEach((element) => {
    const oldId = element.getAttribute('id');
    if (oldId) {
      const newId = `${prefix}-${oldId}`;
      idMap.set(oldId, newId);
      element.setAttribute('id', newId);
    }
  });

  const allElements = doc.querySelectorAll('*');
  allElements.forEach((element) => {
    URL_ATTRIBUTES.forEach((attr) => {
      const value = element.getAttribute(attr);
      if (value) {
        let newValue = value;
        const urlPattern = /url\(#([^)]+)\)/g;
        newValue = newValue.replace(urlPattern, (match, id) => {
          const newId = idMap.get(id);
          return newId ? `url(#${newId})` : match;
        });

        if (newValue.startsWith('#')) {
          const id = newValue.substring(1);
          const newId = idMap.get(id);
          if (newId) {
            newValue = `#${newId}`;
          }
        }
        if (newValue !== value) {
          element.setAttribute(attr, newValue);
        }
      }
    });

    const style = element.getAttribute('style');
    if (style) {
      let newStyle = style;
      const urlPattern = /url\(#([^)]+)\)/g;
      newStyle = newStyle.replace(urlPattern, (match, id) => {
        const newId = idMap.get(id);
        return newId ? `url(#${newId})` : match;
      });
      if (newStyle !== style) {
        element.setAttribute('style', newStyle);
      }
    }
  });

  /**
   * Updates keyframes to point towards the new ID in case collison was avoided.
   *
   * @example Rewrites both (#oldId) and url(#oldId)
   */
  const styleElements = doc.querySelectorAll('style');
  styleElements.forEach((styleEl) => {
    let cssText = styleEl.innerHTML;
    idMap.forEach((newId, oldId) => {
      const idSelector = new RegExp(`#${escapeRegex(oldId)}(?![\\w-])`, 'g');
      cssText = cssText.replace(idSelector, `#${newId}`);
      const urlRef = new RegExp(`url\\(#${escapeRegex(oldId)}\\)`, 'g');
      cssText = cssText.replace(urlRef, `url(#${newId})`);
    });
    // eslint-disable-next-line no-param-reassign
    styleEl.innerHTML = cssText;
  });
}

/**
 * Hook that ensures all IDs within an SVG document are unique by adding a prefix.
 * This prevents ID collisions when multiple SVGs with the same internal IDs are rendered on the same page.
 *
 * @param doc - The parsed SVG document
 * @returns The same document with unique IDs
 */
export function useSVGUniqueIds(doc: Document): Document {
  return useMemo(() => {
    const uniquePrefix = `svg-${idCounter}`;
    idCounter += 1;
    makeIdsUnique(doc, uniquePrefix);
    return doc;
  }, [doc]);
}
