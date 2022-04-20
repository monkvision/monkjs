import { useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { asyncStorageIO } from './FileSystemIO';
import * as constants from './const';

export default function useEmbeddedModel() {
  const [useApi, setUseApi] = useState(true);
  const [partDetector, setPartDetector] = useState(null);

  const isModelInStorage = async (name) => {
    const keys = await AsyncStorage.getAllKeys();
    const storageKeyOccurence = keys.filter((k) => k.includes(name)).length;

    return storageKeyOccurence !== 3;
  };

  const loadModel = (name) => {
    if (!name) {
      setUseApi(true);
      return null;
    }

    const partDetectorModel = tf.loadGraphModel(asyncStorageIO(name));
    partDetectorModel.then((res) => {
      setPartDetector(res);
      setUseApi(false);
    });

    return partDetectorModel;
  };

  const downloadThenSaveModelNative = async (name, uri, options = {}) => {
    const model = await tf.loadGraphModel(uri, options);
    await model.save(asyncStorageIO(name));
  };

  return {
    constants,
    isModelInStorage,
    loadModel,
    downloadThenSaveModelNative,
  };
}
