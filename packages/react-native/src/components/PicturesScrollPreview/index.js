import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { SafeAreaView, ScrollView, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'react-native-paper';
import SightsWheel from '../SightsWheel';
import SightCard from '../SightCard';

import propTypes from '../propTypes';
import * as sightMasks from '../../assets/sightMasks';

import styles from './styles';

// ROW_HEIGHT is the height of the surface element inside sightCard
const ROW_HEIGHT = 100;
const ROW_MARGIN = 16;
const ROW = ROW_HEIGHT + ROW_MARGIN;

const FULL_SIGHT_INDICATOR_WIDTH = 62;

const PicturesScrollPreview = forwardRef(({ activeSight, pictures, showPicture, sights }, ref) => {
  const { colors } = useTheme();

  const scrollViewRef = React.useRef(null);
  const scrollToCurrentElement = (index) => {
    scrollViewRef.current.scrollTo({ y: 4 + index * ROW });
  };
  const currentSightCount = Object.keys(pictures).length + 1;
  return (
    <SafeAreaView style={styles.root} ref={ref}>
      <LinearGradient
        style={styles.gradient}
        colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0.01)']}
        pointerEvents="none"
      />
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

      <View style={{ backgroundColor: '#000000' }}>
        <SightsWheel activeSight={activeSight} />
        <View style={styles.sightsIndicator}>
          <View style={[styles.sightsIndicatorCounter, { overflow: 'hidden' }]}>
            <View style={{ backgroundColor: currentSightCount > sights.length ? colors.success : colors.primary, width: (currentSightCount * FULL_SIGHT_INDICATOR_WIDTH) / sights.length, height: '100%' }} />
          </View>
          <Text style={styles.sightsIndicatorText}>
            {currentSightCount > sights.length ? 'DONE' : `${currentSightCount} / ${sights.length}`}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
});

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
