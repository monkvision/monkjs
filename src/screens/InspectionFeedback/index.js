import React, { useCallback, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useMediaQuery } from 'react-responsive';
import { Card, List, useTheme } from 'react-native-paper';
import { View, useWindowDimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { version } from '@package/json';

import { Feedback } from '@monkvision/feedback';
import { Container } from '@monkvision/ui';
import * as names from 'screens/names';

import Artwork from '../Landing/Artwork';
import styles from './styles';

export default function InspectionFeedback() {
  const { colors } = useTheme();
  const { height } = useWindowDimensions();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });

  const route = useRoute();
  const { inspectionId, vehicleType } = route.params || {};

  const [tireCondition, setTireCondition] = useState('');
  const [windShieldCondition, setWindShieldCondition] = useState('');
  const [vehicleInterior, setVehicleInterior] = useState('');
  const [additionInfo, setAdditionInfo] = useState('');

  const handleSubmit = useCallback(() => {
    const data = {
      tireCondition,
      windShieldCondition,
      vehicleInterior,
      additionInfo
    }
    console.log('🚀 ~ handleSubmit ~ data : ', data);
    navigation.navigate(names.INSPECTION_REPORT, { inspectionId, vehicleType });
  }, [
    inspectionId,
    vehicleType,
    navigation,
    tireCondition,
    windShieldCondition,
    vehicleInterior,
    additionInfo,
  ]);

  return (
    <View style={[styles.root, { minHeight: height, backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradient, colors.background]}
        style={[styles.background, { height }]}
      />
      <Container style={[styles.container, isPortrait ? styles.portrait : {}]}>
        <View style={[styles.left, isPortrait ? styles.leftPortrait : {}]}>
          <Artwork />
        </View>
        <Card style={[styles.card, styles.right, isPortrait ? styles.rightPortrait : {}]}>
          <List.Section style={styles.textAlignRight}>
            <List.Subheader>
              {t('landing.appVersion')}
              {': '}
              {version}
            </List.Subheader>
          </List.Section>
          <List.Section>
            <List.Subheader>Feedback</List.Subheader>
            <View style={styles.feedbackWrapper}>
              <Feedback
                questions={[{
                  type: 'radio',
                  question: 'What is the condition of the tires?',
                  answer: tireCondition,
                  onChange: (data) => setTireCondition(data.value),
                  options: [
                    { label: 'Poor', value: 'Poor' },
                    { label: 'Average', value: 'Average' },
                    { label: 'Good', value: 'Good' },
                  ],
                }, {
                  type: 'radio',
                  question: 'What is the condition of the windshield?',
                  answer: windShieldCondition,
                  onChange: (data) => setWindShieldCondition(data.value),
                  options: [
                    { label: 'Poor', value: 'Poor' },
                    { label: 'Average', value: 'Average' },
                    { label: 'Good', value: 'Good' },
                  ],
                }, {
                  type: 'radio',
                  question: 'What is the condition of the vehicle\'s interior?',
                  answer: vehicleInterior,
                  onChange: (data) => setVehicleInterior(data.value),
                  options: [
                    { label: 'Poor', value: 'Poor' },
                    { label: 'Average', value: 'Average' },
                    { label: 'Good', value: 'Good' },
                  ],
                }, {
                  type: 'text',
                  question: 'Any additional info?',
                  answer: additionInfo,
                  onChange: (value) => setAdditionInfo(value),
                }, {
                  type: 'button',
                  question: 'Skip',
                  onChange: () => handleSubmit()
                }, {
                  type: 'button',
                  question: 'Validate',
                  onChange: () => handleSubmit()
                }]}
              />
            </View>
          </List.Section>
        </Card>
      </Container>
    </View>
  );
}

InspectionFeedback.propTypes = {};

InspectionFeedback.defaultProps = {};
