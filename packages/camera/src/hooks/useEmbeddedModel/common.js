/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
import log from '../../utils/log';

const modelInputWidth = 336; const modelInputHeight = 336;
const MAX_RESULT = 50; const MIN_CONFIDENCE = 0.4;

/**
 * Resize then normalize an RGB picture
 * @param tf - tfjs api
 * @param image {Tensor3D | import("@tensorflow/tfjs-core/dist/tensor").Tensor<import("@tensorflow/tfjs-core/dist/types").Rank.R3>} - A 3D Tensor Image
 * @param width {number} - width of the original picture
 * @param height {number} - height of the original picture
 * @returns {Tensor3D | Tensor4D | import("@tensorflow/tfjs-core/dist/tensor").Tensor<import("@tensorflow/tfjs-core/dist/types").Rank.R3> | import("@tensorflow/tfjs-core/dist/tensor").Tensor<import("@tensorflow/tfjs-core/dist/types").Rank.R4>}
 */
export const imagePreprocessing = (tf, image, width, height) => {
  const time = new Date();
  const resizedImage = tf.image.resizeBilinear(image, [modelInputHeight, modelInputWidth]);

  log([width, height]);

  // Not needed for this model
  // const mean = tf.tensor1d([0, 0, 0]);
  // const std = tf.tensor1d([1, 1, 1]);
  // const normalizedImage = tf.div(tf.sub(resizedImage, mean), std);
  const normalizedImage = resizedImage;
  log([`time preprocessing: ${new Date() - time} ms`]);

  return normalizedImage;
};

/**
 * It takes a Tensor image then adapt it to fit the part detector model input
 * @param tf - TensorFlow api (different from each platform)
 * @param model - ML model used to do predictions (tf or tflite model)
 * @param imageTensor {Tensor4D | import("@tensorflow/tfjs-core/dist/tensor").Tensor<import("@tensorflow/tfjs-core/dist/types").Rank.R4>} - a 4D tensor containing image info
 * @returns {Promise<*>} returns a promise of an array of predictions that is an array containing:
    * 0. x position of the origin of the bbox
    * 1. y position of the origin of the bbox
    * 2. width of the bbox
    * 3. height of the bbox
    * 4. prediction score of the prediction
    * 5. index of the prediction's class (located on class.js)
 */
export const partDetectorModelPrediction = async (tf, model, imageTensor) => {
  // Resizing the picture to match the model requirements
  const resizedImage = tf.image.resizeBilinear(imageTensor, [modelInputHeight, modelInputWidth]);
  const imageShape = imageTensor.shape;
  const [originalImageHeight, originalImageWidth] = imageShape;

  // Expanding dimension and adapting input vector then start the prediction
  const input = tf.expandDims(tf.transpose(tf.div(resizedImage, 255), [2, 0, 1]), 0);
  const predictions = await model.predict(input);

  const predictionWithoutNMS = tf.reshape(predictions, [-1, 72]);
  const candidatesBbox = tf.slice(predictionWithoutNMS, [0, 0], [predictionWithoutNMS.shape[0], 4]);
  const candidatesObjectScore = tf.reshape(tf.slice(predictionWithoutNMS, [0, 4], [predictionWithoutNMS.shape[0], 1]), [-1]);
  const indexOfPredictionWithNMS = await tf.image.nonMaxSuppressionAsync(candidatesBbox, candidatesObjectScore, MAX_RESULT, 0.4, MIN_CONFIDENCE);
  const predictionWithNMS = tf.gather(predictionWithoutNMS, indexOfPredictionWithNMS);
  const predictionClassScores = tf.slice(predictionWithNMS, [0, 5], [predictionWithNMS.shape[0], predictionWithNMS.shape[1] - 5]);
  const predictionObjectScores = tf.slice(predictionWithNMS, [0, 4], [predictionWithNMS.shape[0], 1]);
  const predictionClassIds = tf.reshape(tf.argMax(predictionClassScores, 1), [-1, 1]);

  const predictionXCenter = tf.slice(predictionWithNMS, [0, 0], [predictionWithNMS.shape[0], 1]);
  const predictionYCenter = tf.slice(predictionWithNMS, [0, 1], [predictionWithNMS.shape[0], 1]);
  const predictionWidth = tf.slice(predictionWithNMS, [0, 2], [predictionWithNMS.shape[0], 1]);
  const predictionHeight = tf.slice(predictionWithNMS, [0, 3], [predictionWithNMS.shape[0], 1]);

  const ratioX = originalImageWidth / modelInputWidth;
  const ratioY = originalImageHeight / modelInputHeight;

  // Scale result to original picture size
  const predictionXCenterScale = tf.mul(predictionXCenter, ratioX);
  const predictionYCenterScale = tf.mul(predictionYCenter, ratioY);
  const predictionWidthScale = tf.mul(predictionWidth, ratioX);
  const predictionHeightScale = tf.mul(predictionHeight, ratioY);

  // Shift result position to canvas origin position
  const predictionXCenterShift = tf.sub(predictionXCenterScale, tf.div(predictionWidthScale, 2));
  const predictionYCenterShift = tf.sub(predictionYCenterScale, tf.div(predictionHeightScale, 2));

  const prediction = tf.concat([predictionXCenterShift, predictionYCenterShift, predictionWidthScale, predictionHeightScale, predictionObjectScores, predictionClassIds], 1);

  return prediction.array();
};

/**
 * It takes a Tensor image then adapt it to fit the image quality check model input
 * @param tf - TensorFlow api (different from each platform)
 * @param model - ML model used to do predictions (tf or tflite model)
 * @param imagePreprocessed {Tensor4D | import("@tensorflow/tfjs-core/dist/tensor").Tensor<import("@tensorflow/tfjs-core/dist/types").Rank.R4>} - a 4D tensor containing image info
 * @returns {Promise<{blurriness: boolean, overexposure: boolean, underexposure: boolean}>}
 */
export const imageQualityCheckPrediction = async (tf, model, imagePreprocessed) => {
  const time3 = new Date();
  // Resizing the picture to match the model requirements
  log([`time resize: ${new Date() - time3} ms`]);

  // Expanding dimension and adapting input vector then start the prediction
  const time2 = new Date();
  const input = tf.expandDims(tf.transpose(tf.div(imagePreprocessed, 255), [2, 0, 1]), 0);
  log([`time transpose: ${new Date() - time2} ms`]);
  const time = new Date();
  const predictions = await model.predict(input);
  log([`time predict: ${new Date() - time} ms`]);
  // eslint-disable-next-line no-console
  console.log(predictions['PartitionedCall:0'].arraySync()[0], predictions['PartitionedCall:1'].arraySync()[0], predictions['PartitionedCall:2'].arraySync()[0]);

  return {
    blurriness: predictions['PartitionedCall:0'].arraySync()[0] < MIN_CONFIDENCE,
    overexposure: predictions['PartitionedCall:1'].arraySync()[0] < MIN_CONFIDENCE,
    underexposure: predictions['PartitionedCall:2'].arraySync()[0] < MIN_CONFIDENCE,
  };
};
