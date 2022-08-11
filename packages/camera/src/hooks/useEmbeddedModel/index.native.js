import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as tf from '@tensorflow/tfjs';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';

import { asyncStorageIO } from './FileSystemIO';
import { imagePreprocessing, imageQualityCheckPrediction } from './common';
import Models from './const';

export default function useEmbeddedModel() {
  const [models, setModels] = useState({});

  const addModel = useCallback((name, model) => {
    if (typeof name === 'string' && (models && !!models[name])) {
      setModels((prevState) => ({ ...prevState, [name]: model }));
    }
  }, [models]);

  const isModelStored = async (name) => {
    const keys = await AsyncStorage.getAllKeys();
    const storageKeyOccurence = keys.filter((k) => k.includes(name)).length;

    return storageKeyOccurence === 3;
  };

  const loadModel = async (name) => {
    const keys = await AsyncStorage.getAllKeys();
    const storageKeyOccurence = keys.filter((k) => k.includes(name)).length;

    if (!name || storageKeyOccurence !== 3) {
      throw new Error(`Unable to find model ${name} in storage`);
    }

    await tf.ready();

    const loadedModel = await tf.loadGraphModel(asyncStorageIO(name));
    addModel(name, loadedModel);

    return loadedModel;
  };

  const downloadThenSaveModelAsync = useCallback(async (name, uri, options = {}) => {
    await tf.ready();
    const model = await tf.loadGraphModel(uri, { requestInit: options });
    await model.save(asyncStorageIO(name));

    return model;
  }, []);

  /**
   * @param {string} image.uri base64 string
   * @param {number} image.height image height
   * @param {number} image.width image width
   * @return {Promise<Tensor4D[]> | import("@tensorflow/tfjs-core/dist/tensor").Tensor<import("@tensorflow/tfjs-core/dist/types").Rank.R4>} - a 4D tensor containing image info
   */
  const predictQualityCheck = useCallback(async (image) => {
    try {
      const { imageQualityCheck } = Models;
      const model = models[imageQualityCheck.name] ?? await loadModel(imageQualityCheck.name);

      if (!image || !model) { return null; }

      const buffer = Buffer.from(image.base64, 'base64');
      const imageTensor = decodeJpeg(buffer);

      const imagePreprocessed = imagePreprocessing(tf, imageTensor, image.width, image.height);

      const predictions = await imageQualityCheckPrediction(tf, model, imagePreprocessed);

      return {
        blurriness_score: predictions[0].arraySync()[0],
        overexposure_score: predictions[1].arraySync()[0],
        underexposure_score: predictions[2].arraySync()[0],
      };
    } catch (e) {
      console.error(e);
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
