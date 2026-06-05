import { useMonkTheme } from '@monkvision/common';
import { Button } from '@monkvision/common-ui-web';
import { styles } from './DoneButton.styles';

export interface DoneButtonProps {
  children: string;
  onConfirm: () => void;
  disabled?: boolean;
}

export function DoneButton({ children, onConfirm, disabled = false }: DoneButtonProps) {
  const { palette } = useMonkTheme();

  return (
    <div style={styles['container']}>
      <Button
        disabled={disabled}
        style={{ ...styles['doneBtn'], backgroundColor: palette.text.black }}
        variant='outline'
        primaryColor='text-white'
        onClick={onConfirm}
      >
        {children}
      </Button>
    </div>
  );
}
