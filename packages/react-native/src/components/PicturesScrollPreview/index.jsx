import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import isEmpty from 'lodash.isempty';

import { SafeAreaView, ScrollView, View } from 'react-native';
import { Chip, useTheme } from 'react-native-paper';

import SightsWheel from '../SightsWheel';
import SightCard from '../SightCard';

import propTypes from '../propTypes';
import * as sightMasks from '../../assets/sightMasks';

import styles from './styles';

// ROW_HEIGHT is the height of the surface element inside sightCard
const ROW_HEIGHT = 100;
const ROW_MARGIN = 8;
const ROW = ROW_HEIGHT + ROW_MARGIN;

const PicturesScrollPreview = forwardRef(
  ({ activeSight, pictures, showPicture, sights, sightWheelProps }, ref) => {
    const { colors } = useTheme();

    const scrollViewRef = React.useRef(null);
    const scrollToCurrentElement = (index) => {
      scrollViewRef.current.scrollTo({ y: 4 + index * ROW });
    };
    return (
      <SafeAreaView style={styles.root} ref={ref}>
        <ScrollView
          style={styles.scrollContainer}
          ref={scrollViewRef}
          showsHorizontalScrollIndicator={false}
        >
          {sights.map(({ id }, index) => (
            <SightCard
              id={id}
              key={`sightCard-${id}`}
              scrollToCurrentElement={() => scrollToCurrentElement(index)}
              pictures={pictures}
              showPicture={showPicture}
              activeSight={activeSight}
              sightMasks={sightMasks}
            />
          ))}
        </ScrollView>
        {activeSight !== null && !isEmpty(activeSight.label) && (
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
  },
);

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
