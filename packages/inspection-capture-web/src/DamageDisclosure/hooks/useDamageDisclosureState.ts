import { useCallback, useState } from 'react';
import {
  GetInspectionResponse,
  MonkApiConfig,
  MonkApiResponse,
  useMonkApi,
} from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';
import { LoadingState, useAsyncEffect, useObjectMemo } from '@monkvision/common';
import { ComplianceOptions, Image, ImageType } from '@monkvision/types';
import { DamageDisclosureState } from '../../types';

/**
 * Parameters of the useDamageDisclosureSightState hook.
 */
export interface DamageDisclosureParams {
  /**
   * The inspection ID.
   */
  inspectionId: string;
  /**
   * The api config used to communicate with the API.
   */
  apiConfig: MonkApiConfig;
  /**
   * Global loading state of the DamageDisclosure component.
   */
  loading: LoadingState;
  /**
   * The options for the compliance conf
   */
  complianceOptions: ComplianceOptions;
}

function getLastPictureTakenUri(
  inspectionId: string,
  response: MonkApiResponse<GetInspectionResponse>,
): string | null {
  const images = response.entities.images.filter(
    (image: Image) => image.inspectionId === inspectionId && image.type === ImageType.CLOSE_UP,
  );
  return images && images.length > 0 ? images[images.length - 1].path : null;
}

/**
 * Custom hook used to manage the state of the DamageDisclosure. This state is automatically fetched from the API at
 * the start of the DamageDisclosure process in order to allow users to start the inspection where they left it before.
 */
export function useDamageDisclosureState({
  inspectionId,
  apiConfig,
  loading,
  complianceOptions,
}: DamageDisclosureParams): DamageDisclosureState {
  const [retryCount, setRetryCount] = useState(0);
  const [lastPictureTakenUri, setLastPictureTakenUri] = useState<string | null>(null);
  const { getInspection } = useMonkApi(apiConfig);
  const { handleError } = useMonitoring();

  const onFetchInspection = (response: MonkApiResponse<GetInspectionResponse>) => {
    try {
      setLastPictureTakenUri(getLastPictureTakenUri(inspectionId, response));
      loading.onSuccess();
    } catch (err) {
      handleError(err);
      loading.onError(err);
    }
  };

  useAsyncEffect(
    () => {
      loading.start();
      return getInspection({
        id: inspectionId,
        compliance: complianceOptions,
      });
    },
    [inspectionId, retryCount, complianceOptions],
    {
      onResolve: onFetchInspection,
      onReject: (err) => {
        handleError(err);
        loading.onError(err);
      },
    },
  );

  const retryLoadingInspection = useCallback(() => {
    setRetryCount((value) => value + 1);
  }, []);

  return useObjectMemo({
    lastPictureTakenUri,
    setLastPictureTakenUri,
    retryLoadingInspection,
  });
}
