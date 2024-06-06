import { useRef, useState } from 'react';
import { TextFieldProps, useTextFieldStyles } from './hooks';
import { Icon } from '../../icons';
import { Button } from '../Button';

/**
 * Custom component implementing a simple one-liner text field.
 */
export function TextField({
  type = 'text',
  value,
  onChange,
  disabled = false,
  highlighted = false,
  monospace = false,
  label,
  placeholder,
  unit,
  unitPosition = 'left',
  icon,
  showClearButton = true,
  assistiveText,
  fixedWidth,
  focusColor = 'primary-base',
  neutralColor = 'text-primary',
  backgroundColor = 'background-light',
}: TextFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const isFilled = !!value && value.length > 0;
  const {
    mainContainerStyle,
    componentsContainerStyle,
    leftIcon,
    inputContainerStyle,
    unitStyle,
    labelStyle,
    inputStyle,
    clearButton,
    assistiveTextStyle,
  } = useTextFieldStyles({
    disabled,
    highlighted,
    monospace,
    unitPosition,
    showClearButton,
    focusColor,
    neutralColor,
    backgroundColor,
    fixedWidth,
    isFocused,
    isFilled,
  });
  return (
    <div style={mainContainerStyle}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div style={componentsContainerStyle} onClick={() => inputRef.current?.focus()}>
        {icon && (
          <Icon
            icon={icon}
            size={leftIcon.size}
            primaryColor={leftIcon.primaryColor}
            style={leftIcon.style}
          />
        )}
        <div style={inputContainerStyle}>
          <label style={labelStyle}>{label}</label>
          {(isFocused || isFilled) && unit && <div style={unitStyle}>{unit}</div>}
          <input
            ref={inputRef}
            type={type}
            style={inputStyle}
            placeholder={isFocused ? placeholder : ''}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            data-testid='input'
          />
        </div>
        {showClearButton && (
          <Button
            icon='close'
            variant='text'
            primaryColor={clearButton.primaryColor}
            style={clearButton.style}
            disabled={disabled}
            onClick={() => onChange?.('')}
          />
        )}
      </div>
      {assistiveText && <div style={assistiveTextStyle}>{assistiveText}</div>}
    </div>
  );
}
