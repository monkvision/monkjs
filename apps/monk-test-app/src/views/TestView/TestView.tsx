import { Camera, CameraResolution, MonkPicture, SimpleCameraHUD } from '@monkvision/camera-web';
import './TestView.css';
import { useState } from 'react';

export function TestView() {
  const [resolution, setResolution] = useState(CameraResolution.UHD_4K);

  const handlePictureTaken = (picture: MonkPicture) => {
    const link = document.createElement('a');
    link.href = picture.uri;
    const now = new Date();
    link.download = `pic-${resolution}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='test-view-container'>
      <Camera
        HUDComponent={SimpleCameraHUD}
        resolution={resolution}
        onPictureTaken={handlePictureTaken}
      />
      <div className='select-container'>
        <select
          value={resolution}
          onChange={(e) => setResolution(e.target.value as CameraResolution)}
        >
          {Object.values(CameraResolution).map((res) => (
            <option key={res} value={res}>
              {res}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
