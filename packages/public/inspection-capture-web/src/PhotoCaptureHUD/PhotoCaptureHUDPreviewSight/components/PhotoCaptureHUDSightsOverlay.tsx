import { Sight } from '@monkvision/types';
import { SightOverlay } from '@monkvision/common-ui-web';
import { usePhotoCaptureHUDPreview } from '../hook';

export interface PhotoCaptureHUDSightsOverlayProps {
  sight?: Sight;
}

export function PhotoCaptureHUDSightsOverlay({ sight }: PhotoCaptureHUDSightsOverlayProps) {
  const style = usePhotoCaptureHUDPreview();
  return sight ? <SightOverlay style={style.sightOverlay} sight={sight} /> : null;
}
