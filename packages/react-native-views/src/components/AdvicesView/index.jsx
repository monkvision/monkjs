import React, { useCallback } from 'react';
import { propTypes } from '@monkvision/react-native';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Provider, withTheme, Button } from 'react-native-paper';
import { SvgXml } from 'react-native-svg';
import { styles } from './styles';
import items from './data';
// import useInterval from './hooks';

/**
 * @param hideCloseButton {boolean}
 * @param onDismiss {func}
 * @param theme
 * @param onStart {func}
 * @param canStart {bool}
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */

function AdvicesView({ hideCloseButton, onDismiss, theme, onStart, ...props }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // here we convert the scroll coordinate (x) to an integer (index) based on the width
  const getIndex = (event) => {
    setCurrentIndex(Math.round(parseFloat(event.nativeEvent.contentOffset.x / 512)));
  };

  // scrollView ref gives us the ability to scroll programmatically
  const scrollViewRef = React.useRef(null);

  const handleGoToNextSlide = useCallback(
    () => scrollViewRef.current.scrollTo({ x: 512 * (currentIndex + 1), animated: true }),
    [currentIndex],
  );
  // trigger a swipe (to the right every 3 sec)
  // const delay = currentIndex < 2 ? 3000 : null;
  // useInterval(() => {
  //   handleGoToNextSlide();
  // }, delay);

  const handlePress = useCallback(() => {
    if (currentIndex < 2) {
      handleGoToNextSlide();
    } else if (onStart) {
      onStart();
    } else {
      onDismiss();
    }
  }, [currentIndex, handleGoToNextSlide, onStart, onDismiss]);

  return (
    <Provider theme={theme}>
      <View style={styles.root} {...props}>
        {/* close button */}
        {!hideCloseButton ? (
          <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
            <MaterialCommunityIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        ) : null}

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
            <Item {...item} key={item.key} currentIndex={currentIndex} />
          ))}
        </ScrollView>

        <Button
          color="#FFFFFF"
          mode="contained"
          onPress={handlePress}
          labelStyle={{ color: '#43494A' }}
          style={{ marginVertical: 8 }}
        >
          {currentIndex === 2 && onStart ? 'Start' : 'Got it'}
        </Button>

        {/* carousel dots */}
        <View style={styles.carouselDotsLayout}>
          {[0, 1, 2].map((item, index) => (
            <View
              style={[
                styles.carouselDot, {
                  backgroundColor: index === currentIndex ? '#FFFFFF' : '#ffffff40',
                },
              ]}
              key={item}
            />
          ))}
        </View>
      </View>
    </Provider>
  );
}

const Item = ({ src, icon, text }) => (
  <View style={styles.carouselContent}>
    <View style={{ borderRadius: 18, overflow: 'hidden' }}>
      {Platform.OS === 'web'
        // eslint-disable-next-line react/no-danger
        ? <div dangerouslySetInnerHTML={{ __html: src }} />
        : <SvgXml xml={src} style={styles.adviceImage} />}
    </View>
    {icon ? (
      <View style={styles.iconLayout}>
        <MaterialCommunityIcons name={icon} size={24} color="white" />
      </View>
    ) : null}
    {text}
  </View>
);

Item.propTypes = {
  icon: PropTypes.string,
  src: PropTypes.string.isRequired,
  text: PropTypes.element.isRequired,
};

Item.defaultProps = {
  icon: '',
};

AdvicesView.propTypes = {
  hideCloseButton: PropTypes.bool,
  onDismiss: propTypes.callback,
  onStart: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
};

AdvicesView.defaultProps = {
  hideCloseButton: false,
  onStart: false,
  onDismiss: noop,
};

export default withTheme(AdvicesView);
