import { labels } from '@monkvision/sights';
import { PhotoCaptureHUDPreview } from './PhotoCaptureHUDPreview';
import { PhotoCaptureHUDButtons } from './PhotoCaptureHUDButtons';
import { styles } from './PhotoCaptureHUD.styles';

export function PhotoCaptureHUD() {
  return (
    <div style={styles['container']}>
      <PhotoCaptureHUDPreview sights={labels} />
      <PhotoCaptureHUDButtons />
    </div>
  );
}
