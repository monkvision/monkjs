import { Button } from '@monkvision/common-ui-web';
import { styles } from './DoneButton.styles';

export interface DoneButtonProps {
  children: string;
  onConfirm: () => void;
}

export function DoneButton({ children, onConfirm }: DoneButtonProps) {
  return (
    <div style={styles['container']}>
      <Button
        style={styles['doneBtn']}
        variant='outline'
        primaryColor='text-white'
        onClick={onConfirm}
      >
        {children}
      </Button>
    </div>
  );
}
