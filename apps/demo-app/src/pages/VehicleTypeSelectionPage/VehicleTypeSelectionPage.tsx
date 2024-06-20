import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { VehicleTypeSelection } from '@monkvision/common-ui-web';
import { useMonkAppState } from '@monkvision/common';
import { Page } from '../pages';

export function VehicleTypeSelectionPage() {
  const { config, vehicleType, authToken, inspectionId, setVehicleType } = useMonkAppState();
  const { i18n } = useTranslation();

  if (vehicleType || !config.allowVehicleTypeSelection) {
    return <Navigate to={Page.PHOTO_CAPTURE} replace />;
  }

  return (
    <VehicleTypeSelection
      onSelectVehicleType={setVehicleType}
      lang={i18n.language}
      inspectionId={inspectionId ?? ''}
      authToken={authToken ?? ''}
      apiDomain={config.apiDomain}
    />
  );
}
