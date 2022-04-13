import '@tensorflow/tfjs-backend-cpu';
import { useState } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import * as tflite from '@tensorflow/tfjs-tflite';
import { partDetectorPreProcess } from './common';

tflite.setWasmPath('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@0.0.1-alpha.8/dist/');

export default function usePredictions() {
  const [useApi, setUseApi] = useState(true);
  const [partDetector, setPartDetector] = useState(null);

  const loadModel = (model) => {
    if (!model) {
      setUseApi(true);
      return null;
    }

    const partDetectorModel = tflite.loadTFLiteModel(model);
    partDetectorModel.then((res) => {
      setPartDetector(res);
      setUseApi(false);
    });

    return partDetectorModel;
  };

  const getParts = async (image, customModel) => {
    try {
      const model = customModel ?? partDetector;
      console.log('Start prediction');
      // Transform the picture to Binary then create a 4D Tensor
      // TODO: Manage for each platform the transformation of the picture to a 4D Tensor
      const imageTensor = null;

      return await partDetectorPreProcess(tf, model, imageTensor);
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  return {
    useApi,
    loadModel,
    predictions: {
      partDetector: getParts,
    },
  };
}
