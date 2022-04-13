import React, { useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, useWindowDimensions, SafeAreaView, FlatList } from 'react-native';
import { Container } from '@monkvision/ui';
import { List, Surface, useTheme } from 'react-native-paper';
import { ScrollView } from 'react-native-web';
import Artwork from 'screens/Landing/Artwork';

import * as names from 'screens/names';
import styles from './styles';

const LIST_ITEMS = [{
  value: 'vinNumber',
  title: 'VIN number',
  icon: 'car-info',
}, {
  value: 'car360',
  title: 'Car 360°',
  icon: 'axis-z-rotate-counterclockwise',
}, {
  value: 'wheels',
  title: 'Wheels',
  icon: 'circle-double',
}, {
  value: 'classic',
  title: 'Classic flow',
  description: 'Car 360° + wheels + interior pictures',
  icon: 'car-side',
}];

export default function Landing() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { height } = useWindowDimensions();

  const route = useRoute();
  const { inspectionId } = route.params || {};

  const handleListItemPress = useCallback((value) => {
    navigation.navigate(names.INSPECTION_CREATE, { selectedMod: value });
  }, [navigation]);

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

  return (
    <SafeAreaView>
      <LinearGradient
        colors={[colors.background, colors.gradient]}
        style={[styles.background, { height }]}
      />
      <Container style={styles.root}>
        <View style={[styles.left, { height }]}>
          <Artwork />
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
