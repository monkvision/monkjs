import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import SideSwipe from 'react-native-sideswipe';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const center = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    position: 'relative',
  },
  carouselDotsLayout: {
    ...center,
    flexDirection: 'row',
    width: '100%',
    height: 20,
    ...Platform.select({
      ios: {
        width: 512,
        position: 'absolute',
        bottom: 8,
        zIndex: 1,
      },
      android: {
        width: 512,
        position: 'absolute',
        bottom: 8,
        zIndex: 1,
      },
    }),
  },
  carouselDot: {
    width: 10,
    height: 10,
    margin: 10,
    borderRadius: 999,
  },
  carouselContent: {
    display: 'flex',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        width: 512,
      },
      android: {
        width: 512,
      },
    }),
  },
  iconLayout: {
    marginTop: 24,
    marginBottom: 10,
    height: 24,
  },
  closeButton: {
    borderRadius: 999,
    width: 32,
    height: 32,
    ...center,
    backgroundColor: 'grey',
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  adviceImage: {
    ...Platform.select({
      web: {
        width: 512,
        height: 340,
      },
      ios: {
        width: 270,
        height: 180,
      },
      android: {
        width: 270,
        height: 180,
      },
    }),
  },
});

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
