import { useMonkTheme } from '@monkvision/common';
import { ReactElement } from 'react';
import { ColorProp } from '@monkvision/types';
import { styles } from './BackdropDialog.styles';
import { IconName } from '../../icons';

/**
 * Props accepted by the BackdropDialog component.
 */
export interface BackdropDialogProps {
  /**
   * Boolean indicating if the dialog is displayed on the screen or not.
   *
   * @default false
   */
  show?: boolean;
  /**
   * Opcaity value of the backdrop behind the dialog between 0 and 1.
   *
   * @default 0.7
   */
  backdropOpacity?: number;
  /**
   * Boolean indicating if the cancel button should be displayed or not.
   *
   * @default true
   */
  showCancelButton?: boolean;
  /**
   * The big icon displayed in the dialog message.
   */
  dialogIcon?: IconName;
  /**
   * The color of the big icon displayed in the dialog message.
   */
  dialogIconPrimaryColor?: ColorProp;
  /**
   * The message of the backdrop dialog.
   */
  message?: string;
  /**
   * The label of the confirm button.
   */
  confirmLabel?: string;
  /**
   * The label of the cancel button.
   */
  cancelLabel?: string;
  /**
   * The icon of the confirm button.
   */
  confirmIcon?: IconName;
  /**
   * The icon of the cancel button.
   */
  cancelIcon?: IconName;
  /**
   * Callback called when the user clicks on the confirm button.
   */
  onConfirm?: () => void;
  /**
   * Callback called when the user clicks on the cancel button.
   */
  onCancel?: () => void;
  /**
   * Custom dialog element to display. If this prop is used, it overrides every other UI prop of this component.
   */
  dialog?: ReactElement;
}

export function useBackdropDialogStyles(
  props: Required<Pick<BackdropDialogProps, 'backdropOpacity' | 'showCancelButton'>> &
    Pick<BackdropDialogProps, 'dialogIcon'>,
) {
  const { palette } = useMonkTheme();

  return {
    backdrop: {
      ...styles['backdrop'],
      backgroundColor: `rgba(0, 0, 0, ${props.backdropOpacity})`,
    },
    dialog: {
      ...styles['dialog'],
      ...(!props.dialogIcon ? styles['messageNoIcon'] : {}),
      backgroundColor: palette.background.dark,
    },
    cancelButton: {
      ...styles['button'],
      ...styles['cancelButton'],
      display: props.showCancelButton ? 'flex' : 'none',
    },
    confirmButton: {
      ...styles['button'],
      ...styles['confirmButton'],
      ...(!props.showCancelButton ? styles['cancelButton'] : {}),
    },
  };
}
