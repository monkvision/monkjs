import { Entypo, Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import style from './style';

const infoColor = '#43494A';
const totalPhoto = { inside: 4, outside: 12 };

export default function Body() {
  const { colors } = useTheme();
  return (
    <View style={style.body}>
      <View style={style.photoProcess}>
        {/* Photo Progress icon */}
        <Feather name="camera" size={30} color={colors.primary} />
        <Text style={{ color: colors.primary, fontWeight: 700, paddingTop: 5 }}>
          PHOTO PROCESS
        </Text>
      </View>
      <View style={style.columnStyle}>
        {/* outside photos */}
        <Image source={require('./svg/vehicle-outside.svg')} style={{ width: 72, height: 94.85, marginLeft: 20 }} />
        <View style={style.columnTextStyle}>
          <Text style={style.columnPhotoNumber}>{totalPhoto.outside}</Text>
          <Entypo name="cross" size={15} style={{ flex: 0.1 }} color={infoColor} />
          <Text style={style.columnInfoStyle}>photos outsides</Text>
        </View>
      </View>
      <View style={style.columnStyle}>
        {/* inside photos */}
        <Image source={require('./svg/vehicle-inside.svg')} style={{ width: 45, height: 59.52, margin: 17 }} />
        <View style={style.columnTextStyle}>
          <Text style={style.columnPhotoNumber}>{totalPhoto.inside}</Text>
          <Entypo name="cross" size={15} style={{ flex: 0.1 }} color={infoColor} />
          <Text style={style.columnInfoStyle}>photos insides</Text>
        </View>
      </View>
    </View>
  );
}
