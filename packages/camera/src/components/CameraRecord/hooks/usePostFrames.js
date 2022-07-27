import { useCallback, useEffect, useState } from 'react';
import { manipulateAsync } from 'expo-image-manipulator';

import monk from '@monkvision/corejs';
import { frames } from '../Mocks';

export default function usePostFrames(inspectionId, sensors) {
  const [uploading, setUploading] = useState(false);
  // upload each one

  const handleUpload = useCallback(async (uri, index) => {
    const fileType = 'jpg';
    const filename = `${index}-${inspectionId}.${fileType}`;
    const type = `image/${fileType}`;
    const multiPartKeys = { image: 'image', json: 'json', filename, type };

    const json = JSON.stringify({
      acquisition: {
        strategy: 'upload_multipart_form_keys',
        file_key: multiPartKeys.image,
      },
      compliances: {
        image_quality_assessment: {},
        coverage_360: undefined,
      },
      tasks: ['damage_detection'],
      additional_data: {
        overlay: undefined,
        createdAt: new Date(),
        ...sensors,
      },
    });

    const data = new FormData();
    data.append(multiPartKeys.json, json);
    data.append(multiPartKeys.image, {
      uri,
      name: multiPartKeys.filename,
      type: multiPartKeys.type,
    });

    setUploading(true);
    await monk.entity.image.addOne(inspectionId, data);
    setUploading(false);
  }, [inspectionId, sensors]);

  const handleCompress = useCallback(async ({ src }, index) => {
    const compressedFile = await manipulateAsync(src, [], { compress: 0.7 });
    handleUpload(compressedFile.uri, {}, index);
    return compressedFile.uri;
  }, []);

  useEffect(() => {
    frames.forEach((frame, index) => handleCompress(frame, index));
  }, [handleCompress]);

  return { handleCompress, handleUpload, uploading };
}
