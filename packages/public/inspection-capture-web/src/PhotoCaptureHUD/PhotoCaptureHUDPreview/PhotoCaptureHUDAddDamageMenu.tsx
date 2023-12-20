import { Button } from '@monkvision/common-ui-web';
import { usePhotoCaptureHUDPreview } from './hook';

export interface PhotoCaptureHUDAddDamageMenuProps {
  onAddDamage: (state: boolean) => void;
}

export function PhotoCaptureHUDAddDamageMenu({ onAddDamage }: PhotoCaptureHUDAddDamageMenuProps) {
  const style = usePhotoCaptureHUDPreview();
  return (
    <div style={style.containerStyle}>
      <Button icon='arrow-back' onClick={() => onAddDamage(false)} />;
    </div>
  );
}
