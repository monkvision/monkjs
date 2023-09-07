import React from 'react';
import { useTestPanelStyle } from '../hooks';
import { format, TestOptionType } from '../utils';
import './styles.css';

export interface TestPanelRowCommonProps {
  label: string;
}

export interface TestPanelRowValueProps extends TestPanelRowCommonProps {
  type: 'value';
  value: TestOptionType | null;
}

export interface TestPanelRowSelectProps<T extends TestOptionType> extends TestPanelRowCommonProps {
  type: 'select';
  availableValues: T[];
  defaultValue: T;
  onChange: (value: T) => void;
}

export type TestPanelRowProps<T extends TestOptionType> =
  | TestPanelRowValueProps
  | TestPanelRowSelectProps<T>;

export function TestPanelRow<T extends TestOptionType>(props: TestPanelRowProps<T>) {
  const { col, colNoValue } = useTestPanelStyle();
  return (
    <div className='row'>
      <div className='col end'>{props.label}</div>
      <div className='col start' style={props.type === 'value' && !props.value ? colNoValue : col}>
        {props.type === 'value' ? (
          format(props.value ?? 'No Value')
        ) : (
          <select value={props.defaultValue} onChange={(e) => props.onChange(e.target.value as T)}>
            {props.availableValues.map((value) => (
              <option key={value} value={value}>
                {format(value)}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
