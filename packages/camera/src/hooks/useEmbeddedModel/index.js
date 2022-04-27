import '@tensorflow/tfjs-backend-cpu';
import { useState } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import * as tflite from '@tensorflow/tfjs-tflite';
import axios from 'axios';

import {
  imagePreprocessing,
  imageQualityCheckPrediction,
  partDetectorModelPrediction,
} from './common';
import log from '../../utils/log';

tflite.setWasmPath('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@0.0.1-alpha.8/dist/');

export default function useEmbeddedModel() {
  const [useApi, setUseApi] = useState(true);
  const [partDetectorModel, setPartDetectorModel] = useState(null);
  const [qualityCheckModel, setQualityCheckModel] = useState(null);

  const loadModel = async (model, type, callback) => {
    if (!model) {
      log(['set UseApi to true']);
      setUseApi(true);
      return;
    }

    const loadedModel = await tflite.loadTFLiteModel(model);

    log(['Model: ']);

    switch (type) {
      case 'imageQualityCheck':
        setQualityCheckModel(loadedModel);
        break;
      default:
        setPartDetectorModel(loadedModel);
        break;
    }
    log(['set UseApi to false']);
    setUseApi(false);
    callback();
  };

  const getParts = async (image, customModel) => {
    try {
      const model = customModel ?? partDetectorModel;
      log(['Start prediction']);
      // Transform the picture to Binary then create a 4D Tensor
      // TODO: Manage for each platform the transformation of the picture to a 4D Tensor
      const imageTensor = null;

      return await partDetectorModelPrediction(tf, model, imageTensor);
    } catch (e) {
      log([e]);
      return null;
    }
  };

  const predictQualityCheck = async (image, customModel) => {
    try {
      if (!image) {
        return null;
      }

      const time2 = new Date();
      const blob = await axios.get(image.uri, {
        responseType: 'blob',
      });
      log([`time get image blob from url: ${new Date() - time2} ms`]);

      const time3 = new Date();
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
      log([`time transformation to HTML element: ${new Date() - time3} ms`]);

      log([`time total image adaptation: ${new Date() - time2} ms`]);

      const time4 = new Date();
      const model = customModel ?? qualityCheckModel;

      const imageTensor = tf.browser.fromPixels(img);
      log([`time transformation to tensor: ${new Date() - time4} ms`]);
      const [width, height] = imageTensor.shape;

      const imagePreprocessed = imagePreprocessing(tf, imageTensor, width, height);

      const time = new Date();
      const results = await imageQualityCheckPrediction(tf, model, imagePreprocessed);

      log([`time prediction: ${new Date() - time} ms`]);

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
