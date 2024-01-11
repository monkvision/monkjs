import { useMemo } from 'react';
import { Sight } from '@monkvision/types';
import { CameraHUDProps } from '@monkvision/camera-web/lib/Camera/CameraHUD.types';
import { PhotoCaptureHUDButtons } from './PhotoCaptureHUDButtons';
import { PhotoCaptureHUDAddDamagePreview } from './PhotoCaptureHUDAddDamagePreview';
import { PhotoCaptureHUDSightPreview } from './PhotoCaptureHUDSightPreview';
import { HUDMode, usePhotoCaptureHUDStyle } from './hook';
import { AddDamagePreviewMode, useSightState } from './hooks';

export interface PhotoCaptureHUDProps extends CameraHUDProps {
  sights: Sight[];
}

/**
 * Displays the camera preview and HUD components for capturing photos with sights.
 *
 * @component
 *
 * @param {Sight[]} sights - The array of sights available for selection.
 *
 * @example
 * // Example usage of PhotoCaptureHUD component in Camera Component:
 * import { Camera } from '@monkvision/camera-web';
 * import { PhotoCaptureHUD } from '@monkvision/inspection-camera-web';
 *
 * export Function MyComponent () {
 *  const [sights, setSights] = useState<sights[]>([]);
 *  const hud = (props: CameraHUDProps) => <PhotoCaptureHUD sights={sights} {...props} />;
 *
 *  return (
 *    <Camera HUDComponent={hud} ...props />
 *  );
 */
export function PhotoCaptureHUD({ sights, cameraPreview, handle }: PhotoCaptureHUDProps) {
  const {
    selectedSight,
    setSelectedSight,
    sightsTaken,
    handleSightTaken,
    mode,
    setMode,
    addDamagePreviewMode,
    setAddDamagePreviewMode,
  } = useSightState(sights);
  const style = usePhotoCaptureHUDStyle();

  const hudPreview = useMemo(
    () =>
      mode === HUDMode.ADD_DAMAGE ? (
        <PhotoCaptureHUDAddDamagePreview
          onCancel={() => {
            setMode(HUDMode.DEFAULT);
            setAddDamagePreviewMode(AddDamagePreviewMode.DEFAULT);
          }}
          sight={selectedSight}
          addDamagePreviewMode={addDamagePreviewMode}
          streamDimensions={handle?.dimensions}
        />
      ) : (
        <PhotoCaptureHUDSightPreview
          sights={sights}
          selectedSight={selectedSight}
          onSelectedSight={setSelectedSight}
          sightsTaken={sightsTaken}
          onAddDamage={() => setMode(HUDMode.ADD_DAMAGE)}
          streamDimensions={handle?.dimensions}
        />
      ),
    [mode, selectedSight, sightsTaken, handle?.dimensions, addDamagePreviewMode],
  );
  return (
    <div style={style.container}>
      <div style={style.previewContainer} data-testid='camera-preview'>
        {cameraPreview}
        {hudPreview}
      </div>
      <PhotoCaptureHUDButtons
        onTakePicture={() => {
          handle?.takePicture?.();
          handleSightTaken();
        }}
      />
    </div>
  );
}
