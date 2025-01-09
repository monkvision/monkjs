import { useAnalytics } from '@monkvision/analytics';
import { Camera, CameraHUDProps, CameraProps } from '@monkvision/camera-web';
import {
  useI18nSync,
  useLoadingState,
  useObjectMemo,
  useWindowDimensions,
} from '@monkvision/common';
import { BackdropDialog, Icon, InspectionGallery } from '@monkvision/common-ui-web';
import { MonkApiConfig } from '@monkvision/network';
import {
  AddDamage,
  CameraConfig,
  CaptureAppConfig,
  ComplianceOptions,
  CompressionOptions,
  DeviceOrientation,
  ImageType,
  MonkPicture,
} from '@monkvision/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { styles } from './DamageDisclosure.styles';
import { DamageDisclosureHUD, DamageDisclosureHUDProps } from './DamageDisclosureHUD';
import { useDamageDisclosureState } from './hooks';
import {
  useAdaptiveCameraConfig,
  useAddDamageMode,
  usePhotoCaptureImages,
  usePictureTaken,
  useUploadQueue,
  useBadConnectionWarning,
  useTracking,
} from '../hooks';
import { CaptureScreen } from '../types';

/**
 * Props of the DamageDisclosure component.
 */
export interface DamageDisclosureProps
  extends Pick<CameraProps<DamageDisclosureHUDProps>, 'resolution' | 'allowImageUpscaling'>,
    Pick<
      CaptureAppConfig,
      | keyof CameraConfig
      | 'maxUploadDurationWarning'
      | 'useAdaptiveImageQuality'
      | 'showCloseButton'
      | 'enforceOrientation'
      | 'addDamage'
    >,
    Partial<CompressionOptions>,
    Partial<ComplianceOptions> {
  /**
   * The ID of the inspection to add images to. Make sure that the user that created the inspection if the same one as
   * the one described in the auth token in the `apiConfig` prop.
   */
  inspectionId: string;
  /**
   * The api config used to communicate with the API. Make sure that the user described in the auth token is the same
   * one as the one that created the inspection provided in the `inspectionId` prop.
   */
  apiConfig: MonkApiConfig;
  /**
   * Callback called when the user clicks on the Close button. If this callback is not provided, the button will not be
   * displayed on the screen.
   */
  onClose?: () => void;
  /**
   * Callback called when damage disclosure is complete.
   */
  onComplete?: () => void;
  /**
   * Callback called when a picture has been taken by the user.
   */
  onPictureTaken?: (picture: MonkPicture) => void;
  /**
   * The language to be used by this component.
   *
   * @default en
   */
  lang?: string | null;
}

// No ts-doc for this component : the component exported is DamageDisclosureHOC
export function DamageDisclosure({
  inspectionId,
  apiConfig,
  onClose,
  onComplete,
  onPictureTaken,
  enableCompliance = true,
  complianceIssues,
  customComplianceThresholds,
  useLiveCompliance = false,
  maxUploadDurationWarning = 15000,
  showCloseButton = false,
  addDamage = AddDamage.PART_SELECT,
  useAdaptiveImageQuality = true,
  lang,
  enforceOrientation,
  ...initialCameraConfig
}: DamageDisclosureProps) {
  useI18nSync(lang);
  const complianceOptions: ComplianceOptions = useObjectMemo({
    enableCompliance,
    complianceIssues,
    useLiveCompliance,
    customComplianceThresholds,
  });
  const { t } = useTranslation();
  const [currentScreen, setCurrentScreen] = useState(CaptureScreen.CAMERA);
  const dimensions = useWindowDimensions();
  const analytics = useAnalytics();
  const loading = useLoadingState();
  const handleOpenGallery = () => {
    setCurrentScreen(CaptureScreen.GALLERY);
    analytics.trackEvent('Gallery Opened');
  };
  const addDamageHandle = useAddDamageMode({
    addDamage,
    currentScreen,
    damageDisclosure: true,
    handleOpenGallery,
  });
  const disclosureState = useDamageDisclosureState({
    inspectionId,
    apiConfig,
    loading,
    complianceOptions,
  });
  useTracking({ inspectionId, authToken: apiConfig.authToken });
  const { adaptiveCameraConfig, uploadEventHandlers: adaptiveUploadEventHandlers } =
    useAdaptiveCameraConfig({
      initialCameraConfig,
      useAdaptiveImageQuality,
    });
  const {
    isBadConnectionWarningDialogDisplayed,
    closeBadConnectionWarningDialog,
    uploadEventHandlers: badConnectionWarningUploadEventHandlers,
  } = useBadConnectionWarning({ maxUploadDurationWarning });
  const uploadQueue = useUploadQueue({
    inspectionId,
    apiConfig,
    complianceOptions,
    eventHandlers: [adaptiveUploadEventHandlers, badConnectionWarningUploadEventHandlers],
  });
  const images = usePhotoCaptureImages(inspectionId);
  const handlePictureTaken = usePictureTaken({
    captureState: disclosureState,
    addDamageHandle,
    uploadQueue,
    onPictureTaken,
  });
  const handleGalleryBack = () => {
    setCurrentScreen(CaptureScreen.CAMERA);
  };
  const isViolatingEnforcedOrientation =
    enforceOrientation &&
    (enforceOrientation === DeviceOrientation.PORTRAIT) !== dimensions.isPortrait;
  const hudProps: Omit<DamageDisclosureHUDProps, keyof CameraHUDProps> = {
    inspectionId,
    mode: addDamageHandle.mode,
    vehicleParts: addDamageHandle.vehicleParts,
    lastPictureTakenUri: disclosureState.lastPictureTakenUri,
    onOpenGallery: handleOpenGallery,
    onAddDamage: addDamageHandle.handleAddDamage,
    onAddDamagePartsSelected: addDamageHandle.handleAddDamagePartsSelected,
    onCancelAddDamage: addDamageHandle.handleCancelAddDamage,
    onRetry: disclosureState.retryLoadingInspection,
    loading,
    onClose,
    showCloseButton,
    images,
    addDamage,
    onValidateVehicleParts: addDamageHandle.handleValidateVehicleParts,
  };

  return (
    <div style={styles['container']}>
      {currentScreen === CaptureScreen.CAMERA && isViolatingEnforcedOrientation && (
        <div style={styles['orientationErrorContainer']}>
          <div style={styles['orientationErrorTitleContainer']}>
            <Icon icon='rotate' primaryColor='text-primary' size={30} />
            <div style={styles['orientationErrorTitle']}>{t('photo.orientationError.title')}</div>
          </div>
          <div style={styles['orientationErrorDescription']}>
            {t('photo.orientationError.description')}
          </div>
        </div>
      )}
      {currentScreen === CaptureScreen.CAMERA && !isViolatingEnforcedOrientation && (
        <Camera
          HUDComponent={DamageDisclosureHUD}
          onPictureTaken={handlePictureTaken}
          hudProps={hudProps}
          {...adaptiveCameraConfig}
        />
      )}
      {currentScreen === CaptureScreen.GALLERY && (
        <InspectionGallery
          inspectionId={inspectionId}
          sights={[]}
          apiConfig={apiConfig}
          captureMode={true}
          lang={lang}
          showBackButton={true}
          onBack={handleGalleryBack}
          onNavigateToCapture={handleGalleryBack}
          onValidate={onComplete}
          addDamage={addDamage}
          validateButtonLabel={t('photo.gallery.next')}
          isInspectionCompleted={false}
          filterByImageType={ImageType.CLOSE_UP}
        />
      )}
      <BackdropDialog
        show={isBadConnectionWarningDialogDisplayed}
        showCancelButton={false}
        dialogIcon='warning-outline'
        dialogIconPrimaryColor='caution-base'
        message={t('photo.badConnectionWarning.message')}
        confirmLabel={t('photo.badConnectionWarning.confirm')}
        onConfirm={closeBadConnectionWarningDialog}
      />
    </div>
  );
}
