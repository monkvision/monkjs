import React from 'react';
import { StyleSheet, Image, View, Platform, TouchableOpacity } from 'react-native';

const carViews = {
  front: require('../../../../assets/carViews/Miniatures/front.png'),
  back: require('../../../../assets/carViews/Miniatures/back.png'),
  in: require('../../../../assets/carViews/Miniatures/in.png'),
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    top: 60,
    left: 45,
    bottom: 20,
    ...Platform.select({
      native: { flex: 1 },
      default: {
        display: 'flex',
        flex: 1,
      },
    }),
    position: 'absolute',
    backgroundColor: 'transparent',
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
    width: 92,
  },
  card: {
    width: '100%',
    height: 92,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardCover: {
    alignSelf: 'center',
  },
});
export default function DamageLibraryLeftActions(props) {
  const { handlePress } = props;

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <TouchableOpacity onPress={handlePress}>
          <Image height={52} width={92} source={Image.resolveAssetSource(carViews.front)} />
        </TouchableOpacity>
      </View>

      <View onPress={handlePress} style={styles.card}>
        <TouchableOpacity onPress={handlePress}>
          <Image height={52} width={92} source={Image.resolveAssetSource(carViews.back)} />
        </TouchableOpacity>
      </View>

      <View onPress={handlePress} style={styles.card}>
        <TouchableOpacity onPress={handlePress}>
          <Image height={52} width={92} source={Image.resolveAssetSource(carViews.in)} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
