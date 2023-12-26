import { Button } from '@monkvision/common-ui-web';
import { usePhotoCaptureHUDPreview } from '../PhotoCaptureHUDPreviewSight/hook';
import { HUDMode } from '../hook';

export interface PhotoCaptureHUDAddDamageMenuProps {
  onAddDamage?: (newMode: HUDMode) => void;
}

export function PhotoCaptureHUDPreviewAddDamage({
  onAddDamage = () => {},
}: PhotoCaptureHUDAddDamageMenuProps) {
  const style = usePhotoCaptureHUDPreview();
  return (
    <div style={style.containerStyle}>
      <Button icon='arrow-back' onClick={() => onAddDamage(HUDMode.DEFAULT)} />;
    </div>
  );
}
