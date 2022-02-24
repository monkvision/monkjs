import { Platform } from 'react-native';

/**
 * getWebFileData
 * Web only
 * @param blob
 * @param sights
 * @param inspectionId
 * @param settings
 * @return {Promise<FormData>}
 */
export default async function getWebFileData(blob, sights, inspectionId, settings, task = 'damage_detection') {
  if (Platform.OS !== 'web') {
    throw Error('`getWebFileData()` is only available on the browser');
  }

  const { id } = sights.state.current.metadata;

  const filename = `${id}-${inspectionId}.jpg`;
  const multiPartKeys = { image: 'image', json: 'json', filename, type: 'image/jpg' };

  const json = JSON.stringify({
    acquisition: { strategy: 'upload_multipart_form_keys', file_key: multiPartKeys.image },
    compliances: { image_quality_assessment: {} },
    tasks: [task],
    additional_data: {
      ...sights.state.current.metadata,
      overlay: undefined,
      ...settings,
    },
  });

  const data = new FormData();
  data.append(multiPartKeys.json, json);

  const file = await new File(
    [blob],
    multiPartKeys.filename,
    { type: multiPartKeys.type },
  );

  data.append(multiPartKeys.image, file);

  return data;
}
