import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as tf from '@tensorflow/tfjs';
import { decodeJpeg, fetch } from '@tensorflow/tfjs-react-native';

import { asyncStorageIO } from './FileSystemIO';
import { imagePreprocessing, imageQualityCheckPrediction } from './common';
import { MODEL_NAMES } from './const';
import log from '../../utils/log';

export default function useEmbeddedModel() {
  const [useApi, setUseApi] = useState(true);
  const [models, setModels] = useState({});

  const addModel = useCallback((name, model) => {
    if (typeof name === 'string') {
      setModels((prevState) => ({ ...prevState, [name]: model }));
    }
  }, [models]);

  const isModelStored = async (name) => {
    const keys = await AsyncStorage.getAllKeys();
    const storageKeyOccurence = keys.filter((k) => k.includes(name)).length;

    return storageKeyOccurence !== 3;
  };

  const loadModel = async (name) => {
    if (models[name] !== null) {
      setUseApi(false);
      return;
    }

    const keys = await AsyncStorage.getAllKeys();
    const storageKeyOccurence = keys.filter((k) => k.includes(name)).length;

    if (!name || storageKeyOccurence !== 3) {
      log(['set UseApi to true']);
      setUseApi(true);
      return;
    }

    await tf.ready();

    const loadedModel = await tf.loadGraphModel(asyncStorageIO(name));
    addModel(name, loadedModel);
    log(['set useApi to false']);
    setUseApi(false);
  };

  const downloadThenSaveModelAsync = async (name, uri, options = {}) => {
    const model = await tf.loadGraphModel(uri, options);
    await model.save(asyncStorageIO(name));

    return model;
  };

  const predictQualityCheck = async (image, customModel) => {
    try {
      const model = customModel ?? models[MODEL_NAMES.IMAGE_QUALITY_CHECK];

      if (!image || !model) { return null; }

      const binaryImage = await fetch(image, {}, { isBinary: true });

      const rawImageData = await binaryImage.arrayBuffer();
      const buffer = new Uint8Array(rawImageData);
      const imageTensor = decodeJpeg(buffer);

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
