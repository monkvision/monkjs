import React, { useCallback, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';
import { ScreenView, Container, MonkIcon } from '@monkvision/ui';
import { Animated, useWindowDimensions, View } from 'react-native';
import { Menu, Button, Divider, TextInput, useTheme, Text, Switch, HelperText } from 'react-native-paper';

import * as names from 'screens/names';

import useAnim from './useAnim';
import useForm from './useForm';
import useMenu from './useMenu';
import useCreateInspection from './useCreateInspection';

import styles from './styles';

const CAPTURE_MODS = {
  car360: 'Car 360°',
  wheelAnalysis: 'Wheel analysis',
  repairEstimate: 'Estimate repairs',
  video: 'Video (alpha)',
};

export default function InspectionCreate() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { height: minHeight } = useWindowDimensions();

  const route = useRoute();
  const { inspectionId: idFromParams } = route.params || {};

  const anim = useAnim();
  const menu = useMenu();
  const form = useForm();

  const handleMenuDismiss = useCallback(() => menu.close(), [menu]);
  const handleMenuButtonPress = useCallback(() => menu.open(), [menu]);
  const handleMenuItemPress = useCallback((field, value) => {
    form.setFieldValue(field, value);
    menu.close();
  }, [form, menu]);

  const createInspection = useCreateInspection();
  const handleStart = useCallback(async (vin = false) => {
    const navigateTo = vin ? names.VIN : names.INSPECTION_CAPTURE;
    if (idFromParams) {
      navigation.navigate(navigateTo, { inspectionId: idFromParams });
    } else {
      const response = await createInspection.start(form.values);
      const inspectionId = response.result;
      navigation.navigate(navigateTo, { inspectionId });
    }
  }, [createInspection, form.values, idFromParams, navigation]);

  useEffect(() => navigation.addListener('focus', () => {
    menu.close();
    form.setFieldValue('vin', form.initialValues.vin);
  }), [form, menu, navigation]);

  return (
    <ScreenView>
      <Animated.View
        style={[styles.root, {
          backgroundColor: colors.background,
          minHeight,
          opacity: anim.fadeAnim,
        }]}
      >
        <Container style={styles.top}>
          <MonkIcon
            color={colors.primary}
            width={140}
            height={35}
            onPress={() => navigation.navigate(names.LANDING)}
          />
          <View style={[styles.topRight]}>
            <Menu
              visible={menu.isOpen}
              onDismiss={handleMenuDismiss}
              anchor={(
                <Button onPress={handleMenuButtonPress} icon="chevron-down">
                  {CAPTURE_MODS[form.values.captureMod]}
                </Button>
              )}
            >
              <Menu.Item
                onPress={() => handleMenuItemPress('captureMod', 'car360')}
                title={CAPTURE_MODS.car360}
              />
              <Menu.Item
                onPress={() => handleMenuItemPress('captureMod', 'wheelAnalysis')}
                title={CAPTURE_MODS.wheelAnalysis}
              />
              <Menu.Item
                onPress={() => handleMenuItemPress('captureMod', 'repairEstimate')}
                title={CAPTURE_MODS.repairEstimate}
              />
              <Divider />
              <Menu.Item
                onPress={() => handleMenuItemPress('captureMod', 'video')}
                title={CAPTURE_MODS.video}
              />
            </Menu>
          </View>
        </Container>
        <Container style={styles.mid}>
          <TextInput
            disabled={createInspection.state.loading}
            label="VIN number"
            placeholder="VFX XXXXX XXXXXXXX"
            onChangeText={form.handleChange('vin')}
            render={(props) => (
              <TextInputMask
                type="custom"
                options={{ mask: 'SSS SSSSSS SSSSSSSS' }}
                {...props}
              />
            )}
            right={(
              <TextInput.Icon
                disabled={createInspection.state.loading}
                forceTextInputFocus={false}
                name="camera"
                onPress={() => handleStart(true)}
              />
              )}
            style={styles.textInput}
            value={form.values.vin}
          />
          <HelperText visible style={styles.helperText}>
            The best way to see it is to look
            through the windshield from outside the car
            or on the passenger&#39;s side door pillar.
          </HelperText>
        </Container>
        <View>
          <Container style={styles.bottom}>
            <View style={styles.switchContainer}>
              <Switch
                style={styles.switch}
                value={form.values.saveInDevice}
                onValueChange={(value) => form.setFieldValue('saveInDevice', value)}
              />
              <Text
                onPress={() => form.setFieldValue('saveInDevice', true)}
                style={{ color: form.values.saveInDevice ? colors.accent : colors.text }}
              >
                Save pictures in device
              </Text>
            </View>
            <Button
              disabled={createInspection.state.loading}
              icon="login-variant"
              loading={createInspection.state.loading}
              mode="contained"
              onPress={handleStart}
            >
              Start
            </Button>
          </Container>
        </View>
      </Animated.View>
    </ScreenView>
  );
}
