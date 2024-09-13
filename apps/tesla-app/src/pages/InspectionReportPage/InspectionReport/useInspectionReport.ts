import { LoadingState, useLoadingState } from '@monkvision/common';
import { MonkApiConfig, useMonkApi } from '@monkvision/network';
import { useEffect, useState } from 'react';

export interface InspectionReportParams {
  apiConfig: MonkApiConfig;
  inspectionId: string;
  loading: LoadingState;
}

export function useInspectionReport({ inspectionId, apiConfig, loading }: InspectionReportParams) {
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
      console.log(fetchedInspection.entities);

      loading.onSuccess();
      fetchedInspection.entities.images.forEach((image) => {
        const imgPath = new Image();
        const imgRenderedOutput = new Image();
        imgPath.src = image.path;
        const renderedOutput = fetchedInspection.entities.renderedOutputs.find(
          (item) => item.id === image.renderedOutputs[1],
        );
        imgRenderedOutput.src = renderedOutput?.path ?? '';
      });
    };

    fetchInspection()
      .then(loading.onSuccess)
      .catch((e) => {
        loading.onError('GET inspection failed: wrong inspection ID');
        console.error('getInspection failed', e);
      });
  }, [inspectionId]);
}
