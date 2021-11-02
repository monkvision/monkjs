import React from 'react';
import { propTypes } from '@monkvision/react-native';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';

import { styles } from './styles';
import items from './data';
import useInterval from './hooks';

/**
 * @param onDismiss {func}
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */

export default function AdvicesView({ onDismiss, ...props }) {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // here we convert the scroll coordinate (x) to an integer (index) based on the width
  const getIndex = (event) => {
    setCurrentIndex(Math.round(parseFloat(event.nativeEvent.contentOffset.x / 512)));
  };

  // scrollView ref gives us the ability to scroll programmatically
  const scrollViewRef = React.useRef(null);

  // trigger a swipe (to the right every 3 sec)
  const delay = currentIndex < 2 ? 3000 : null;
  useInterval(() => {
    scrollViewRef.current.scrollTo({ x: 512 * (currentIndex + 1), animated: true });
  }, delay);

  return (
    <View style={styles.root} {...props}>
      {/* close button */}
      <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
        <MaterialCommunityIcons name="close" size={24} color="white" />
      </TouchableOpacity>

      {/* carousel */}
      <ScrollView
        pagingEnabled
        horizontal
        style={styles.carousel}
        showsHorizontalScrollIndicator={false}
        onScroll={getIndex}
        ref={scrollViewRef}
        scrollEventThrottle={16}
      >
        {items.map((item) => (
          <Item item={item} key={items.key} currentIndex={currentIndex} />
        ))}
      </ScrollView>

      {/* carousel dots */}
      <View style={styles.carouselDotsLayout}>
        {[0, 1, 2].map((item, index) => (
          <View
            style={[
              styles.carouselDot,
              {
                backgroundColor: index === currentIndex ? colors['--ifm-color-primary'] : '#C6D3F3',
              },
            ]}
            key={item}
          />
        ))}
      </View>
    </View>
  );
}

const Item = ({ item }) => (
  <View style={styles.carouselContent}>
    <View style={{ borderRadius: 18, overflow: 'hidden' }}>
      <Image source={item.src} style={styles.adviceImage} />
    </View>
    {item?.icon ? (
      <View style={styles.iconLayout}>
        <MaterialCommunityIcons name={item.icon} size={24} color="black" />
      </View>
    ) : null}
    {item.text}
  </View>
);

Item.propTypes = {
  item: PropTypes.objectOf({
    icon: PropTypes.string,
    text: PropTypes.JSX,
    src: PropTypes.Image,
  }).isRequired,
};

AdvicesView.propTypes = {
  onDismiss: propTypes.callback,
};

AdvicesView.defaultProps = {
  onDismiss: noop,
};
