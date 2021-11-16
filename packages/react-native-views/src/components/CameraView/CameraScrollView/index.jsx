import React, { useRef } from 'react';
import Components, { propTypes } from '@monkvision/react-native';

function CameraScrollView({ activeSight, pictures, sights }) {
  const scrollRef = useRef();

  return (
    <Components.PicturesScrollPreview
      activeSight={activeSight}
      pictures={pictures}
      ref={scrollRef}
      sights={sights}
    />
  );
}

export default CameraScrollView;

CameraScrollView.propTypes = {
  activeSight: propTypes.sight.isRequired,
  pictures: propTypes.cameraPictures.isRequired,
  sights: propTypes.sights.isRequired,
};
