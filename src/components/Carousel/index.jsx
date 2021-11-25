import React from 'react';
import { ScrollView, Platform, View, useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';

export default function Carousel({ renderItem: RenderItem, data }) {
  const { width, height } = useWindowDimensions();
  if (!data?.length) { return null; }
  return (
    <ScrollView
      pagingEnabled
      horizontal
      style={Platform.select({
        native: { width: Math.min(width, height), maxHeight: Math.min(width, height) },
        web: { width: 512, overflowX: 'scroll', maxHeight: 512 },
      })}
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
    >
      {data.map((item, index) => (
        <View style={{
          display: 'flex',
          alignItems: 'center',
          ...Platform.select({
            native: { width: 512 },
            web: { width: 512 },
          }) }}
        >
          <RenderItem item={item} index={index} />
        </View>
      ))}
    </ScrollView>
  );
}

Carousel.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
  renderItem: PropTypes.func.isRequired,
};
Carousel.defaultProps = {
  data: [],
};
