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
  const [models, setModels] = useState({});

  const startDb = useIndexedDb();

  const addModel = useCallback((name, model) => {
    if (typeof name === 'string') {
      setModels((prevState) => ({ ...prevState, [name]: model }));
    }
  }, [models]);

  const isModelStored = async (name) => {
    const storedModels = await startDb(null, name);
    const model = storedModels[name];

    return !!model;
  };

  const loadModel = async (name) => {
    const storedModels = await startDb(null, name);
    const model = storedModels[name];

    log(['[Event] Model :', name, 'loaded from indexedDB.']);

    if (!model) {
      throw new Error(`Unable to find model ${name} in storage.`);
    }

    const loadedModel = await tflite.loadTFLiteModel(model);
    addModel(name, loadedModel);

    return loadedModel;
  };

  const downloadThenSaveModelAsync = async (name, uri, options = {}) => {
    const buffer = await axios.get(uri, {
      ...options,
      responseType: 'arraybuffer',
    });

    await startDb(buffer.data, name);

    return buffer.data;
  };

  const predictQualityCheck = useCallback(async (image, customModel) => {
    try {
      const model = customModel ?? models[Models.imageQualityCheck.name];
      log([`[Event] Using ${customModel ? 'a custom ' : 'loaded'} model`]);

      if (!image || !model) {
        log([`[Event] ${!image ? 'image' : ''}, ${!model ? 'model' : ''} missing`]);
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

      const imageTensor = tf.browser.fromPixels(img);
      const [width, height] = imageTensor.shape;

      const imagePreprocessed = imagePreprocessing(tf, imageTensor, width, height);

      return imageQualityCheckPrediction(tf, model, imagePreprocessed);
    } catch (e) {
      log([e]);
      return null;
    }
  }, [models]);

  return {
    models,
    isModelStored,
    loadModel,
    downloadThenSaveModelAsync,
    predictions: {
      [Models.imageQualityCheck.name]: predictQualityCheck,
    },
  };
}
