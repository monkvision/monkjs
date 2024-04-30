import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button, Spinner } from '@monkvision/common-ui-web';
import { CreateInspectionOptions, useMonkApi } from '@monkvision/network';
import { getEnvOrThrow, useLoadingState, useMonkAppParams } from '@monkvision/common';
import { useMonitoring } from '@monkvision/monitoring';
import { TaskName } from '@monkvision/types';
import { Page } from '../pages';
import styles from './CreateInspectionPage.module.css';

const options: CreateInspectionOptions = {
  tasks: [
    TaskName.DAMAGE_DETECTION,
    TaskName.WHEEL_ANALYSIS,
    {
      name: TaskName.HUMAN_IN_THE_LOOP,
      callbacks: [
        {
          url: 'https://webhook.site/15f8682f-91a8-4df0-8e73-74adc6c74ca4',
          headers: {},
          params: {},
        },
      ],
    },
  ],
};

enum CreateInspectionPageError {
  CREATE_INSPECTION = 'create-inspection.errors.create-inspection',
  MISSING_INSPECTION_ID = 'create-inspection.errors.missing-inspection-id',
}

export function CreateInspectionPage() {
  const loading = useLoadingState();
  const { t } = useTranslation();
  const { handleError } = useMonitoring();
  const { authToken, inspectionId, setInspectionId } = useMonkAppParams();
  const { createInspection } = useMonkApi({
    authToken: authToken ?? '',
    apiDomain: getEnvOrThrow('REACT_APP_API_DOMAIN'),
  });

  const handleCreateInspection = () => {
    loading.start();
    createInspection(options)
      .then((res) => {
        loading.onSuccess();
        setInspectionId(res.id);
      })
      .catch((err) => {
        loading.onError(CreateInspectionPageError.CREATE_INSPECTION);
        handleError(err);
      });
  };

  useEffect(() => {
    if (!inspectionId) {
      if (process.env['REACT_APP_ALLOW_CREATE_INSPECTION'] === 'true') {
        // On local environment, we allow creating the inspection if the ID is not provided.
        loading.start();
        handleCreateInspection();
      } else {
        loading.onError(CreateInspectionPageError.MISSING_INSPECTION_ID);
      }
    }
  }, [inspectionId]);

  if (inspectionId) {
    return <Navigate to={Page.PHOTO_CAPTURE} replace />;
  }

  return (
    <div className={styles['container']}>
      {loading.isLoading && <Spinner size={80} />}
      {!loading.isLoading && loading.error && (
        <>
          <div className={styles['error-message']}>{t(loading.error)}</div>
          {loading.error === CreateInspectionPageError.CREATE_INSPECTION && (
            <div className={styles['retry-btn-container']}>
              <Button variant='outline' icon='refresh' onClick={handleCreateInspection}>
                {t('create-inspection.errors.retry')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
