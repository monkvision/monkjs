import { CheckboxProps, useCheckboxStyles } from './hooks';
import { Icon } from '../../icons';

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
}: CheckboxProps) {
  const { checkboxStyles, icon } = useCheckboxStyles({
    checked,
    disabled,
    primaryColor,
    secondaryColor,
    tertiaryColor,
  });

  return (
    <button
      style={checkboxStyles}
      disabled={disabled}
      type='button'
      onClick={() => onChange?.(!checked)}
      data-testid='checkbox-btn'
    >
      {checked && <Icon icon='check' size={18} primaryColor={icon.primaryColor} />}
    </button>
  );
}
