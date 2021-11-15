import React, { useRef } from 'react';
import Components, { propTypes } from '@monkvision/react-native';
import useMobileBrowserConfig from '../hooks/useMobileBrowserConfig';

function CameraScrollView({ activeSight, pictures, sights }) {
  const scrollRef = useRef();
  const onRotateToPortrait = () => scrollRef.current.setNativeProps({
    style: {
      height: '100%',
    },
  });
  useMobileBrowserConfig(onRotateToPortrait);

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
