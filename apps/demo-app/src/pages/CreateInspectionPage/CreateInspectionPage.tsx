import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button, Spinner } from '@monkvision/common-ui-web';
import { useMonkApi } from '@monkvision/network';
import { getEnvOrThrow, useLoadingState, useMonkAppParams } from '@monkvision/common';
import { useMonitoring } from '@monkvision/monitoring';
import { TaskName } from '@monkvision/types';
import { Page } from '../pages';
import styles from './CreateInspectionPage.module.css';

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
    createInspection({ tasks: [TaskName.DAMAGE_DETECTION, TaskName.WHEEL_ANALYSIS] })
      .then((res) => {
        loading.onSuccess();
        setInspectionId(res.id);
      })
      .catch((err) => {
        loading.onError(err);
        handleError(err);
      });
  };

  useEffect(() => {
    if (!inspectionId) {
      loading.start();
      handleCreateInspection();
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
          <div className={styles['error-message']}>
            {t('create-inspection.errors.create-inspection')}
          </div>
          <Button variant='outline' icon='refresh' onClick={handleCreateInspection}>
            {t('create-inspection.errors.retry')}
          </Button>
        </>
      )}
    </div>
  );
}
