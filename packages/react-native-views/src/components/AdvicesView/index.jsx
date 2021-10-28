import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import SideSwipe from 'react-native-sideswipe';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import noop from 'lodash.noop';
import { useInterval } from './hooks';
import { styles } from './styles';
import items from './data';
/**
 * @param onDismiss {func}
 * @returns {JSX.Element}
 * @constructor
 */
export default function AdvicesView({ onDismiss, ...props }) {
  const [currentAdviceIndex, setCurrentAdviceIndex] = React.useState(0);
  const [autoSwipe, toggleAutoSwipe] = React.useState(true);
  const { colors } = useTheme();

  const handleCurrentDotColor = (index) => ({
    backgroundColor: index === currentAdviceIndex ? colors['--ifm-color-primary'] : '#C6D3F3',
  });

  const delay = autoSwipe ? 3000 : null;
  useInterval(() => setCurrentAdviceIndex((prev) => prev + 1), delay);

  return (
    <View style={styles.root} {...props}>
      {/* close button */}
      <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
        <MaterialCommunityIcons name="close" size={24} color="white" />
      </TouchableOpacity>

      {/* carousel */}
      <Carousel
        currentAdviceIndex={currentAdviceIndex}
        toggleAutoSwipe={toggleAutoSwipe}
        setCurrentAdviceIndex={setCurrentAdviceIndex}
      />
      {/* carousel dots */}
      <View style={styles.carouselDotsLayout}>
        {[0, 1, 2].map((item, index) => (
          <TouchableOpacity
            style={[styles.carouselDot, handleCurrentDotColor(index)]}
            key={item}
            onPress={() => {
              // swipe to the current index screen
              setCurrentAdviceIndex(index);
              // disable the auto swipe (to avoid having conflict with auto swipe)
              toggleAutoSwipe(false);
            }}
          />
        ))}
      </View>
    </View>
  );
}

const Carousel = ({ currentAdviceIndex, toggleAutoSwipe, setCurrentAdviceIndex }) => (
  <SideSwipe
    index={currentAdviceIndex}
    itemWidth={512}
    onEndReached={() => toggleAutoSwipe(false)}
    style={styles.carousel}
    data={items}
    onIndexChange={(index) => setCurrentAdviceIndex(index)}
    renderItem={({ item }) => (
      <View style={styles.carouselContent}>
        <View style={{ borderRadius: 18, overflow: 'hidden' }}>
          <Image source={item.src} style={styles.adviceImage} />
        </View>
        {/* please keep this view (iconLayout) outside of
        the condition so it holds the icon place */}
        {item?.icon ? (
          <View style={styles.iconLayout}>
            <MaterialCommunityIcons name={item.icon} size={24} color="black" />
          </View>
        ) : null}
        {item.text}
      </View>
    )}
  />
);

Carousel.propTypes = {
  currentAdviceIndex: PropTypes.number,
  setCurrentAdviceIndex: PropTypes.func,
  toggleAutoSwipe: PropTypes.func,
};

Carousel.defaultProps = {
  currentAdviceIndex: 0,
  setCurrentAdviceIndex: noop,
  toggleAutoSwipe: noop,
};

AdvicesView.propTypes = {
  onDismiss: PropTypes.func,
};

AdvicesView.defaultProps = {
  onDismiss: noop,
};
