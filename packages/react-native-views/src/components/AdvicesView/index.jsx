import React from 'react';
import { View, Image, TouchableOpacity, Platform } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import SideSwipe from 'react-native-sideswipe';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles, center } from './styles';

/**
 * @param onDismiss {func}
 * @returns {JSX.Element}
 * @constructor
 */
export default function AdvicesView({ onDismiss, ...props }) {
  const [currentAdviceIndex, setCurrentAdviceIndex] = React.useState(0);
  const { colors } = useTheme();

  const handleCurrentDotColor = (index) => ({
    backgroundColor: index === currentAdviceIndex ? colors['--ifm-color-primary'] : '#C6D3F3',
  });

  const delay = currentAdviceIndex >= 2 ? null : 3000;
  useInterval(() => setCurrentAdviceIndex((prev) => prev + 1), delay);
  return (
    <View style={styles.root} {...props}>
      <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
        <MaterialCommunityIcons name="close" size={24} color="white" />
      </TouchableOpacity>

      <SideSwipe
        index={currentAdviceIndex}
        itemWidth={512}
        style={{
          width: 512,
          ...Platform.select({
            web: { height: 460 },
            ios: { height: 512 },
            android: { height: 512 },
          }),
        }}
        data={items}
        onIndexChange={(index) => setCurrentAdviceIndex(index)}
        renderItem={({ itemIndex, currentIndex, item, animatedValue }) => (
          <View style={styles.carouselContent}>
            <View style={{ borderRadius: 18, overflow: 'hidden' }}>
              <Image source={item.src} style={styles.adviceImage} />
            </View>

            {/* please keep this view (iconLayout) outside of the condition so it holds the icon place */}
            <View style={styles.iconLayout}>
              {item?.icon ? (
                <MaterialCommunityIcons name={item.icon} size={24} color="black" />
              ) : null}
            </View>
            <View style={center}>{item.text}</View>
          </View>
        )}
      />
      {/* carousel dots */}
      <View style={styles.carouselDotsLayout}>
        {new Array(3).fill('').map((_, index) => (
          <View style={[styles.carouselDot, handleCurrentDotColor(index)]} key={index} />
        ))}
      </View>
    </View>
  );
}

// in case we want this hook to be reusable then we can move it to "/hooks"
const useInterval = (callback, delay) => {
  const savedCallback = React.useRef(callback);

  // Remember the latest callback if it changes.
  React.useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    // Don't schedule if no delay is specified.
    if (!delay) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
};

const items = [
  {
    icon: 'brightness-5',
    text: (
      <>
        <Text>Make sure that the picture is taken </Text>
        <Text>in a bright enough space</Text>
      </>
    ),
    src: require('../../assets/brightness.gif'),
  },
  {
    icon: 'triangle-outline',
    text: <Text>Make sure that the picture is clear</Text>,
    src: require('../../assets/sharpness.gif'),
  },
  {
    text: (
      <>
        <Text>Please follow overlay masks on</Text>
        <Text>the screen to take the pictures in</Text>
        <Text>the right angle</Text>
      </>
    ),
    src: require('../../assets/carMask.gif'),
  },
];
