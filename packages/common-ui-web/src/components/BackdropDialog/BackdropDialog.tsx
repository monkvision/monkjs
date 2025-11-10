import { BackdropDialogProps, useBackdropDialogStyles } from './hooks';
import { styles } from './BackdropDialog.styles';
import { Button } from '../Button';
import { Icon } from '../../icons';

/**
 * This component can be used to display a fixed dialog on the screen, with a backdrop behind it. You can either pass a
 * custom component for the dialog modal, or use the default one and simply pass the text content of the dialog.
 */
export function BackdropDialog({
  show = false,
  backdropOpacity = 0.7,
  showCancelButton = true,
  dialogIcon,
  dialogIconPrimaryColor,
  message = '',
  confirmLabel = '',
  cancelLabel = '',
  confirmIcon,
  cancelIcon,
  onConfirm,
  onCancel,
  dialog,
}: BackdropDialogProps) {
  const style = useBackdropDialogStyles({
    backdropOpacity,
    showCancelButton,
    dialogIcon,
  });
  return show ? (
    <div style={style.backdrop} data-testid='backdrop'>
      {dialog ?? (
        <div style={style.dialog}>
          {dialogIcon && (
            <Icon
              icon={dialogIcon}
              size={80}
              primaryColor={dialogIconPrimaryColor}
              style={styles['dialogIcon']}
            />
          )}
          <div style={styles['message']}>{message}</div>
          <div style={styles['buttonsContainer']}>
            <Button
              variant='outline'
              primaryColor='alert-light'
              secondaryColor='background-dark'
              icon={cancelIcon}
              style={style.cancelButton}
              onClick={onCancel}
            >
              {cancelLabel}
            </Button>
            <Button
              variant='outline'
              primaryColor='primary-xlight'
              secondaryColor='background-dark'
              icon={confirmIcon}
              style={style.confirmButton}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      )}
    </div>
  ) : null;
}
