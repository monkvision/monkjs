import React from 'react';
import { Text, View, Image } from 'react-native';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { styles, getThemedStyles } from './styles';

const totalPhoto = { inside: 4, outside: 12 };

export default function Body() {
  const { colors } = useTheme();
  const themedStyles = getThemedStyles({ colors });

  const ColumnItem = (title, count, image, style) => (
    <View style={styles.columnStyle}>
      <Image source={image} style={style} />
      <View style={styles.columnTextStyle}>
        <Text style={themedStyles.columnPhotoNumber}>{count}</Text>
        <MaterialCommunityIcons name="close" size={15} styles={{ flex: 0.1 }} color={colors.info} />
        <Text style={themedStyles.columnInfoStyle}>{title}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.body}>
      <View style={styles.photoProcess}>
        <MaterialCommunityIcons name="camera" size={40} color={colors.primary} />
        <Text style={{ color: colors.primary, paddingTop: 5 }}>PHOTO PROCESS</Text>
      </View>
      {ColumnItem('photos outsides', totalPhoto.outside, require('./images/outside_view.png'), { width: 73, height: 95 })}
      {ColumnItem('photos insides', totalPhoto.inside, require('./images/inside_view.png'), { width: 45, height: 60, margin: 15 })}
    </View>
  );
}
