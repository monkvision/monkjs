import { Button } from '@monkvision/common-ui-web';
import { usePhotoCaptureHUDPreview } from '../PhotoCaptureHUDPreviewSight/hook';

export interface PhotoCaptureHUDAddDamageMenuProps {
  onAddDamage?: (state: boolean) => void;
}

export function PhotoCaptureHUDPreviewAddDamage({
  onAddDamage = () => {},
}: PhotoCaptureHUDAddDamageMenuProps) {
  const style = usePhotoCaptureHUDPreview();
  return (
    <div style={style.containerStyle}>
      <Button icon='arrow-back' onClick={() => onAddDamage(false)} />;
    </div>
  );
}
