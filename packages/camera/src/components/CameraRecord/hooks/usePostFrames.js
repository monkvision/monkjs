import { useCallback, useEffect, useState } from 'react';
import { manipulateAsync } from 'expo-image-manipulator';
import { Buffer } from 'buffer';

import monk from '@monkvision/corejs';
import { frames } from '../Mocks';

export default function usePostFrames(inspectionId, sensors) {
  const [uploading, setUploading] = useState(false);

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

    const buffer = Buffer.from(uri, 'base64');
    const fileBits = new Blob([buffer], { type: 'jpg' });
    const file = await new File(fileBits, multiPartKeys.filename, { type: multiPartKeys.type });

    const data = new FormData();
    data.append(multiPartKeys.json, json);
    data.append(multiPartKeys.image, file);

    setUploading(true);
    await monk.entity.image.addOne(inspectionId, data);
    setUploading(false);
  }, [inspectionId, sensors]);

  const handleCompress = useCallback(async ({ src }, index) => {
    const compressedFile = await manipulateAsync(src, [], { compress: 0.7 });
    return { uri: compressedFile.uri, index };
  }, []);

  useEffect(() => {
    frames.forEach(async (frame, index) => {
      const result = await handleCompress(frame, index);
      await handleUpload(result.uri, result.index);
    });
  }, [handleCompress]);

  return { handleCompress, handleUpload, uploading };
}
