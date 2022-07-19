import '@tensorflow/tfjs-backend-cpu';
import { useCallback, useState } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import * as tflite from '@tensorflow/tfjs-tflite';
import axios from 'axios';

import { imagePreprocessing, imageQualityCheckPrediction } from './common';
import { MODEL_NAMES } from './const';
import useIndexedDb from './useIndexedDb';
import log from '../../utils/log';

tflite.setWasmPath('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@0.0.1-alpha.8/dist/');

export default function useEmbeddedModel() {
  const [useApi, setUseApi] = useState(true);
  const [models, setModels] = useState(null);

  const startDb = useIndexedDb();

  const addModel = useCallback((name, model) => {
    if (typeof name === 'string') {
      setModels((prevState) => ({ ...prevState, [name]: model }));
    }
  }, [models]);

  const isModelStored = async (name) => {
    const storedModels = await startDb(null, name);
    const model = storedModels[name];

    return model !== null;
  };

  const loadModel = async (name) => {
    if (models[name] !== null) {
      setUseApi(false);
      return;
    }

    const storedModels = await startDb(null, name);
    const model = storedModels[name];

    log(['Content of storedModels', Object.keys(storedModels)]);
    log([name, 'Model buffer:', model, 'loaded from indexedDB.']);

    if (!model) {
      log(['set UseApi to true']);
      setUseApi(true);
      return;
    }

    const loadedModel = await tflite.loadTFLiteModel(model);
    addModel(loadedModel, name);
    log(['set UseApi to false']);
    setUseApi(false);
  };

  const downloadThenSaveModelAsync = async (name, uri, options = {}) => {
    const buffer = await axios.get(uri, {
      ...options,
      responseType: 'arraybuffer',
    });

    await startDb(buffer.data, name);

    return buffer.data;
  };

  const predictQualityCheck = async (image, customModel) => {
    try {
      const model = customModel ?? models[MODEL_NAMES.IMAGE_QUALITY_CHECK];

      if (!image || !model) { return null; }

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
  };

  return {
    models,
    useApi,
    isModelStored,
    loadModel,
    downloadThenSaveModelAsync,
    predictions: {
      [MODEL_NAMES.IMAGE_QUALITY_CHECK]: predictQualityCheck,
    },
  };
}
