import React, { useCallback } from 'react';
import { ScrollView, Platform, View, useWindowDimensions, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { AntDesign } from '@expo/vector-icons';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
  },
  arrow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    backgroundColor: 'white',
    opacity: 0.6,
    position: 'absolute',
    zIndex: 999,
  },
  leftArrow: { left: 0, borderBottomRightRadius: 4, borderTopRightRadius: 4 },
  rightArrow: { right: 0, borderBottomLeftRadius: 4, borderTopStartRadius: 4 },
});

export default function Carousel({ renderItem: RenderItem, data, hideArrows, contentWidth }) {
  const { width, height } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // scrollView ref gives us the ability to scroll programmatically
  const scrollViewRef = React.useRef(null);

  // here we convert the scroll coordinate (x) to an integer (index) based on the width
  const getIndex = useCallback((event) => {
    setCurrentIndex(Math.round(parseFloat(event.nativeEvent.contentOffset.x / contentWidth)));
  }, [contentWidth]);

  const isFirstIndex = currentIndex === 0;
  const isLastIndex = currentIndex === data.length - 1;

  // scroll to left
  const handlePrevious = useCallback(() => scrollViewRef.current.scrollTo({
    x: contentWidth * (currentIndex - 1), animated: true }), [currentIndex, contentWidth]);

  // scroll to right
  const handleNext = useCallback(() => scrollViewRef.current.scrollTo({
    x: contentWidth * (currentIndex + 1), animated: true }), [currentIndex, contentWidth]);

  // track the scroll position on drag(onscroll)
  React.useEffect(() => {
    scrollViewRef.current.scrollTo({ x: contentWidth * currentIndex, animated: true });
  }, [currentIndex, contentWidth]);

  if (!data?.length) { return null; }
  return (
    <View style={styles.root}>
      {/* arrows */}
      {!hideArrows ? (
        <>
          <TouchableOpacity
            disabled={isFirstIndex}
            onPress={handlePrevious}
            style={[styles.arrow, styles.leftArrow]}
          >
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isLastIndex}
            onPress={handleNext}
            style={[styles.arrow, styles.rightArrow]}
          >
            <AntDesign name="arrowright" size={24} color="black" />
          </TouchableOpacity>
        </>
      ) : null}
      <ScrollView
        pagingEnabled
        onScroll={getIndex}
        ref={scrollViewRef}
        horizontal
        style={Platform.select({
          native: { width: Math.min(width, height), maxHeight: Math.min(width, height) },
          web: { width: 512, overflowX: 'scroll', maxHeight: 512 },
        })}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {data.map((item, index) => (
          <View style={[styles.content, { width: contentWidth }]} key={item.path}>
            <RenderItem item={item} index={index} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

Carousel.propTypes = {
  contentWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  data: PropTypes.arrayOf(PropTypes.any),
  hideArrows: PropTypes.bool,
  renderItem: PropTypes.func.isRequired,
};
Carousel.defaultProps = {
  data: [],
  hideArrows: false,
  contentWidth: {},
};
