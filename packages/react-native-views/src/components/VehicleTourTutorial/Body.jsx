import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View, Image } from 'react-native';
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
        <MaterialCommunityIcons name="camera" size={40} color={colors.primary} />
        <Text style={{ color: colors.primary, paddingTop: 5 }}>
          PHOTO PROCESS
        </Text>
      </View>
      <View style={style.columnStyle}>
        {/* outside photos */}
        <Image source={require('./images/outside_view.png')} width={75} height={122} style={{ width: 73, height: 95 }} />
        <View style={style.columnTextStyle}>
          <Text style={style.columnPhotoNumber}>{totalPhoto.outside}</Text>
          <MaterialCommunityIcons name="close" size={15} style={{ flex: 0.1 }} color={infoColor} />
          <Text style={style.columnInfoStyle}>photos outsides</Text>
        </View>
      </View>
      <View style={style.columnStyle}>
        {/* inside photos */}
        <Image source={require('./images/inside_view.png')} width={45} height={92} style={{ width: 45, height: 60, margin: 15 }} />
        <View style={style.columnTextStyle}>
          <Text style={style.columnPhotoNumber}>{totalPhoto.inside}</Text>
          <MaterialCommunityIcons name="close" size={15} style={{ flex: 0.1 }} color={infoColor} />
          <Text style={style.columnInfoStyle}>photos insides</Text>
        </View>
      </View>
    </View>
  );
}
