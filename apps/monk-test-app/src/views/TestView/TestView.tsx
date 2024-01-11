import React from 'react';
import './TestView.css';
import { PhotoCapture } from '@monkvision/inspection-capture-web';
import { sights } from '@monkvision/sights';

const sightsArray = Object.values(sights)
  .filter((value) => value.category === 'exterior')
  .slice(0, 5);
export function TestView() {
  return (
    <div className='test-view-container'>
      <PhotoCapture sights={sightsArray} />
    </div>
  );
}
