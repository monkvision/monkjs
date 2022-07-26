import { useCallback, useEffect, useState } from 'react';
import { manipulateAsync } from 'expo-image-manipulator';
import { Buffer } from 'buffer';

import monk from '@monkvision/corejs';
import { frames } from '../Mocks';

export default function usePostFrames(inspectionId) {
  const [uploading, setUploading] = useState(false);
  // loop on them
  // compress & upload each one

  const handleUpload = useCallback(async (uri, sensors, index) => {
    const buffer = Buffer.from(uri, 'base64');
    const file = new Blob([buffer], { type: 'png' });

    const fileType = 'jpg';
    const filename = `${index}-${inspectionId}.${fileType}`;
    const multiPartKeys = { image: 'image', json: 'json', filename, type: `image/${fileType}` };

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

    data.append(multiPartKeys.image, file);

    setUploading(true);
    await monk.entity.image.addOne(inspectionId, data);
    setUploading(false);
  }, [inspectionId]);

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
