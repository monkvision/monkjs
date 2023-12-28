import { Sight } from '@monkvision/types';
import { SightOverlay } from '@monkvision/common-ui-web';
import { styles } from './PhotoCaptureHUDSightOverlay.styles';

export interface PhotoCaptureHUDSightsOverlayProps {
  sight: Sight;
}

export function PhotoCaptureHUDSightOverlay({ sight }: PhotoCaptureHUDSightsOverlayProps) {
  return <SightOverlay style={styles['container']} sight={sight} />;
}
