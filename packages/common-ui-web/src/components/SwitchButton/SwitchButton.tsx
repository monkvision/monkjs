import { useInteractiveStatus } from '@monkvision/common';
import { SwitchButtonProps, useSwitchButtonStyles } from './hooks';
import { Icon } from '../../icons';

/**
 * Switch button component that can be used to turn ON or OFF a feature.
 *
 * @see https://uxplanet.org/checkbox-vs-toggle-switch-7fc6e83f10b8
 * @example
 * export function MyComponent() {
 *   const [checked, setChecked] = useState(false);
 *   return (
 *     <div>
 *       <SwitchButton checked={checked} onSwitch={(value) => setChecked(value)} />
 *     </div>
 *   );
 * }
 */
export function SwitchButton({
  size = 'normal',
  checked = false,
  onSwitch,
  disabled = false,
  checkedPrimaryColor = 'primary',
  checkedSecondaryColor = 'text-white',
  uncheckedPrimaryColor = 'text-tertiary',
  uncheckedSecondaryColor = 'text-white',
  checkedLabel,
  uncheckedLabel,
}: SwitchButtonProps) {
  const { status, eventHandlers } = useInteractiveStatus({ disabled });
  const switchButtonStyles = useSwitchButtonStyles({
    size,
    checked,
    checkedPrimaryColor,
    checkedSecondaryColor,
    uncheckedPrimaryColor,
    uncheckedSecondaryColor,
    status,
  });

  const handleSwitch = () => {
    if (onSwitch) {
      onSwitch(!checked);
    }
  };

  return (
    <button
      style={switchButtonStyles.buttonStyle}
      onClick={handleSwitch}
      disabled={disabled}
      {...eventHandlers}
      data-testid='switch-btn'
    >
      {size === 'normal' && !checkedLabel && (
        <Icon
          icon='check'
          primaryColor={switchButtonStyles.icon.color}
          size={switchButtonStyles.icon.size}
          style={switchButtonStyles.icon.style}
        />
      )}
      {size === 'normal' && checkedLabel && (
        <div style={switchButtonStyles.checkedLabelStyle}>{checkedLabel ?? ''}</div>
      )}
      {size === 'normal' && (
        <div style={switchButtonStyles.uncheckedLabelStyle}>{uncheckedLabel ?? ''}</div>
      )}
      <div style={switchButtonStyles.knobStyle} data-testid='switch-knob'>
        {size === 'small' && checked && (
          <Icon
            icon='check'
            primaryColor={switchButtonStyles.iconSmall.color}
            size={switchButtonStyles.iconSmall.size}
            style={switchButtonStyles.iconSmall.style}
          />
        )}
      </div>
      <div style={switchButtonStyles.knobOverlayStyle}></div>
    </button>
  );
}
