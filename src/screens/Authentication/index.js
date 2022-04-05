import React, { useCallback } from 'react';
import { SafeAreaView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, useTheme } from 'react-native-paper';
import * as Linking from 'expo-linking';

import { Drawing } from '@monkvision/ui';

import SignIn from './SignIn';
import styles from './styles';
import svgXml from './splash.svg';

export default function Authentication() {
  const { colors } = useTheme();

  const handleLegalNoticePress = useCallback(() => {
    Linking.openURL('https://monk.ai/legal-notice');
  }, []);

  const handlePrivacyPress = useCallback(() => {
    Linking.openURL('https://monk.ai/cookie-policy');
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar />
      <Drawing xml={svgXml} alt="artwork" width={160} height={208} />
      <SignIn />
      <View style={styles.footer}>
        <Button color={colors.text} onPress={handleLegalNoticePress}>Legal Notice</Button>
        <Button color={colors.text} onPress={handlePrivacyPress}>Privacy</Button>
      </View>
    </SafeAreaView>
  );
}
