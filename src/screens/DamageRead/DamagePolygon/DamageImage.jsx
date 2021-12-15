import React from 'react';
import { Platform } from 'react-native';
import { G, Image } from 'react-native-svg';
import PropTypes from 'prop-types';

export default function DamageImage({ name, path, clipId, opacity }) {
  return (
    Platform.OS === 'ios' ? (
      <G clipPath={clipId && `url(#${clipId})`}>
        <Image
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          key={name}
          href={{ uri: path }}
          opacity={`${opacity}`}
        />
      </G>
    )
      : (
        <Image
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          key={name}
          href={Platform.OS === 'web' ? path : { uri: path }}
          opacity={`${opacity}`}
          clipPath={clipId && `url(#${clipId})`}
        />
      )
  );
}

DamageImage.propTypes = {
  clipId: PropTypes.string,
  name: PropTypes.string,
  opacity: PropTypes.number,
  path: PropTypes.string,
};

DamageImage.defaultProps = {
  clipId: null,
  name: '',
  opacity: 1,
  path: '',
};
