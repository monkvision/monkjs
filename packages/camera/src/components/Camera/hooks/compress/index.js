import webEnc from './webp_enc';

/**
 * @param data {Uint8Array} - picture data
 * @param width {number} - picture width
 * @param height {number} - picture height
 * @returns {Blob} - the compressed picture on webp format
 */
export default function compress(data, width, height) {
  return new Promise((resolve, reject) => {
    webEnc()
      .then((module) => {
        const result = module.encode(data, width, height, {
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
        });

        resolve(new Blob([result], { type: 'image/jpeg' }));
      })
      .catch(reject);
  });
}
