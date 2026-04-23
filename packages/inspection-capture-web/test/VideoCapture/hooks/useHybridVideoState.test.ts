jest.mock('@monkvision/sights', () => ({
  sights: {
    'test-sight-1': { id: 'test-sight-1', label: 'Test Sight 1' },
    'test-sight-2': { id: 'test-sight-2', label: 'Test Sight 2' },
    'test-sight-3': { id: 'test-sight-3', label: 'Test Sight 3' },
  },
}));

import { renderHook } from '@testing-library/react';
import {
  VehicleType,
  TaskName,
  DeviceOrientation,
  AddDamage,
  PhotoCaptureSightGuidelinesOption,
  PhotoCaptureTutorialOption,
  PhotoCaptureSightTutorialOption,
  SteeringWheelPosition,
} from '@monkvision/types';
import { sights } from '@monkvision/sights';
import useHybridVideoState, {
  type UseHybridVideoStateParams,
} from '../../../src/VideoCapture/hooks/useHybridVideoState';
import type { VideoCaptureProps, HybridVideoProps } from '../../../src/VideoCapture/VideoCapture';

function createBaseProps(): VideoCaptureProps {
  return {
    inspectionId: 'test-inspection-id',
    apiConfig: {
      apiDomain: 'test-domain',
      authToken: 'test-token',
      thumbnailDomain: 'test-thumbnail-domain',
    },
    lang: 'en',
    additionalTasks: [TaskName.DAMAGE_DETECTION],
    enforceOrientation: DeviceOrientation.PORTRAIT,
    startTasksOnComplete: true,
    enablePhotoCapture: false,
  };
}

function createHybridPropsWithoutSteeringWheel(): HybridVideoProps {
  return {
    ...createBaseProps(),
    enablePhotoCapture: true,
    defaultVehicleType: VehicleType.SEDAN,
    allowVehicleTypeSelection: false,
    enableSteeringWheelPosition: false,
    sights: {
      [VehicleType.SEDAN]: ['test-sight-1', 'test-sight-2'],
      [VehicleType.SUV]: ['test-sight-3'],
    },
    tasksBySight: {},
    onPictureTaken: jest.fn(),
    maxUploadDurationWarning: 5000,
    showCloseButton: true,
    enableCompliance: true,
    enableCompliancePerSight: [],
    complianceIssues: [],
    complianceIssuesPerSight: {},
    customComplianceThresholds: {},
    customComplianceThresholdsPerSight: {},
    useLiveCompliance: true,
    allowSkipRetake: true,
    addDamage: AddDamage.PART_SELECT,
    sightGuidelines: [],
    enableSightGuidelines: PhotoCaptureSightGuidelinesOption.ENABLED,
    enableTutorial: PhotoCaptureTutorialOption.ENABLED,
    allowSkipTutorial: true,
    enableSightTutorial: PhotoCaptureSightTutorialOption.DISABLED,
    sightTutorial: [],
    useAdaptiveImageQuality: true,
    autoDeletePreviousSightImages: false,
  };
}

function createHybridPropsWithSteeringWheel(): HybridVideoProps {
  return {
    ...createBaseProps(),
    enablePhotoCapture: true,
    defaultVehicleType: VehicleType.SEDAN,
    allowVehicleTypeSelection: false,
    enableSteeringWheelPosition: true,
    defaultSteeringWheelPosition: SteeringWheelPosition.LEFT,
    sights: {
      left: {
        [VehicleType.SEDAN]: ['test-sight-1', 'test-sight-2'],
        [VehicleType.SUV]: ['test-sight-3'],
      },
      right: {
        [VehicleType.SEDAN]: ['test-sight-2'],
        [VehicleType.SUV]: ['test-sight-1', 'test-sight-3'],
      },
    } as any,
    tasksBySight: {},
    onPictureTaken: jest.fn(),
    maxUploadDurationWarning: 5000,
    showCloseButton: true,
    enableCompliance: true,
    enableCompliancePerSight: [],
    complianceIssues: [],
    complianceIssuesPerSight: {},
    customComplianceThresholds: {},
    customComplianceThresholdsPerSight: {},
    useLiveCompliance: true,
    allowSkipRetake: true,
    addDamage: AddDamage.PART_SELECT,
    sightGuidelines: [],
    enableSightGuidelines: PhotoCaptureSightGuidelinesOption.ENABLED,
    enableTutorial: PhotoCaptureTutorialOption.ENABLED,
    allowSkipTutorial: true,
    enableSightTutorial: PhotoCaptureSightTutorialOption.DISABLED,
    sightTutorial: [],
    useAdaptiveImageQuality: true,
    autoDeletePreviousSightImages: false,
  } as HybridVideoProps;
}

function createParams(props: VideoCaptureProps): UseHybridVideoStateParams {
  return {
    props,
    allowRedirect: jest.fn(),
  };
}

describe('useHybridVideoState hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when photo capture is disabled', () => {
    it('should return enablePhotoCapture as false', () => {
      const props = createBaseProps();
      const params = createParams(props);
      const { result, unmount } = renderHook(() => useHybridVideoState(params));

      expect(result.current.enablePhotoCapture).toBe(false);
      unmount();
    });

    it('should return null for photoCaptureConfig', () => {
      const props = createBaseProps();
      const params = createParams(props);
      const { result, unmount } = renderHook(() => useHybridVideoState(params));

      expect(result.current.photoCaptureConfig).toBeNull();
      unmount();
    });

    it('should not compute photo capture sights', () => {
      const props = createBaseProps();
      const params = createParams(props);
      const { result, unmount } = renderHook(() => useHybridVideoState(params));

      expect(result.current.photoCaptureConfig).toBeNull();
      unmount();
    });
  });

  describe('when photo capture is enabled without steering wheel position', () => {
    it('should return enablePhotoCapture as true', () => {
      const props = createHybridPropsWithoutSteeringWheel();
      const params = createParams(props);
      const { result, unmount } = renderHook(() => useHybridVideoState(params));

      expect(result.current.enablePhotoCapture).toBe(true);
      unmount();
    });

    it('should use defaultVehicleType when provided', () => {
      const props = createHybridPropsWithoutSteeringWheel();
      props.defaultVehicleType = VehicleType.SEDAN;
      const params = createParams(props);
      const { result, unmount } = renderHook(() => useHybridVideoState(params));

      expect(result.current.photoCaptureConfig?.vehicleType).toBe(VehicleType.SEDAN);

      unmount();
    });

    it('should pass undefined vehicleType when defaultVehicleType is not provided', () => {
      const props = createHybridPropsWithoutSteeringWheel();
      (props as any).defaultVehicleType = undefined;
      const params = createParams(props);
      const { result, unmount } = renderHook(() => useHybridVideoState(params));

      expect(result.current.photoCaptureConfig?.vehicleType).toBeUndefined();
      unmount();
    });

    it('should compute photo capture sights based on vehicle type', () => {
      const props = createHybridPropsWithoutSteeringWheel();
      props.defaultVehicleType = VehicleType.SEDAN;
      const params = createParams(props);
      const { result, unmount } = renderHook(() => useHybridVideoState(params));

      expect(result.current.photoCaptureConfig?.sights).toEqual([
        sights['test-sight-1'],
        sights['test-sight-2'],
      ]);
      unmount();
    });

    it('should compute different sights for different vehicle types', () => {
      const props = createHybridPropsWithoutSteeringWheel();
      props.defaultVehicleType = VehicleType.SUV;
      const params = createParams(props);
      const { result, unmount } = renderHook(() => useHybridVideoState(params));

      expect(result.current.photoCaptureConfig?.sights).toEqual([sights['test-sight-3']]);
      unmount();
    });

    it('should throw an error when no sights are found for the vehicle type', () => {
      const props = createHybridPropsWithoutSteeringWheel();
      props.defaultVehicleType = VehicleType.HATCHBACK;
      const params = createParams(props);

      expect(() => {
        renderHook(() => useHybridVideoState(params));
      }).toThrow(
        'Invalid application configuration. No sights have been found for the current vehicle type and steering wheel position.',
      );
    });

    it('should throw an error when a sight ID does not exist', () => {
      const props = createHybridPropsWithoutSteeringWheel();
      props.sights = {
        [VehicleType.SEDAN]: ['invalid-sight-id'],
      };
      const params = createParams(props);

      expect(() => {
        renderHook(() => useHybridVideoState(params));
      }).toThrow('Sight with ID "invalid-sight-id" does not exist.');
    });
  });

  describe('when photo capture is enabled with steering wheel position', () => {
    it('should return enablePhotoCapture as true', () => {
      const props = createHybridPropsWithSteeringWheel();
      const params = createParams(props);
      const { result, unmount } = renderHook(() => useHybridVideoState(params));

      expect(result.current.enablePhotoCapture).toBe(true);
      unmount();
    });

    it('should compute photo capture sights based on vehicle type and steering wheel position', () => {
      const props = createHybridPropsWithSteeringWheel();
      (props as any).defaultSteeringWheelPosition = 'left';
      props.defaultVehicleType = VehicleType.SEDAN;
      const params = createParams(props);
      const { result, unmount } = renderHook(() => useHybridVideoState(params));

      expect(result.current.photoCaptureConfig?.sights).toEqual([
        sights['test-sight-1'],
        sights['test-sight-2'],
      ]);

      unmount();
    });

    it('should compute different sights for different steering wheel positions', () => {
      const props = createHybridPropsWithSteeringWheel();
      (props as any).defaultSteeringWheelPosition = 'right';
      props.defaultVehicleType = VehicleType.SEDAN;
      const params = createParams(props);
      const { result, unmount } = renderHook(() => useHybridVideoState(params));

      expect(result.current.photoCaptureConfig?.sights).toEqual([sights['test-sight-2']]);
      unmount();
    });

    it('should compute different sights for different vehicle types with steering wheel', () => {
      const props = createHybridPropsWithSteeringWheel();
      (props as any).defaultSteeringWheelPosition = 'left';
      props.defaultVehicleType = VehicleType.SUV;
      const params = createParams(props);
      const { result, unmount } = renderHook(() => useHybridVideoState(params));

      expect(result.current.photoCaptureConfig?.sights).toEqual([sights['test-sight-3']]);
      unmount();
    });

    it('should throw an error when no sights are found for the vehicle type and steering wheel position', () => {
      const props = createHybridPropsWithSteeringWheel();
      (props as any).defaultSteeringWheelPosition = 'center';
      props.defaultVehicleType = VehicleType.SEDAN;
      const params = createParams(props);

      expect(() => {
        renderHook(() => useHybridVideoState(params));
      }).toThrow(
        'Invalid application configuration. No sights have been found for the current vehicle type and steering wheel position.',
      );
    });

    it('should throw an error when a sight ID does not exist with steering wheel position', () => {
      const props = createHybridPropsWithSteeringWheel();
      (props.sights as any) = {
        left: {
          [VehicleType.SEDAN]: ['invalid-sight-id'],
        },
      };
      const params = createParams(props);

      expect(() => {
        renderHook(() => useHybridVideoState(params));
      }).toThrow('Sight with ID "invalid-sight-id" does not exist.');
    });
  });

  describe('photo capture config', () => {
    it('should include all required props from video capture props', () => {
      const props = createHybridPropsWithoutSteeringWheel();
      const params = createParams(props);
      const { result, unmount } = renderHook(() => useHybridVideoState(params));

      const config = result.current.photoCaptureConfig;
      expect(config).toMatchObject({
        inspectionId: props.inspectionId,
        apiConfig: props.apiConfig,
        lang: props.lang,
        additionalTasks: props.additionalTasks,
        enforceOrientation: props.enforceOrientation,
        startTasksOnComplete: props.startTasksOnComplete,
        vehicleType: props.defaultVehicleType,
        tasksBySight: props.tasksBySight,
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
      });

      unmount();
    });

    it('should include onComplete callback that calls allowRedirect and props.onComplete', () => {
      const props = createHybridPropsWithoutSteeringWheel();
      props.onComplete = jest.fn();
      const params = createParams(props);
      const { result, unmount } = renderHook(() => useHybridVideoState(params));

      const config = result.current.photoCaptureConfig;
      expect(config?.onComplete).toBeDefined();

      config?.onComplete?.();

      expect(params.allowRedirect).toHaveBeenCalledTimes(1);
      expect(props.onComplete).toHaveBeenCalledTimes(1);

      unmount();
    });

    it('should handle missing onComplete prop gracefully', () => {
      const props = createHybridPropsWithoutSteeringWheel();
      props.onComplete = undefined;
      const params = createParams(props);
      const { result, unmount } = renderHook(() => useHybridVideoState(params));

      const config = result.current.photoCaptureConfig;
      expect(config?.onComplete).toBeDefined();

      expect(() => {
        config?.onComplete?.();
      }).not.toThrow();

      expect(params.allowRedirect).toHaveBeenCalledTimes(1);

      unmount();
    });

    it('should use enforcePhotoCaptureOrientation when provided', () => {
      const props = createHybridPropsWithoutSteeringWheel();
      props.enforceOrientation = DeviceOrientation.LANDSCAPE;
      (props as any).enforcePhotoCaptureOrientation = DeviceOrientation.PORTRAIT;
      const params = createParams(props);
      const { result, unmount } = renderHook(() => useHybridVideoState(params));

      const config = result.current.photoCaptureConfig;
      expect(config?.enforceOrientation).toBe(DeviceOrientation.PORTRAIT);

      unmount();
    });

    it('should fall back to enforceOrientation when enforcePhotoCaptureOrientation is not provided', () => {
      const props = createHybridPropsWithoutSteeringWheel();
      props.enforceOrientation = DeviceOrientation.LANDSCAPE;
      const params = createParams(props);
      const { result, unmount } = renderHook(() => useHybridVideoState(params));

      const config = result.current.photoCaptureConfig;
      expect(config?.enforceOrientation).toBe(DeviceOrientation.LANDSCAPE);

      unmount();
    });

    it('should use enforcePhotoCaptureOrientation even when it is undefined and enforceOrientation is set', () => {
      const props = createHybridPropsWithoutSteeringWheel();
      props.enforceOrientation = DeviceOrientation.PORTRAIT;
      (props as any).enforcePhotoCaptureOrientation = undefined;
      const params = createParams(props);
      const { result, unmount } = renderHook(() => useHybridVideoState(params));

      const config = result.current.photoCaptureConfig;
      expect(config?.enforceOrientation).toBe(DeviceOrientation.PORTRAIT);

      unmount();
    });
  });

  describe('memoization', () => {
    it('should recompute photo capture sights when enablePhotoCapture changes', () => {
      const props = createBaseProps();
      const params = createParams(props);
      const { result, rerender, unmount } = renderHook(
        (p: UseHybridVideoStateParams) => useHybridVideoState(p),
        { initialProps: params },
      );

      const initialConfig = result.current.photoCaptureConfig;
      expect(initialConfig).toBeNull();

      const newProps = createHybridPropsWithoutSteeringWheel();
      const newParams = createParams(newProps);
      rerender(newParams);

      expect(result.current.photoCaptureConfig).not.toBeNull();
      expect(result.current.photoCaptureConfig).not.toBe(initialConfig);

      unmount();
    });

    it('should recompute photo capture sights when props change', () => {
      const props = createHybridPropsWithoutSteeringWheel();
      props.defaultVehicleType = VehicleType.SEDAN;
      const params = createParams(props);
      const { result, rerender, unmount } = renderHook(
        (p: UseHybridVideoStateParams) => useHybridVideoState(p),
        { initialProps: params },
      );

      const initialSights = result.current.photoCaptureConfig?.sights;
      expect(initialSights).toEqual([sights['test-sight-1'], sights['test-sight-2']]);

      const newProps = createHybridPropsWithoutSteeringWheel();
      newProps.defaultVehicleType = VehicleType.SUV;
      const newParams = createParams(newProps);
      rerender(newParams);

      expect(result.current.photoCaptureConfig?.sights).toEqual([sights['test-sight-3']]);
      expect(result.current.photoCaptureConfig?.sights).not.toBe(initialSights);

      unmount();
    });

    it('should recompute photo capture config when any relevant prop changes', () => {
      const props = createHybridPropsWithoutSteeringWheel();
      const params = createParams(props);
      const { result, rerender, unmount } = renderHook(
        (p: UseHybridVideoStateParams) => useHybridVideoState(p),
        { initialProps: params },
      );

      const initialConfig = result.current.photoCaptureConfig;

      const newProps = createHybridPropsWithoutSteeringWheel();
      newProps.lang = 'fr';
      const newParams = createParams(newProps);
      rerender(newParams);

      expect(result.current.photoCaptureConfig).not.toBe(initialConfig);
      expect(result.current.photoCaptureConfig?.lang).toBe('fr');

      unmount();
    });

    it('should maintain same config reference when props do not change', () => {
      const props = createHybridPropsWithoutSteeringWheel();
      const params = createParams(props);
      const { result, rerender, unmount } = renderHook(
        (p: UseHybridVideoStateParams) => useHybridVideoState(p),
        { initialProps: params },
      );

      const initialConfig = result.current.photoCaptureConfig;

      rerender(params);

      expect(result.current.photoCaptureConfig).toBe(initialConfig);
      unmount();
    });
  });
});
