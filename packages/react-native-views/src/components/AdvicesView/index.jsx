import React from 'react';
import { propTypes } from '@monkvision/react-native';
import noop from 'lodash.noop';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Image, TouchableOpacity } from 'react-native';
import { SwiperFlatList, Pagination } from 'react-native-swiper-flatlist';
import { useTheme } from 'react-native-paper';

import { styles } from './styles';
import items from './data';

/**
 * @param onDismiss {func}
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */

export default function AdvicesView({ onDismiss, ...props }) {
  return (
    <View style={styles.root} {...props}>
      {/* close button */}
      <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
        <MaterialCommunityIcons name="close" size={24} color="white" />
      </TouchableOpacity>

      {/* carousel */}
      <Carousel />
    </View>
  );
}

const Carousel = () => {
  const { colors } = useTheme();

  return (
    <SwiperFlatList
      style={styles.carousel}
      autoplay
      index={0}
      showPagination
      PaginationComponent={(props) => (
        <Pagination
          {...props}
          paginationStyle={styles.carouselDotsLayout}
          paginationStyleItem={styles.carouselDot}
          paginationDefaultColor="#C6D3F3"
          paginationActiveColor={colors['--ifm-color-primary']}
        />
      )}
      data={items}
      renderItem={({ item }) => (
        <View style={styles.carouselContent}>
          <View style={{ borderRadius: 18, overflow: 'hidden' }}>
            <Image source={item.src} style={styles.adviceImage} />
          </View>
          {item?.icon ? (
            <View style={styles.iconLayout}>
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color="black"
              />
            </View>
          ) : null}
          {item.text}
        </View>
      )}
    />
  );
};

AdvicesView.propTypes = {
  onDismiss: propTypes.callback,
};

AdvicesView.defaultProps = {
  onDismiss: noop,
};
