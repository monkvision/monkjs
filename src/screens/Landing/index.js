import * as Linking from 'expo-linking';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useRef, useState } from 'react';
import { ScreenView, Container, MonkIcon, LogoIcon } from '@monkvision/ui';
import { useNavigation } from '@react-navigation/native';
import { Animated, Platform, useWindowDimensions, View } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import { useFormik } from 'formik';
import SignIn from 'screens/Authentication/SignIn';

import InspectionList from 'screens/InspectionList';
import * as names from 'screens/names';
import useAuth from 'hooks/useAuth';

import {
  Menu, Button, Divider, TextInput,
  useTheme, Text, Switch, Title,
  HelperText,
} from 'react-native-paper';

import useCreateInspection from './useCreateInspection';
import styles from './styles';

const CAPTURE_MODS = {
  car360: 'Car 360°',
  wheelAnalysis: 'Wheel analysis',
  repairEstimate: 'Estimate repairs',
  video: 'Video (alpha)',
};

function Icon() {
  const { colors } = useTheme();

  return (
    <LogoIcon
      outerColor={colors.background}
      width={30}
      height={30}
    />
  );
}

export default function Landing() {
  const { isAuthenticated } = useAuth();

  const { colors } = useTheme();
  const navigation = useNavigation();
  const { height: minHeight } = useWindowDimensions();

  const useNativeDriver = Platform.OS !== 'web';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver,
    }).start();
  };
  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 0,
      useNativeDriver,
    }).start();
  };

  const [isOpen, setOpen] = useState(false);
  const [captureMod, setCaptureMod] = useState('car360');

  const [isFormOn, setIsFormOn] = React.useState(false);
  const closeForm = () => { setIsFormOn(false); fadeOut(); };
  const openForm = () => { setIsFormOn(true); fadeIn(); };
  const displayForm = !isFormOn ? 'none' : undefined;

  const openMenu = useCallback(() => setOpen(true), []);
  const closeMenu = useCallback(() => setOpen(false), []);
  const handleMenuPress = useCallback((value) => {
    setCaptureMod(value);
    closeMenu();
  }, [closeMenu]);

  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const { values, handleChange } = useFormik({
    initialValues: { vin: '' },
    enableReinitialize: true,
  });

  const handleNavigation = useCallback((inspectionId) => {
    navigation.navigate(names.INSPECTION_CAPTURE, { inspectionId });
  }, [navigation]);

  const [createInspection, inspectionId] = useCreateInspection(captureMod);
  const [createInspectionState, , startCreateInspectionRequest] = createInspection;

  const handleProceedToCapture = useCallback(async () => {
    if (isEmpty(inspectionId)) {
      const response = await startCreateInspectionRequest();
      handleNavigation(response.result);
    } else {
      handleNavigation(inspectionId);
    }
  }, [handleNavigation, inspectionId, startCreateInspectionRequest]);

  const handleLegalNoticePress = useCallback(() => {
    Linking.openURL('https://monk.ai/legal-notice');
  }, []);

  const handlePrivacyPress = useCallback(() => {
    Linking.openURL('https://monk.ai/cookie-policy');
  }, []);

  return (
    <ScreenView>
      <View
        style={[styles.root, {
          backgroundColor: colors.background,
          minHeight,
        }]}
      >
        <Container style={styles.top}>
          <MonkIcon
            color={colors.primary}
            width={140}
            height={35}
            onPress={closeForm}
          />
          <Animated.View style={[styles.topRight, { opacity: fadeAnim, display: displayForm }]}>
            <Menu
              visible={isOpen}
              onDismiss={closeMenu}
              anchor={(
                <Button onPress={openMenu} icon="chevron-down">
                  {CAPTURE_MODS[captureMod]}
                </Button>
              )}
            >
              <Menu.Item
                onPress={() => handleMenuPress('car360')}
                title={CAPTURE_MODS.car360}
              />
              <Menu.Item
                onPress={() => handleMenuPress('wheelAnalysis')}
                title={CAPTURE_MODS.wheelAnalysis}
              />
              <Menu.Item
                onPress={() => handleMenuPress('repairEstimate')}
                title={CAPTURE_MODS.repairEstimate}
              />
              <Divider />
              <Menu.Item
                onPress={() => handleMenuPress('video')}
                title={CAPTURE_MODS.video}
              />
            </Menu>
          </Animated.View>
        </Container>
        <Container style={styles.mid}>
          <Title style={styles.title}>
            AI powered
            <Text style={[styles.titleAccent, { color: colors.text }]}>
              vehicle damage detection
            </Text>
          </Title>
          <Animated.View style={{ opacity: fadeAnim, display: displayForm }}>
            <TextInput
              disabled={createInspectionState.loading}
              label="VIN number"
              placeholder="VFX XXXXX XXXXXXXX"
              onChangeText={handleChange('vin')}
              render={(props) => (
                <TextInputMask
                  type="custom"
                  options={{ mask: 'SSS SSSSSS SSSSSSSS' }}
                  {...props}
                />
              )}
              right={(
                <TextInput.Icon
                  disabled={createInspectionState.loading}
                  name="camera"
                  color={colors.primary}
                />
              )}
              style={styles.textInput}
              value={values.vin}
            />
            <HelperText visible style={styles.helperText}>
              The best way to see it is to look
              through the windshield from outside the car
              or on the driver&#39;s side door pillar.
            </HelperText>
          </Animated.View>
          {!isFormOn && (
            <View>
              <Button
                mode="contained"
                color={colors.primary}
                onPress={openForm}
                icon={Icon}
              >
                Start inspection
              </Button>
            </View>
          )}
        </Container>
        <Animated.View style={{ opacity: fadeAnim, display: displayForm }}>
          <Container style={styles.bottom}>
            <View style={styles.switchContainer}>
              <Switch
                style={styles.switch}
                value={isSwitchOn}
                onValueChange={onToggleSwitch}
              />
              <Text
                onPress={onToggleSwitch}
                style={{ color: isSwitchOn ? colors.accent : colors.text }}
              >
                Save pictures in device
              </Text>
            </View>
            {!isAuthenticated ? (
              <SignIn icon="login-variant" color={colors.primary}>
                Start
              </SignIn>
            ) : (
              <Button
                icon="rocket-launch"
                mode="contained"
                onPress={handleProceedToCapture}
                disabled={createInspectionState.loading}
                loading={createInspectionState.loading}
              >
                Start
              </Button>
            )}
          </Container>
        </Animated.View>
        {!isFormOn && (
          <Container style={[styles.bottom, styles.bottomAlt]}>
            <Button color={colors.text} onPress={handleLegalNoticePress}>Legal Notice</Button>
            <Button color={colors.text} onPress={handlePrivacyPress}>Privacy</Button>
          </Container>
        )}
      </View>
      {isAuthenticated && <InspectionList />}
    </ScreenView>
  );
}
