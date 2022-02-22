import { Platform } from 'react-native';

/**
 * getWebFileData
 * Web only
 * @param picture
 * @param sights
 * @param inspectionId
 * @param settings
 * @return {Promise<FormData>}
 */
export default async function getWebFileData(picture, sights, inspectionId, settings) {
  if (Platform.OS !== 'web') {
    throw Error('`getWebFileData()` is only available on the browser');
  }

  const { uri } = picture;
  const { id } = sights.state.current.metadata;

  const filename = `${id}-${inspectionId}.jpg`;
  const multiPartKeys = { image: 'image', json: 'json', filename, type: 'image/jpg' };

  const json = JSON.stringify({
    acquisition: { strategy: 'upload_multipart_form_keys', file_key: multiPartKeys.image },
    compliances: { iqa_compliance: {} },
    tasks: ['damage_detection'],
    additional_data: {
      ...sights.state.current.metadata,
      width: picture.width,
      height: picture.height,
      exif: picture.exif,
      overlay: undefined,
      ...settings,
    },
  });

  const data = new FormData();
  data.append(multiPartKeys.json, json);

  const blobUri = await fetch(uri);
  const blob = await blobUri.blob();
  const file = await new File(
    [blob],
    multiPartKeys.filename,
    { type: multiPartKeys.type },
  );

  data.append(multiPartKeys.image, file);

  return data;
}
