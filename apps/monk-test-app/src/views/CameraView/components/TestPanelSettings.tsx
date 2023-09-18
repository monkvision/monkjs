import { CameraFacingMode, CameraResolution, CompressionFormat } from '@monkvision/camera-web';
import React, { useCallback } from 'react';
import './styles.css';
import { TestPanelRow } from './TestPanelRow';

export interface TestPanelState {
  facingMode: CameraFacingMode;
  resolution: CameraResolution;
  compressionFormat: CompressionFormat;
  quality: string;
}

export interface TestPanelSettingsProps {
  state: TestPanelState;
  onChange: (state: TestPanelState) => void;
}

export function TestPanelSettings({ state, onChange }: TestPanelSettingsProps) {
  const handleChange = useCallback(
    (modifiedState: Partial<TestPanelState>) => onChange({ ...state, ...modifiedState }),
    [onChange, state],
  );

  return (
    <>
      <TestPanelRow
        type='select'
        label='Camera'
        availableValues={Object.values(CameraFacingMode)}
        defaultValue={state.facingMode}
        onChange={(value) => handleChange({ facingMode: value })}
      />
      <TestPanelRow
        type='select'
        label='Resolution'
        availableValues={Object.values(CameraResolution)}
        defaultValue={state.resolution}
        onChange={(value) => handleChange({ resolution: value })}
      />
      <TestPanelRow
        type='select'
        label='Compression Format'
        availableValues={Object.values(CompressionFormat)}
        defaultValue={state.compressionFormat}
        onChange={(value) => handleChange({ compressionFormat: value })}
      />
      <TestPanelRow
        type='select'
        label='Quality'
        availableValues={[
          '0',
          ...Array.from(new Array(5), (_, i) => (((i + 1) * 2) / 10).toString()),
        ]}
        defaultValue={state.quality}
        onChange={(value) => handleChange({ quality: value })}
      />
    </>
  );
}
