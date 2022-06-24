import { useCallback, useEffect, useState } from 'react';

import mozJpegEnc from './mozjpeg_enc';
import webpEnc from './webp_enc';

const defaultOptions = {
  mozjpeg: {
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
  },
  webp: {
    quality: 85,
    target_size: 0,
    target_PSNR: 0,
    method: 4,
    sns_strength: 50,
    filter_strength: 60,
    filter_sharpness: 0,
    filter_type: 1,
    partitions: 0,
    segments: 4,
    pass: 1,
    show_compressed: 0,
    preprocessing: 0,
    autofilter: 0,
    partition_limit: 0,
    alpha_compression: 1,
    alpha_filtering: 1,
    alpha_quality: 100,
    lossless: 0,
    exact: 0,
    image_hint: 0,
    emulate_jpeg_size: 0,
    thread_level: 0,
    low_memory: 0,
    near_lossless: 100,
    use_delta_palette: 0,
    use_sharp_yuv: 0,
  },
};

export const fileType = {
  MOZJPEG: 'mozjpeg',
  WEBP: 'webp',
};

export default function useCompression({ type = fileType.MOZJPEG }) {
  const [module, setModule] = useState(null);

  useEffect(() => {
    switch (type) {
      case fileType.MOZJPEG:
        mozJpegEnc()
          .then(setModule);
        break;
      default:
        webpEnc()
          .then(setModule);
    }
  }, []);

  /**
   * @param data {Uint8Array} - picture data
   * @param width {number} - picture width
   * @param height {number} - picture height
   * @param height {Object} - picture height
   * @returns {Blob} - the compressed picture on webp format
   */
  return useCallback((data, width, height, options = {}) => {
    if (module) {
      return new Promise((resolve) => {
        const result = module.encode(data, width, height, { ...defaultOptions[type], ...options });

        resolve(new Blob([result, { type: 'image/jpeg' }]));
      });
    }

    return new Promise((resolve, reject) => {
      const encoder = type === fileType.MOZJPEG ? mozJpegEnc : webpEnc;
      encoder()
        .then((newModule) => {
          setModule(newModule);
          const result = newModule
            .encode(data, width, height, { ...defaultOptions[type], options });

          resolve(new Blob([result], { type: 'image/jpeg' }));
        })
        .catch(reject);
    });
  }, [module]);
}
