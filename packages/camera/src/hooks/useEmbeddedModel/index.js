import '@tensorflow/tfjs-backend-cpu';
import { useCallback, useState } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import * as tflite from '@tensorflow/tfjs-tflite';
import axios from 'axios';

import { imagePreprocessing, imageQualityCheckPrediction } from './common';
import Models from './const';
import useIndexedDb from './useIndexedDb';
import log from '../../utils/log';

tflite.setWasmPath('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@0.0.1-alpha.8/dist/');

export default function useEmbeddedModel() {
  const startDb = useIndexedDb();

  const isModelStored = useCallback(async (name) => {
    const storedModels = await startDb(null, name);
    const model = storedModels[name];

    return !!model;
  }, []);

  const loadModel = useCallback(async (name) => {
  //  const storedModels = await startDb(null, name);
//    const model = storedModels[name];
    const model = require('./model.tflite');

    if (!model) {
      throw new Error(`Unable to find model ${name} in storage.`);
    }

    log(['[Event] Model :', name, 'loaded from indexedDB.']);

    const loadedModel = await tflite.loadTFLiteModel(model);

    log(['[Event] Model :', name, 'tf model loaded.']);

    return loadedModel;
  }, []);

  const downloadThenSaveModelAsync = useCallback(async (name, uri, options = {}) => {
    const buffer = await axios.get(uri, {
      responseType: 'arraybuffer',
    });
    await startDb(buffer.data, name);

    return buffer.data;
  }, []);

  const predictQualityCheck = useCallback(async (image, model) => {
    try {
      if (!image || !model) {
        log([`[Event] ${!image ? 'image' : ''}, ${!model ? 'model' : ''} missing`]);
        throw new Error('No model');
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

      const imageTensor = tf.browser.fromPixels(img);
      const [width, height] = imageTensor.shape;

      const imagePreprocessed = imagePreprocessing(tf, imageTensor, width, height);

      const predictions = await imageQualityCheckPrediction(tf, model, imagePreprocessed);

      return {
        blurriness_score: predictions['PartitionedCall:0'].arraySync()[0],
        overexposure_score: predictions['PartitionedCall:1'].arraySync()[0],
        underexposure_score: predictions['PartitionedCall:2'].arraySync()[0],
      };
    } catch (e) {
      log([e]);
      return null;
    }
  }, []);

  return {
    isModelStored,
    loadModel,
    downloadThenSaveModelAsync,
    predictions: {
      [Models.imageQualityCheck.name]: predictQualityCheck,
    },
  };
}
