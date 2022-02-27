import { taskStatuses } from '@monkvision/corejs';

function handleStatuses({ status, ocrIsLoading, vinPicture, vin, values, isUploading }) {
  if ((status === taskStatuses.NOT_STARTED || ocrIsLoading) && !!vinPicture) { return 'Starting the prediction task...'; }
  if (status === taskStatuses.TODO) { return 'Warming up our AI to get the best prediction...'; }
  if (status === taskStatuses.ERROR) { return 'An error happened while reading the vin, please add it manually or skip for later'; }
  if (status === taskStatuses.IN_PROGRESS) { return 'AI is reading the image, please be patient...'; }
  if (status === taskStatuses.DONE && vin === values.vin) { return 'VIN predicted by our Monk AI'; }
  if (status === taskStatuses.DONE && !vin) {
    return 'Our AI seems not to have detected a VIN in the current image, but you can skip this step';
  }
  if (isUploading) { return 'Uploading the VIN image...'; }
  return 'You can always skip this step and start your inspection';
}
export default handleStatuses;
