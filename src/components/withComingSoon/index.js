import React from 'react';
import { View, useWindowDimensions, StyleSheet, Text, Platform } from 'react-native';
import { Portal, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { utils } from '@monkvision/react-native';

import Drawing from '../Drawing';
import com from './assets/construction.svg';

const { spacing, flex } = utils.styles;
const styles = StyleSheet.create({
  root: {
    position: 'relative',
  },
  overlay: {
    padding: spacing(4),
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    ...flex,
    flexDirection: 'column',
  },
  text: {
    marginVertical: spacing(3),
    textAlign: 'center',
  },
});

const withComingSoon = (Component) => (props) => {
  const { width, height } = useWindowDimensions();
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <>
      <Portal>
        <View style={[styles.overlay, { width, height }]}>
          <View>
            <Drawing xml={com} height={200} maxWidth={Platform.OS === 'web' ? 400 : width - spacing(4)} />
            <Text style={styles.text}>
              This feature is still in progress, our great team will make it
              available as soon as possible
            </Text>
            <Button mode="contained" color={colors.warning} labelStyle={{ color: '#FFF' }} onPress={() => navigation.goBack()} icon="arrow-left">
              Back
            </Button>
          </View>
        </View>
      </Portal>
      <Component {...props} />
    </>
  );
};
export default withComingSoon;
