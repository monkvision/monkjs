import { LoadingState, useLoadingState } from '@monkvision/common';
import { MonkApiConfig, useMonkApi } from '@monkvision/network';
import { Image } from '@monkvision/types';
import { useEffect, useState } from 'react';

export interface InspectionReportParams {
  apiConfig: MonkApiConfig;
  inspectionId: string;
  loading: LoadingState;
}

export function useInspectionReport({ inspectionId, apiConfig, loading }: InspectionReportParams) {
  const [images, setImages] = useState<Image[]>();
  const { getInspection } = useMonkApi(apiConfig);

  useEffect(() => {
    loading.start();
    const fetchInspection = async () => {
      if (!inspectionId) {
        loading.onSuccess();
        return;
      }
      const fetchedInspection = await getInspection({
        id: inspectionId,
      });

      setImages(fetchedInspection.entities.images);
      loading.onSuccess();
    };

    fetchInspection()
      .then(loading.onSuccess)
      .catch(() => {
        loading.onError('GET inspection failed: wrong inspection ID');
        console.error('getInspection failed');
      });
  }, [inspectionId]);

  return { images };
}
