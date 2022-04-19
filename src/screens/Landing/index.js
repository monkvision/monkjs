import { useInterval } from '@monkvision/toolkit';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, useWindowDimensions, SafeAreaView, FlatList } from 'react-native';
import { Container } from '@monkvision/ui';
import { List, Surface, useTheme } from 'react-native-paper';
import { ScrollView } from 'react-native-web';
import Inspection from 'components/Inspection';
import Artwork from 'screens/Landing/Artwork';
import useGetInspection from 'screens/Landing/useGetInspection';

import * as names from 'screens/names';
import styles from './styles';

const LIST_ITEMS = [{
  value: 'vinNumber',
  title: 'VIN number',
  description: 'Vehicle info obtained from OCR',
  icon: 'car-info',
}, {
  value: 'car360',
  title: 'Car 360°',
  description: 'Vehicle tour in 14 pictures',
  icon: 'axis-z-rotate-counterclockwise',
}, {
  value: 'wheels',
  title: 'Wheels',
  description: 'Details about rim condition',
  icon: 'circle-double',
}, {
  value: 'classic',
  title: 'Classic flow',
  description: 'Recommended for damage detection',
  icon: 'car-side',
}];

export default function Landing() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { height } = useWindowDimensions();

  const route = useRoute();
  const { inspectionId } = route.params || {};

  const getInspection = useGetInspection(inspectionId);

  const handleListItemPress = useCallback((value) => {
    navigation.navigate(names.INSPECTION_CREATE, { selectedMod: value, inspectionId });
  }, [inspectionId, navigation]);

  const renderListItem = useCallback(({ item, index }) => {
    const { title, icon, value, description } = item;

    const left = () => <List.Icon icon={icon} />;
    const right = () => <List.Icon icon="chevron-right" />;
    const handlePress = () => handleListItemPress(value);

    return (
      <Surface style={(index % 2 === 0) ? styles.evenListItem : styles.oddListItem}>
        <List.Item
          title={title}
          description={description}
          left={left}
          right={right}
          onPress={handlePress}
        />
      </Surface>
    );
  }, [handleListItemPress]);

  const start = useCallback(() => {
    if (inspectionId && getInspection.state.loading !== true) {
      getInspection.start();
    }
  }, [inspectionId, getInspection]);

  useInterval(start, 20000);

  useEffect(() => navigation.addListener('focus', start), [navigation, start]);

  return (
    <SafeAreaView>
      <LinearGradient
        colors={[colors.background, colors.gradient]}
        style={[styles.background, { height }]}
      />
      <Container style={styles.root}>
        <View style={[styles.left, { height }]}>
          {isEmpty(getInspection.denormalizedEntities) ? <Artwork /> : (
            getInspection.denormalizedEntities.map((i) => (
              <Inspection {...i} key={`landing-inspection-${i.id}`} />
            )))}
        </View>
        <Surface style={styles.right}>
          <ScrollView contentContainerStyle={{ height }}>
            <List.Section>
              <List.Subheader>What do you want to inspect?</List.Subheader>
              <FlatList
                data={LIST_ITEMS}
                renderItem={renderListItem}
                keyExtractor={(item) => item.value}
              />
            </List.Section>
          </ScrollView>
        </Surface>
      </Container>
    </SafeAreaView>
  );
}
