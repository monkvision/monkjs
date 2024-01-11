import { PixelDimensions, Sight } from '@monkvision/types';
import { styles } from './PhotoCaptureHUDAddDamagePreview.styles';
import { CloseupPreview } from './CloseupPreview';
import { CrosshairPreview } from './CrosshairPreview';
import { AddDamagePreviewMode } from '../hooks';

export interface PhotoCaptureHUDAddDamageMenuProps {
  sight?: Sight | undefined;
  onCancel: () => void;
  addDamagePreviewMode: AddDamagePreviewMode;
  streamDimensions?: PixelDimensions | null;
}

export function PhotoCaptureHUDAddDamagePreview({
  onCancel,
  sight,
  addDamagePreviewMode,
  streamDimensions,
}: PhotoCaptureHUDAddDamageMenuProps) {
  function addDamagePreview() {
    return addDamagePreviewMode === AddDamagePreviewMode.DEFAULT ? (
      <CrosshairPreview onCancel={onCancel} />
    ) : (
      <CloseupPreview sight={sight} onCancel={onCancel} streamDimensions={streamDimensions} />
    );
  }

  return <div style={styles['container']}>{addDamagePreview()}</div>;
}
