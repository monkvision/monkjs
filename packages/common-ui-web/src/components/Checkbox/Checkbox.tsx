import { useInteractiveStatus } from '@monkvision/common';
import { CheckboxProps, useCheckboxStyles } from './hooks';
import { Icon } from '../../icons';
import { styles } from './Checkbox.styles';

/**
 * Custom component implementing a simple checkbox.
 */
export function Checkbox({
  checked = false,
  disabled = false,
  onChange,
  primaryColor = 'primary-base',
  secondaryColor = 'text-primary',
  tertiaryColor = 'background-light',
  labelColor = 'text-primary',
  label,
}: CheckboxProps) {
  const { status, eventHandlers } = useInteractiveStatus({ disabled });
  const { checkboxStyles, icon, interactiveOverlayStyle, labelStyle } = useCheckboxStyles({
    checked,
    status,
    primaryColor,
    secondaryColor,
    tertiaryColor,
    labelColor,
  });

  return (
    <div style={styles['container']}>
      <div style={interactiveOverlayStyle}>
        <button
          style={checkboxStyles}
          disabled={disabled}
          type='button'
          onClick={() => onChange?.(!checked)}
          {...eventHandlers}
          data-testid='checkbox-btn'
        >
          {checked && <Icon icon='check' size={18} primaryColor={icon.primaryColor} />}
        </button>
      </div>
      {label && <div style={labelStyle}>{label}</div>}
    </div>
  );
}
