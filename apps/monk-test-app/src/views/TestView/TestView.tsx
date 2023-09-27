import { MonkPicture } from '@monkvision/camera-web';
import React from 'react';
import { CaptureHUDButtons } from '@monkvision/inspection-capture-web';
import './TestView.css';

const galleryPreview = {
  uri: 'https://picsum.photos/200',
} as unknown as MonkPicture;

export function TestView() {
  return (
    <div className='test-view-container'>
      <CaptureHUDButtons
        galleryPreview={galleryPreview}
        onTakePicture={() => console.log('onTakePicture')}
        onOpenGallery={() => console.log('onOpenGallery')}
        onClose={() => console.log('onClose')}
        galleryDisabled={false}
        takePictureDisabled={false}
        closeDisabled={false}
      />
    </div>
  );
}
