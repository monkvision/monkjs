import { useCallback } from 'react';
import { Platform } from 'react-native';

export default function usePolygons() {
  const getPolygons = useCallback((imageId, views) => {
    const dmgViews = views?.filter((view) => view.image_region?.image_id === imageId);
    const specifications = dmgViews?.filter((v) => v.image_region)
      ?.map((v) => v.image_region?.specification)
      ?.map((spec) => spec.polygons);
    return specifications ?? null;
  }, []);

  const getImage = useCallback((oneImage) => {
    const { id, imageHeight: height, imageWidth: width, path } = oneImage;
    return { id, height, width, source: { uri: path } };
  }, []);

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

  const svgToPngWeb = async (img) => {
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
        const url = canvas.toDataURL('image/png');

        resolve(url);
      };

      imageHtml.src = imgSrc;
    });
  };

  const svgToPngNative = (ref, w, h) => new Promise((resolve) => {
    if (ref) {
      ref?.toDataURL(
        (base64) => resolve(`data:image/png;base64,${base64}`),
        { width: w, height: h },
      );
    }
  });

  /**
   * @type {function(*, *, *, *): Promise<unknown> | Promise.Promise}
   */
  const svgToPng = Platform.select({
    web: svgToPngWeb,
    native: svgToPngNative,
  });

  return { getImage, getPolygons, svgToPng };
}
