import { useMemo } from 'react';
import { sights } from '@monkvision/sights';
import { type Sight, VehicleType } from '@monkvision/types';
import type { PreventExitListenerResult } from '@monkvision/common/lib/PreventExit/store';
import type { HybridVideoProps, VideoCaptureProps } from '../VideoCapture';
import type { PhotoCaptureProps } from '../../PhotoCapture';

function isHybridVideoProps(props: VideoCaptureProps): props is HybridVideoProps {
  return props.enableHybridVideo === true;
}

/**
 * Params of the useHybridVideoState hook.
 */
export interface UseHybridVideoStateParams
  extends Pick<PreventExitListenerResult, 'allowRedirect'> {
  props: VideoCaptureProps;
}

export default function useHybridVideoState({ props, allowRedirect }: UseHybridVideoStateParams) {
  const enableHybridVideo = isHybridVideoProps(props);
  const {
    inspectionId,
    apiConfig,
    lang,
    additionalTasks,
    startTasksOnComplete,
    enforceOrientation,
  } = props;

  const photoCaptureSights: Sight[] = useMemo(() => {
    if (!enableHybridVideo) {
      return [];
    }

    let sightIds: string[] | undefined;
    const vehicleType: VehicleType = props.defaultVehicleType ?? VehicleType.SEDAN;

    if (!props.enableSteeringWheelPosition) {
      const sightsConfig = props.sights as Partial<Record<VehicleType, string[]>>;
      sightIds = sightsConfig[vehicleType];
    } else {
      type PropsWithSteeringWheel = typeof props & { defaultSteeringWheelPosition: string };

      const sightsConfig = props.sights as Record<string, Partial<Record<VehicleType, string[]>>>;
      const defaultSteeringWheel = (props as PropsWithSteeringWheel).defaultSteeringWheelPosition;
      sightIds = sightsConfig[defaultSteeringWheel]?.[vehicleType];
    }

    if (!sightIds) {
      throw new Error(
        'Invalid application configuration. No sights have been found for the current vehicle type and steering wheel position.',
      );
    }

    return sightIds.map((id) => {
      if (!sights[id]) {
        throw new Error(`Sight with ID "${id}" does not exist.`);
      }
      return sights[id];
    });
  }, [enableHybridVideo, props]);

  const handlePhotoCaptureComplete = () => {
    allowRedirect();
    props.onComplete?.();
  };

  const photoCaptureConfig = useMemo((): PhotoCaptureProps | null => {
    if (!enableHybridVideo) {
      return null;
    }

    return {
      inspectionId,
      apiConfig,
      lang,
      additionalTasks,
      enforceOrientation: props.enforcePhotoCaptureOrientation ?? enforceOrientation,
      startTasksOnComplete,
      sights: photoCaptureSights,
      vehicleType: props.defaultVehicleType,
      tasksBySight: props.tasksBySight,
      onComplete: handlePhotoCaptureComplete,
      onPictureTaken: props.onPictureTaken,
      maxUploadDurationWarning: props.maxUploadDurationWarning,
      showCloseButton: props.showCloseButton,
      enableCompliance: props.enableCompliance,
      enableCompliancePerSight: props.enableCompliancePerSight,
      complianceIssues: props.complianceIssues,
      complianceIssuesPerSight: props.complianceIssuesPerSight,
      customComplianceThresholds: props.customComplianceThresholds,
      customComplianceThresholdsPerSight: props.customComplianceThresholdsPerSight,
      useLiveCompliance: props.useLiveCompliance,
      allowSkipRetake: props.allowSkipRetake,
      addDamage: props.addDamage,
      sightGuidelines: props.sightGuidelines,
      enableSightGuidelines: props.enableSightGuidelines,
      enableTutorial: props.enableTutorial,
      allowSkipTutorial: props.allowSkipTutorial,
      enableSightTutorial: props.enableSightTutorial,
      sightTutorial: props.sightTutorial,
      useAdaptiveImageQuality: props.useAdaptiveImageQuality,
      autoDeletePreviousSightImages: props.autoDeletePreviousSightImages,
    } satisfies PhotoCaptureProps;
  }, [
    enableHybridVideo,
    photoCaptureSights,
    inspectionId,
    apiConfig,
    props,
    additionalTasks,
    startTasksOnComplete,
    lang,
    enforceOrientation,
  ]);

  return {
    enableHybridVideo,
    photoCaptureConfig,
  };
}
