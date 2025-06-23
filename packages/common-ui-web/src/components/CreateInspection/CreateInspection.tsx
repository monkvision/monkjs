import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useMonkApi } from '@monkvision/network';
import {
  i18nWrap,
  useI18nSync,
  useIsMounted,
  useLoadingState,
  useMonkAppState,
} from '@monkvision/common';
import { useMonitoring } from '@monkvision/monitoring';
import { styles } from './CreateInspection.styles';
import { i18nCreateInspection } from './i18n';
import { Spinner } from '../Spinner';
import { Button } from '../Button';

/**
 * Props accepted by the CreateInspection component.
 */
export interface CreateInspectionProps {
  /**
   * Callback called when the inspection has been created.
   */
  onInspectionCreated?: () => void;
  /**
   * The language used by the component.
   *
   * @default en
   */
  lang?: string;
}

enum CreateInspectionError {
  CREATE_INSPECTION = 'errors.create-inspection',
  MISSING_INSPECTION_ID = 'errors.missing-inspection-id',
}

/**
 * This component is a ready-to-use CreateInspection page that is used throughout the different Monk webapps to handle
 * inspection creation.
 *
 * **Note : For this component to work properly, it must be the child of a `MonkAppStateProvider` component.**
 */
export const CreateInspection = i18nWrap(function CreateInspection({
  lang,
  onInspectionCreated,
}: CreateInspectionProps) {
  useI18nSync(lang);
  const [retry, setRetry] = useState(0);
  const loading = useLoadingState();
  const { t } = useTranslation();
  const { handleError, setTags } = useMonitoring();
  const { config, authToken, inspectionId, setInspectionId } = useMonkAppState();
  const { createInspection } = useMonkApi({
    authToken: authToken ?? '',
    apiDomain: config.apiDomain,
    thumbnailDomain: config.thumbnailDomain,
  });
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!inspectionId) {
      if (config?.allowCreateInspection) {
        loading.start();
        if (config?.allowCreateInspection) {
          createInspection(config.createInspectionOptions)
            .then((res) => {
              if (isMounted()) {
                loading.onSuccess();
                setInspectionId(res.id);
              }
            })
            .catch((err) => {
              if (isMounted()) {
                loading.onError(CreateInspectionError.CREATE_INSPECTION);
                handleError(err);
              }
            });
        }
      } else {
        loading.onError(CreateInspectionError.MISSING_INSPECTION_ID);
      }
    } else {
      setTags({ inspectionId });
      onInspectionCreated?.();
    }
  }, [inspectionId, setTags, retry, isMounted]);

  return (
    <div style={styles['container']}>
      {loading.isLoading && <Spinner size={80} />}
      {!loading.isLoading && loading.error && (
        <>
          <div style={styles['errorMessage']}>{t(loading.error)}</div>
          {loading.error === CreateInspectionError.CREATE_INSPECTION && (
            <div style={styles['retryBtnContainer']}>
              <Button
                variant='outline'
                icon='refresh'
                onClick={() => setRetry((value) => value + 1)}
              >
                {t('errors.retry')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
},
i18nCreateInspection);
