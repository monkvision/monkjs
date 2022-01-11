import { Platform } from 'react-native';
import { G, Image } from 'react-native-svg';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

function Wrapper({
  children,
  name,
}) {
  if (Platform.OS === 'ios') {
    return <G clipPath={name && `url(#clip${name})`}>{children}</G>;
  }

  return children;
}

Wrapper.propTypes = {
  name: PropTypes.string.isRequired,
};

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

  const clipPath = useMemo(
    () => (Platform.OS !== 'ios' ? clip && `url(#clip${name})` : undefined),
    [clip, name],
  );

  return (
    <Wrapper name={name}>
      <Image
        key={name}
        x="0"
        y="0"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        opacity={opacity}
        href={href}
        clipPath={clipPath}
      />
    </Wrapper>
  );
}

DamageImage.propTypes = {
  clip: PropTypes.bool,
  name: PropTypes.string,
  opacity: PropTypes.string,
  source: PropTypes.shape({ uri: PropTypes.string }),
};

DamageImage.defaultProps = {
  clip: false,
  name: '',
  opacity: '1',
  source: { uri: '' },
};
