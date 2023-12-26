import { Sight } from '@monkvision/types';
import { SightOverlay } from '@monkvision/common-ui-web';
import { usePhotoCaptureHUDPreview } from '../PhotoCaptureHUDPreviewSight/hook';

export interface PhotoCaptureHUDSightsOverlayProps {
  sight: Sight;
}

export function PhotoCaptureHUDSightsOverlay({ sight }: PhotoCaptureHUDSightsOverlayProps) {
  const style = usePhotoCaptureHUDPreview();
  return <SightOverlay style={style.sightOverlay} sight={sight} />;
}
