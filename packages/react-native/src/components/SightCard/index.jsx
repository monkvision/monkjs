import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import isPlainObject from 'lodash.isplainobject';
import noop from 'lodash.noop';

import { Avatar, Surface, useTheme } from 'react-native-paper';
import { Image } from 'react-native';

import propTypes from '../propTypes';
import styles from './styles';

const SightCard = ({
  activeSight,
  id,
  pictures,
  scrollToCurrentElement,
  showPicture,
  sightMasks,
}) => {
  const { colors } = useTheme();

  const picture = pictures[id];

  const isImage = isPlainObject(picture) && showPicture === true;
  const isActive = id === activeSight.id;

  const source = isImage ? picture.source : sightMasks[id];

  useEffect(() => {
    if (isActive) {
      scrollToCurrentElement();
    }
  }, [isActive, scrollToCurrentElement]);

  if (isImage) {
    return <Image key={`sightCard-picture-${id}`} source={source} style={styles.picture} />;
  }

  return (
    <Surface
      key={`sightCard-mask-${id}`}
      style={[
        styles.surface, {
          backgroundColor: colors.primary,
          borderColor: isActive ? colors.accent : colors.primary,
        },
      ]}
    >
      {isPlainObject(picture) ? (
        <Avatar.Icon
          size={24}
          icon="check"
          style={[styles.badge, { backgroundColor: colors.success }]}
        />
      ) : null}
      <Image source={source} style={styles.sightMask} />
    </Surface>
  );
};

SightCard.propTypes = {
  activeSight: propTypes.sight,
  id: PropTypes.string,
  pictures: propTypes.cameraPictures.isRequired,
  scrollToCurrentElement: PropTypes.func,
  showPicture: PropTypes.bool,
  // object of source uri ?
  sightMasks: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
};

SightCard.defaultProps = {
  activeSight: null,
  id: '',
  sightMasks: {},
  scrollToCurrentElement: noop,
  showPicture: false,
};

export default SightCard;
