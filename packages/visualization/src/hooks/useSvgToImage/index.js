import { Platform } from 'react-native';

/**
 * @typedef imageSource
 * @property {string} uri
 */

/**
 * @typedef image
 * @property {string} id - id of the image
 * @property {number} width - image's original width
 * @property {number} height - image's original height
 * @property {imageSource} source - image path
 */

/**
 * @returns {function(*, number, number): Promise<*> | Promise.Promise}
 */
export default () => {
  /**
   * @param {image} img
   * @returns {Promise<string>}
   */
  const imageToBase64 = async (img) => {
    const response = await fetch(img.source.uri);
    const buffer = await response.arrayBuffer();

    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    const binary = bytes.reduce((prev, curr, i) => (
      (i < len) ? prev + String.fromCharCode(curr) : prev
    ), '');
    return `data:image/png;base64,${window.btoa(binary)}`;
  };

  /**
   * @param {image} img
   * @returns {Promise<Promise<unknown> | Promise.Promise>}
   */
  const svgToWebp = async (img) => {
    const serialize = new XMLSerializer().serializeToString(document.getElementById(`svg-${img.id}`));
    const b64 = await imageToBase64(img);
    const hrefReg = /href=(["'])(?:(?=(\\?))\2.)*?\1/g;
    const widthReg = /width=(["'])(?:(?=(\\?))\2.)*?\1/;
    const heightReg = /height=(["'])(?:(?=(\\?))\2.)*?\1/;
    const svgSerialized = serialize
      .replaceAll(hrefReg, `href="${b64}"`)
      .replace(widthReg, `width="${img.width}"`)
      .replace(heightReg, `height="${img.height}"`);
    const imgSrc = (`data:image/svg+xml;base64,${window.btoa(svgSerialized)}`);

    return new Promise((resolve, reject) => {
      const imageHtml = new Image();

      imageHtml.crossOrigin = 'anonymous';

      imageHtml.onerror = () => {
        reject(new Error('Picture could not be loaded'));
      };

      imageHtml.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        context.drawImage(imageHtml, 0, 0);
        const url = canvas.toDataURL('image/webp');

        resolve(url);
      };

      imageHtml.src = imgSrc;
    });
  };

  /**
   * @param ref - Reference of the svg
   * @param {number} w - image's original width
   * @param {number} h - image's original height
   * @returns {Promise<unknown> | Promise.Promise}
   */
  const svgToPngNative = (ref, w, h) => new Promise((resolve) => {
    if (ref) {
      ref?.toDataURL(
        (base64) => resolve(`data:image/png;base64,${base64}`),
        { width: w, height: h },
      );
    }
  });

  return Platform.select({
    web: svgToWebp,
    native: svgToPngNative,
  });
};
