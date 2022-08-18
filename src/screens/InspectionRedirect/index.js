import React, { useEffect } from 'react';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { useWindowDimensions, View, StyleSheet } from 'react-native';
import { Loader } from '@monkvision/ui';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function InspectionRedirect() {
  const route = useRoute();
  const { colors, loaderDotsColors } = useTheme();
  const { height } = useWindowDimensions();

  const navigation = useNavigation();
  const { to, ...params } = route.params;

  console.log(route);

  useEffect(() => {
    if (!route.params) { navigation.goBack(); return; }
    navigation.navigate(to, params);
  }, [route.params]);

  return (
    <View style={[styles.root, { backgroundColor: colors.background, height }]}>
      <Loader texts={[`Processing...`]} colors={loaderDotsColors} />
    </View>
  );
}
