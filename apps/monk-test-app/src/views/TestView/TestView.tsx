import React from 'react';
import './TestView.css';
import { CaptureHUDButtons } from '@monkvision/inspection-capture-web';

export function TestView() {
  return (
    <div className='test-view-container'>
      <CaptureHUDButtons />
    </div>
  );
}
