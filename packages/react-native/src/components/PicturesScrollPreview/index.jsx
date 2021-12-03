import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import SightCard from '../SightCard';

import propTypes from '../propTypes';
import * as sightMasks from '../../assets/sightMasks';

import styles from './styles';

// ROW_HEIGHT is the height of the surface element inside sightCard
const ROW_HEIGHT = 100;
const ROW_MARGIN = 16;
const ROW = ROW_HEIGHT + ROW_MARGIN;

const PicturesScrollPreview = forwardRef(
  ({ activeSight, pictures, showPicture, sights }, ref) => {
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
          {sights.map(({ id, label }, index) => (
            <SightCard
              id={id}
              label={label}
              key={`sightCard-${id}`}
              scrollToCurrentElement={() => scrollToCurrentElement(index)}
              pictures={pictures}
              showPicture={showPicture}
              activeSight={activeSight}
              sightMasks={sightMasks}
            />
          ))}
        </ScrollView>
        <LinearGradient
          style={styles.gradient}
          colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0.01)']}
          pointerEvents="none"
        />
      </SafeAreaView>
    );
  },
);

PicturesScrollPreview.propTypes = {
  activeSight: propTypes.sight,
  pictures: propTypes.cameraPictures.isRequired,
  showPicture: PropTypes.bool,
  sights: propTypes.sights.isRequired,
};

PicturesScrollPreview.defaultProps = {
  activeSight: null,
  showPicture: false,
};

export default PicturesScrollPreview;
