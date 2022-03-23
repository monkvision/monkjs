import { Platform } from 'react-native';
import { Image } from 'react-native-svg';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

export default function DamageImage({
  clip,
  name,
  source,
  opacity,
}) {
  const href = useMemo(
    () => (Platform.OS === 'web' ? source.uri : source),
    [source],
  );

  const imageSize = Platform.select({
    native: {
      width: '100%',
      height: '100%',
    },
  });

  return (
    <Image
      {...imageSize}
      key={name}
      x="0"
      y="0"
      preserveAspectRatio="xMidYMid slice"
      opacity={opacity}
      href={href}
      clipPath={clip ? `url(#clip${name})` : ''}
    />
  );
}

DamageImage.propTypes = {
  clip: PropTypes.bool,
  name: PropTypes.string,
  opacity: PropTypes.number || PropTypes.string,
  source: PropTypes.shape({ uri: PropTypes.string }),
};

DamageImage.defaultProps = {
  clip: false,
  name: '',
  opacity: 1,
  source: { uri: '' },
};
