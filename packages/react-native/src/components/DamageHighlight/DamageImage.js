import React from 'react';
import { Platform } from 'react-native';
import { G, Image } from 'react-native-svg';
import PropTypes from 'prop-types';

export default function DamageImage({ clip, name, source, opacity }) {
  return (
    Platform.OS === 'ios'
      ? (
        <G clipPath={name && `url(#clip${name})`}>
          <Image
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            key={name}
            href={source}
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
          href={Platform.OS === 'web' ? source.uri : source}
          opacity={`${opacity}`}
          clipPath={clip && `url(#clip${name})`}
        />
      )
  );
}

DamageImage.propTypes = {
  clip: PropTypes.bool,
  name: PropTypes.string,
  opacity: PropTypes.number,
  source: {
    uri: PropTypes.string,
  },
};

DamageImage.defaultProps = {
  clip: false,
  name: '',
  opacity: 1,
  source: { uri: '' },
};
