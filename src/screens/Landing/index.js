import useAuth from 'hooks/useAuth';
import React, { useCallback, useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { View, useWindowDimensions, SafeAreaView } from 'react-native';
import { Container, Drawing } from '@monkvision/ui';
import { Button, Card, Divider, Searchbar, Title, useTheme } from 'react-native-paper';

import InspectionList from 'screens/InspectionList';
import SignIn from 'screens/Authentication/SignIn';
import * as names from 'screens/names';
import useSignIn from './useSignIn';
import artwork from './artwork.svg';
import monk from './monk.svg';
import styles from './styles';

export default function Landing() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');
  const onChangeSearch = (query) => setSearchQuery(query);

  const handleStart = useCallback(async () => {
    navigation.navigate(names.INSPECTION_CREATE);
  }, [navigation]);

  const { height } = useWindowDimensions();

  const signIn = useSignIn();
  const { isAuthenticated } = useAuth();
  const handleSignInStart = useCallback(() => signIn.start(), [signIn]);
  const handleSignInError = useCallback(() => signIn.stop(), [signIn]);

  useEffect(() => navigation.addListener('focus', () => {
    signIn.stop();
  }), [navigation, signIn]);

  return (
    <SafeAreaView>
      <LinearGradient
        colors={[colors.background, colors.gradient]}
        style={[styles.background, { height }]}
      />
      <Container style={styles.root}>
        <View style={[styles.left, { height }]}>
          <Drawing xml={artwork} alt="artwork" width={250} height={183} />
          <Title style={styles.title}>Inspect your car with</Title>
          <Drawing xml={monk} alt="artwork" width={120} height={32} />
        </View>
        <View style={styles.right}>
          <Card style={styles.card}>
            <Card.Content>
              <Searchbar
                placeholder="Search"
                onChangeText={onChangeSearch}
                value={searchQuery}
              />
            </Card.Content>
            <Card.Content style={[styles.cardContent, { height: height - 116 - 32 }]}>
              <InspectionList style={styles.list} />
            </Card.Content>
            <Divider />
            <Card.Actions style={styles.cardAction}>
              {isAuthenticated ? (
                <Button
                  color={colors.primary}
                  icon="login-variant"
                  mode="contained"
                  onPress={handleStart}
                  size="large"
                >
                  Start inspection
                </Button>
              ) : (
                <SignIn
                  color={colors.primary}
                  disabled={signIn.isLoading}
                  icon="login-variant"
                  onStart={handleSignInStart}
                  onError={handleSignInError}
                  onSuccess={handleStart}
                  size="large"
                >
                  Start inspection
                </SignIn>
              )}
            </Card.Actions>
          </Card>
        </View>
      </Container>
    </SafeAreaView>
  );
}
