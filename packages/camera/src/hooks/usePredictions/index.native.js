/* eslint-disable max-len */
import React from 'react';
// import * as tf from '@tensorflow/tfjs';
// // import { decodeJpeg, fetch } from '@tensorflow/tfjs-react-native';
// import { Platform } from 'react-native';
//
const modelInputWidth = 512; const modelInputHeight = 384;
const MAX_RESULT = 50; const MIN_CONFIDENCE = 0.4;

export default function usePredictions(partDetector) {
  const getParts = async (image, callback) => {
    try {
      console.log('Start prediction');
      //       // Transform the picture to Binary then create a 3D Tensor
      //       // const res = await axios.get(picture.uri, { responseType: 'blob' });
      //       const response = await fetch(image, {}, { isBinary: true });
      //       const rawImageData = await response.arrayBuffer();
      //       const imageTensor = Platform.select({
      //         // native: decodeJpeg(new Uint8Array(rawImageData())),
      //         native: null,
      //         web: null,
      //       });
      //       // Resize the picture to match the model requirements
      //       const resizedImage = tf.image.resizeBilinear(imageTensor, [modelInputHeight, modelInputWidth]);
      //       const imageShape = imageTensor.shape;
      //       const [originalImageHeight, originalImageWidth] = imageShape;
      //
      //       // Expand dimension and adapt input vector then start the prediction
      //       const input = tf.expandDims(tf.transpose(tf.div(resizedImage, 255), [2, 0, 1]), 0);
      //       const predictions = await partDetector.predict(input);
      //
      //       const predictionWithoutNMS = tf.reshape(predictions, [-1, 72]);
      //       const candidatesBbox = tf.slice(predictionWithoutNMS, [0, 0], [predictionWithoutNMS.shape[0], 4]);
      //       const candidatesObjectScore = tf.reshape(tf.slice(predictionWithoutNMS, [0, 4], [predictionWithoutNMS.shape[0], 1]), [-1]);
      //       const indexOfPredictionWithNMS = await tf.image.nonMaxSuppressionAsync(candidatesBbox, candidatesObjectScore, MAX_RESULT, 0.4, MIN_CONFIDENCE);
      //       const predictionWithNMS = tf.gather(predictionWithoutNMS, indexOfPredictionWithNMS);
      //       const predictionClassScores = tf.slice(predictionWithNMS, [0, 5], [predictionWithNMS.shape[0], predictionWithNMS.shape[1] - 5]);
      //       const predictionObjectScores = tf.slice(predictionWithNMS, [0, 4], [predictionWithNMS.shape[0], 1]);
      //       const predictionClassIds = tf.reshape(tf.argMax(predictionClassScores, 1), [-1, 1]);
      //
      //       const predictionXCenter = tf.slice(predictionWithNMS, [0, 0], [predictionWithNMS.shape[0], 1]);
      //       const predictionYCenter = tf.slice(predictionWithNMS, [0, 1], [predictionWithNMS.shape[0], 1]);
      //       const predictionWidth = tf.slice(predictionWithNMS, [0, 2], [predictionWithNMS.shape[0], 1]);
      //       const predictionHeight = tf.slice(predictionWithNMS, [0, 3], [predictionWithNMS.shape[0], 1]);
      //
      //       const ratioX = originalImageWidth / modelInputWidth;
      //       const ratioY = originalImageHeight / modelInputHeight;
      //
      //       // Scale result to original picture size
      //       const predictionXCenterScale = tf.mul(predictionXCenter, ratioX);
      //       const predictionYCenterScale = tf.mul(predictionYCenter, ratioY);
      //       const predictionWidthScale = tf.mul(predictionWidth, ratioX);
      //       const predictionHeightScale = tf.mul(predictionHeight, ratioY);
      //
      //       // Shift result position to canvas origin position
      //       const predictionXCenterShift = tf.sub(predictionXCenterScale, tf.div(predictionWidthScale, 2));
      //       const predictionYCenterShift = tf.sub(predictionYCenterScale, tf.div(predictionHeightScale, 2));
      //
      //       const prediction = tf.concat([predictionXCenterShift, predictionYCenterShift, predictionWidthScale, predictionHeightScale, predictionObjectScores, predictionClassIds], 1);
      //
      //       prediction.array().then((pred) => callback(pred, originalImageWidth, originalImageHeight));
    } catch (e) {
      console.log(e);
    }
  };

  return [getParts];
}
