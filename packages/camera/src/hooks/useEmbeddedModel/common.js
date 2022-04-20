/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
const modelInputWidth = 336; const modelInputHeight = 336;
const MAX_RESULT = 50; const MIN_CONFIDENCE = 0.4;

/**
 * It takes a Tensor image then adapt it to fit the part detector model input
 * @param tf - TensorFlow api (different from each platform)
 * @param model - ML model used to do predictions
 * @param imageTensor - a 4D tensor containing image info
 * @returns {Promise<*>} returns a promise of an array of predictions that is an array containing:
    * 0. x position of the origin of the bbox
    * 1. y position of the origin of the bbox
    * 2. width of the bbox
    * 3. height of the bbox
    * 4. prediction score of the prediction
    * 5. index of the prediction's class (located on class.js)
 */
export const partDetectorModelPreProcess = async (tf, model, imageTensor) => {
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

export const imageQualityCheckPreprocess = async (tf, model, imageTensor) => {
  // Resizing the picture to match the model requirements
  const resizedImage = tf.image.resizeBilinear(imageTensor, [modelInputHeight, modelInputWidth]);

  // Expanding dimension and adapting input vector then start the prediction
  const input = tf.expandDims(tf.transpose(tf.div(resizedImage, 255), [2, 0, 1]), 0);
  const predictions = await model.predict(input);

  return {
    overexposure: predictions['PartitionedCall:1'].arraySync()[0] < MIN_CONFIDENCE,
    underexposure: predictions['PartitionedCall:2'].arraySync()[0] < MIN_CONFIDENCE,
    blurriness: predictions['PartitionedCall:0'].arraySync()[0] < MIN_CONFIDENCE,
  };
};
