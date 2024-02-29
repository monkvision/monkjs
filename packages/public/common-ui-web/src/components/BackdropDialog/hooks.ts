import { useMonkTheme } from '@monkvision/common';
import { ReactElement } from 'react';
import { styles } from './BackdropDialog.styles';
import { IconName } from '../../icons';

export interface BackdropDialogProps {
  show?: boolean;
  backdropOpacity?: number;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmIcon?: IconName;
  cancelIcon?: IconName;
  onConfirm?: () => void;
  onCancel?: () => void;
  dialog?: ReactElement;
}

export function useBackdropDialogStyles(
  props: Required<
    Pick<
      BackdropDialogProps,
      'show' | 'backdropOpacity' | 'message' | 'confirmLabel' | 'cancelLabel'
    >
  >,
) {
  const { palette } = useMonkTheme();

  return {
    backdrop: {
      ...styles['backdrop'],
      backgroundColor: `rgba(0, 0, 0, ${props.backdropOpacity})`,
    },
    dialog: {
      ...styles['dialog'],
      backgroundColor: palette.surface.s1,
    },
    cancelButton: {
      ...styles['button'],
      ...styles['cancelButton'],
    },
    confirmButton: {
      ...styles['button'],
      ...styles['confirmButton'],
    },
  };
}
