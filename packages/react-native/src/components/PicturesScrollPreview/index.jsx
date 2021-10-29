import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import isEmpty from 'lodash.isempty';

import { SafeAreaView, ScrollView, View } from 'react-native';
import { Chip, useTheme } from 'react-native-paper';
import { Sight } from '@monkvision/corejs';

import SightsWheel from '../SightsWheel';
import * as propTypes from '../propTypes';
import * as sightMasks from '../../assets/sightMasks';

import styles from './styles';
import SightCard from './sightCard';

// ROW_HEIGHT is the height of the surface element inside sightCard
const ROW_HEIGHT = 100;

const PicturesScrollPreview = forwardRef(
  ({ activeSight, pictures, showPicture, sights, sightWheelProps }, ref) => {
    const { colors } = useTheme();

    const scrollViewRef = React.useRef(null);
    const scrollToCurrentElement = (index) => {
      scrollViewRef.current.scrollTo({ y: index * ROW_HEIGHT });
    };
    return (
      <SafeAreaView style={styles.root} ref={ref}>
        <ScrollView
          style={styles.scrollContainer}
          ref={scrollViewRef}
          showsHorizontalScrollIndicator={false}
        >
          {sights.map(([id], index) => (
            <SightCard
              scrollToCurrentElement={() => scrollToCurrentElement(index)}
              pictures={pictures}
              id={id}
              showPicture={showPicture}
              activeSight={activeSight}
              sightMasks={sightMasks}
            />
          ))}
        </ScrollView>
        {activeSight !== null && !isEmpty(activeSight.label) && (
          <View style={styles.topView}>
            <SightsWheel
              sights={sights.map((s) => new Sight(...s))}
              filledSightIds={Object.keys(pictures)}
              activeSight={activeSight}
              {...sightWheelProps}
            />
            <Chip
              style={[styles.chip, { backgroundColor: colors.accent }]}
              textStyle={styles.chipText}
            >
              {activeSight.label}
            </Chip>
          </View>
        )}
      </SafeAreaView>
    );
  },
);
  return (
    <SafeAreaView style={styles.root} ref={ref}>
      <ScrollView
        style={styles.scrollContainer}
        showsHorizontalScrollIndicator={false}
      >
        {sights.map(({ id }) => {
          const picture = pictures[id];
          const isImage = isPlainObject(picture) && showPicture === true;
          const isActive = id === activeSight.id;

          const source = isImage ? picture.source : sightMasks[id];

          if (isImage) {
            return (
              <Image
                key={`picture-${id}`}
                source={source}
                style={styles.picture}
              />
            );
          }

          return (
            <Surface
              key={id}
              style={[styles.surface, {
                backgroundColor: colors.primary,
                borderColor: isActive ? colors.accent : colors.primary,
              }]}
            >
              {isPlainObject(picture) && (
                <Avatar.Icon
                  size={24}
                  icon="check"
                  style={[styles.badge, { backgroundColor: colors.success }]}
                />
              )}
              <Image
                key={`sightMask-${id}`}
                source={source}
                style={styles.sightMask}
              />
            </Surface>
          );
        })}
      </ScrollView>
      {(activeSight !== null && !isEmpty(activeSight.label)) && (
        <View style={styles.topView}>
          <SightsWheel
            sights={sights}
            filledSightIds={Object.keys(pictures)}
            activeSight={activeSight}
            {...sightWheelProps}
          />
          <Chip
            style={[styles.chip, { backgroundColor: colors.accent }]}
            textStyle={styles.chipText}
          >
            {activeSight.label}
          </Chip>
        </View>
      )}
    </SafeAreaView>
  );
});

PicturesScrollPreview.propTypes = {
  activeSight: propTypes.sight,
  pictures: propTypes.cameraPictures.isRequired,
  showPicture: PropTypes.bool,
  sights: propTypes.sights.isRequired,
  sightWheelProps: PropTypes.objectOf(PropTypes.any),
};

PicturesScrollPreview.defaultProps = {
  activeSight: null,
  showPicture: false,
  sightWheelProps: {},
};

export default PicturesScrollPreview;
