import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import isPlainObject from 'lodash.isplainobject';
import noop from 'lodash.noop';

import { Image, View, Text } from 'react-native';
import { Badge } from 'react-native-paper';

import propTypes from '../propTypes';
import styles from './styles';

const SightCard = ({
  activeSight,
  error,
  id,
  label,
  pictures,
  scrollToCurrentElement,
  showPicture,
  sightMasks,
}) => {
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
    <>
      <View
        key={`sightCard-mask-${id}`}
        style={[
          styles.sightCard, {
            borderColor: isActive ? '#fafafa' : '#d3d3d3',
            borderWidth: isActive ? 2 : 1,
          },
        ]}
      >
        {error && <Badge style={styles.badge}>!</Badge>}
        <Image source={source} style={[styles.sightMask, { position: 'relative' }]} />
        <Text style={styles.text}>{label}</Text>
      </View>
    </>
  );
};

SightCard.propTypes = {
  activeSight: propTypes.sight,
  error: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string,
  pictures: propTypes.cameraPictures.isRequired,
  scrollToCurrentElement: PropTypes.func,
  showPicture: PropTypes.bool,
  sightMasks: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
};

SightCard.defaultProps = {
  activeSight: null,
  error: false,
  id: '',
  label: '',
  sightMasks: {},
  scrollToCurrentElement: noop,
  showPicture: false,
};

export default SightCard;
