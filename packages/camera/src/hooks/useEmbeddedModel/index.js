import '@tensorflow/tfjs-backend-cpu';
import { useState } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import * as tflite from '@tensorflow/tfjs-tflite';
import axios from 'axios';

import { imageQualityCheckPreprocess, partDetectorModelPreProcess } from './common';
import log from '../../utils/log';

tflite.setWasmPath('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@0.0.1-alpha.8/dist/');

export default function useEmbeddedModel() {
  const [useApi, setUseApi] = useState(true);
  const [partDetectorModel, setPartDetectorModel] = useState(null);
  const [qualityCheckModel, setQualityCheckModel] = useState(null);

  const loadModel = (model, type, callback) => {
    if (!model) {
      log(['set UseApi to true']);
      setUseApi(true);
      return null;
    }
    const loadedModel = tflite.loadTFLiteModel(model);
    loadedModel.then((res) => {
      switch (type) {
        case 'imageQualityCheck':
          setQualityCheckModel(res);
          break;
        default:
          setPartDetectorModel(res);
          break;
      }
      log(['set UseApi to false']);
      setUseApi(false);
      callback();
    });

    return partDetectorModel;
  };

  const getParts = async (image, customModel) => {
    try {
      const model = customModel ?? partDetectorModel;
      log(['Start prediction']);
      // Transform the picture to Binary then create a 4D Tensor
      // TODO: Manage for each platform the transformation of the picture to a 4D Tensor
      const imageTensor = null;

      return await partDetectorModelPreProcess(tf, model, imageTensor);
    } catch (e) {
      log([e]);
      return null;
    }
  };

  const predictQualityCheck = async (image, customModel) => {
    const time = new Date();
    try {
      if (!image) {
        return null;
      }

      const blob = await axios.get(image.uri, {
        responseType: 'blob',
      });

      const img = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob.data);
        reader.onloadend = () => {
          const base64data = reader.result;
          const imageData = new Image();
          imageData.onload = () => {
            resolve(imageData);
          };
          imageData.src = base64data;
        };
      });

      const model = customModel ?? qualityCheckModel;

      const imageTensor = tf.browser.fromPixels(img);

      const results = await imageQualityCheckPreprocess(tf, model, imageTensor);

      log([`time: ${new Date() - time} ms`]);

      return results;
    } catch (e) {
      log([e]);
      return null;
    }
  };

  return {
    useApi,
    loadModel,
    predictions: {
      partDetector: getParts,
      imageQualityCheck: predictQualityCheck,
    },
  };
}
