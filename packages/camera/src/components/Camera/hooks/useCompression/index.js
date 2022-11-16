import { useCallback, useEffect, useState } from 'react';

import webEnc from './webp_enc';

const defaultOptions = {
  quality: 85,
  baseline: false,
  arithmetic: false,
  progressive: true,
  optimize_coding: true,
  smoothing: 0,
  color_space: 3 /* YCbCr */,
  quant_table: 3,
  trellis_multipass: false,
  trellis_opt_zero: false,
  trellis_opt_table: false,
  trellis_loops: 1,
  auto_subsample: true,
  chroma_subsample: 2,
  separate_chroma_quality: false,
  chroma_quality: 85,
};

export default function useCompression() {
  const [module, setModule] = useState(null);

  useEffect(() => {
    webEnc()
      .then(setModule);
  }, []);

  /**
   * @param data {Uint8Array} - picture data
   * @param width {number} - picture width
   * @param height {number} - picture height
   * @param height {Object} - picture height
   * @returns {Blob} - the compressed picture on webp format
   */
  return useCallback((data, width, height, options = {}) => {
    const tweakedOptions = {
      ...options,
      quality: options.quality && options.quality <= 1 ? options.quality * 100 : options.quality,
    };

    if (module) {
      return new Promise((resolve) => {
        const result = module.encode(data, width, height, { ...defaultOptions, ...tweakedOptions });

        resolve(new Blob([result], { type: 'image/jpeg' }));
      });
    }

    return new Promise((resolve, reject) => {
      webEnc()
        .then((newModule) => {
          setModule(newModule);
          const result = newModule.encode(
            data,
            width,
            height,
            { ...defaultOptions, tweakedOptions },
          );

          resolve(new Blob([result], { type: 'image/jpeg' }));
        })
        .catch(reject);
    });
  }, [module]);
}
