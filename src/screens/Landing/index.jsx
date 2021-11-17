import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, useTheme } from 'react-native-paper';
import MonkIcon from 'components/Icons/MonkIcon';
import { utils } from '@monkvision/react-native';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';

import useAuth from 'hooks/useAuth';
import { spacing } from 'config/theme';
import { INSPECTION_CREATE, INSPECTIONS } from '../names';
import Vehicule from './Vehicule';

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
  },
  container: {
    paddingVertical: spacing(2),
    width: '100%',
    maxWidth: '90%',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    top: 0,
    zIndex: 99,
    width: '100%',
    ...Platform.select({
      web: { position: 'absolute', marginVertical: spacing(4) },
    }),
  },
  title: {
    ...Platform.select({
      web: { fontSize: 48 },
      native: { fontSize: 32 },
    }),
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: spacing(2),
  },
  text: {
    textAlign: 'center',
    marginVertical: spacing(2),
    color: '#595D73',
  },
  content: {
    ...utils.styles.flex,
    flexDirection: 'column',
    ...Platform.select({ native: { marginTop: height * 0.25 } }),
  },
  links: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Platform.select({ web: 250, default: 90 }),
  },
  primaryButton: {
    marginVertical: spacing(2),
  },
});

export default () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { signout } = useAuth();

  const handleSignout = React.useCallback(signout, [signout]);
  const handleStart = React.useCallback(() => navigation.navigate(INSPECTION_CREATE), [navigation]);
  const goToInspections = React.useCallback(() => navigation.navigate(INSPECTIONS), [navigation]);

  const isWeb = Platform.select({ web: true, default: false });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar hidden />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.root}>
          {/* nav */}
          <View style={styles.container}>
            <View style={styles.nav}>
              {/* logo */}
              <MonkIcon color={colors.primary} width={100} height={44} />

              {/* links */}
              <View style={styles.links}>
                {isWeb ? (
                  <>
                    <Button onPress={goToInspections} accessibilityLabel="Inspections">
                      Inspections
                    </Button>
                    <Button onPress={handleSignout} accessibilityLabel="Sign out">
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <TouchableOpacity onPress={goToInspections} accessibilityLabel="Inspections">
                      <MaterialCommunityIcons
                        name="image-search-outline"
                        size={28}
                        color={colors.primary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSignout} accessibilityLabel="Sign out">
                      <Entypo name="log-out" size={24} color={colors.primary} />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>

            {/* content */}
            <View style={styles.content}>
              <View style={{ width: '100%', maxWidth: 500 }}>
                <Vehicule />
              </View>
              <Text style={styles.title}>AI powered visual damage inspection</Text>
              <Text style={styles.text}>
                Take your car damage inspection to a next level, using only your device camera
              </Text>
              <Button onPress={handleStart} mode="contained" style={styles.primaryButton}>
                Start an inspection
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
