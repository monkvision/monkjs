import React from 'react';
import { View, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { styles } from './styles';

const Label = ({ children }) => <Text style={styles.label}>{children}</Text>;

// IOS
const brightnessGif = require('../../assets/brightness.gif');
const sharpnessGif = require('../../assets/sharpness.gif');
const carMaskGif = require('../../assets/carMask.gif');

// Android and WEB
const brightnessWebP = require('../../assets/brightness.webp');
const sharpnessWebP = require('../../assets/sharpness.webp');
const carMaskWebP = require('../../assets/carMask.webp');

const items = [
  {
    key: 'Brightness',
    icon: 'brightness-5',
    src: Platform.select({
      ios: brightnessGif,
      default: brightnessWebP,
    }),
    text: (
      <View style={styles.labelLayout}>
        <Label>Make sure that the picture is taken </Label>
        <Label>in a bright enough space</Label>
      </View>
    ),
  },
  {
    key: 'Sharpness',
    icon: 'triangle-outline',
    src: Platform.select({
      ios: sharpnessGif,
      default: sharpnessWebP,
    }),
    text: (
      <View style={styles.labelLayout}>
        <Label>Make sure that the picture is clear</Label>
      </View>
    ),
  },
  {
    key: 'Car mask',
    src: Platform.select({
      ios: carMaskGif,
      default: carMaskWebP,
    }),
    text: (
      <View style={styles.labelLayout}>
        <Label>Please follow overlay masks on</Label>
        <Label>the screen to take the pictures in</Label>
        <Label>the right angle</Label>
      </View>
    ),
  },
];

export default items;
