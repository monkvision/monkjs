import React from 'react';
import isPlainObject from 'lodash.isplainobject';
import PropTypes from 'prop-types';
import { Avatar, Surface, useTheme } from 'react-native-paper';
import { Image } from 'react-native';
import noop from 'lodash.noop';
import styles from './styles';

// This components has been moved here to be keep it's layout clean and readeable
const SightCard = ({
  pictures,
  id,
  showPicture,
  activeSight,
  sightMasks,
  scrollToCurrentElement,
}) => {
  const { colors } = useTheme();
  const picture = pictures[id];
  const isImage = isPlainObject(picture) && showPicture === true;
  const isActive = id === activeSight.id;
  const source = isImage ? picture.source : sightMasks[id];

  React.useEffect(() => {
    if (isActive) {
      scrollToCurrentElement();
    }
  }, [isActive, scrollToCurrentElement]);

  if (isImage) {
    return <Image key={`picture-${id}`} source={source} style={styles.picture} />;
  }

  return (
    <Surface
      key={id}
      style={[
        styles.surface,
        {
          backgroundColor: colors.primary,
          borderColor: isActive ? colors.accent : colors.primary,
        },
      ]}
    >
      {isPlainObject(picture) && (
        <Avatar.Icon
          size={24}
          icon="check"
          style={[styles.badge, { backgroundColor: colors.success }]}
        />
      )}
      <Image key={`sightMask-${id}`} source={source} style={styles.sightMask} />
    </Surface>
  );
};

SightCard.propTypes = {
  activeSight: PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
  }),
  id: PropTypes.string,
  pictures: PropTypes.objectOf(PropTypes.object).isRequired,
  scrollToCurrentElement: PropTypes.func,
  showPicture: PropTypes.bool,
  sightMasks: PropTypes.string,
};

SightCard.defaultProps = {
  activeSight: null,
  id: null,
  sightMasks: PropTypes.string,
  scrollToCurrentElement: noop,
  showPicture: false,
};

export default SightCard;
