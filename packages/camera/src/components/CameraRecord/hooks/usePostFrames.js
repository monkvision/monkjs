import { useCallback, useState } from 'react';
import { manipulateAsync } from 'expo-image-manipulator';

import monk from '@monkvision/corejs';

export default function usePostFrames(inspectionId, sensors) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = useCallback(async (uri, index) => {
    const multiPartKeys = {
      image: 'image',
      json: 'json',
      filename: `${index}-${inspectionId}.png`,
      type: 'image/png',
    };

    const jsonData = JSON.stringify({
      acquisition: {
        strategy: 'upload_multipart_form_keys',
        file_key: multiPartKeys.image,
      },
      tasks: ['damage_detection'],
    });

    fetch(uri).then((res) => res.blob()) // res.arrayBuffer()
      .then((buf) => new File(
        [buf],
        multiPartKeys.filename,
        { type: multiPartKeys.type },
      ))
      .then((imageFile) => {
        const data = new FormData();
        data.append(multiPartKeys.json, jsonData);
        data.append(multiPartKeys.image, imageFile);

        setUploading(true);
        monk.entity.image.addOne(inspectionId, data);
        setUploading(false);
      });
  }, [inspectionId, sensors]);

  const handleCompress = useCallback(async ({ src }, index) => {
    const compressedFile = await manipulateAsync(src, [], { compress: 0.7 });
    return { uri: compressedFile.uri, index };
  }, []);

  // Note: Here we map on every frame to compress and upload
  // useEffect(() => {
  //   frames.forEach(async (frame, index) => {
  //     const result = await handleCompress(frame, index);
  //     await handleUpload(result.uri, result.index);
  //   });
  // }, [handleCompress]);

  return { handleCompress, handleUpload, uploading };
}
