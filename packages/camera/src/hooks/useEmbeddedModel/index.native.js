import { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decodeJpeg, fetch } from '@tensorflow/tfjs-react-native';

import { asyncStorageIO } from './FileSystemIO';
import * as constants from './const';
import log from '../../utils/log';
import {
  imagePreprocessing,
  imageQualityCheckPrediction,
  partDetectorModelPrediction,
} from './common';

export default function useEmbeddedModel() {
  const [useApi, setUseApi] = useState(true);
  const [partDetectorModel, setPartDetectorModel] = useState(null);
  const [qualityCheckModel, setQualityCheckModel] = useState(null);

  const isModelInStorage = async (name) => {
    const keys = await AsyncStorage.getAllKeys();
    const storageKeyOccurence = keys.filter((k) => k.includes(name)).length;

    return storageKeyOccurence !== 3;
  };

  const loadModel = async (name, type, callback) => {
    const keys = await AsyncStorage.getAllKeys();
    const storageKeyOccurence = keys.filter((k) => k.includes(name)).length;

    if (!name || storageKeyOccurence !== 3) {
      log(['set UseApi to true']);
      setUseApi(true);
      return;
    }

    await tf.ready();

    const loadedModel = await tf.loadGraphModel(asyncStorageIO(name));
    switch (type) {
      case 'imageQualityCheck':
        setQualityCheckModel(loadedModel);
        break;
      default:
        setPartDetectorModel(loadedModel);
        break;
    }
    log(['set useApi to false']);
    setUseApi(false);
    callback();
  };

  const downloadThenSaveModelNative = async (name, uri, options = {}) => {
    const model = await tf.loadGraphModel(uri, options);
    await model.save(asyncStorageIO(name));
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
      const binaryImage = await fetch(image, {}, { isBinary: true });
      log([`time get blob from url: ${new Date() - time2} ms`]);

      const time3 = new Date();
      const rawImageData = await binaryImage.arrayBuffer();
      const buffer = new Uint8Array(rawImageData);
      const imageTensor = decodeJpeg(buffer);
      log([`time transformation to Tensor: ${new Date() - time3} ms`]);

      log([`time total image adaptation: ${new Date() - time2} ms`]);

      const model = customModel ?? qualityCheckModel;

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
    constants,
    isModelInStorage,
    loadModel,
    downloadThenSaveModelNative,
    predictions: {
      partDetectorModel: getParts,
      imageQualityCheck: predictQualityCheck,
    },
  };
}
