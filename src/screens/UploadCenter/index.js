import React, { useLayoutEffect } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Card, IconButton, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import UploadCard from './UploadCard/index';

const uri = 'https://images.unsplash.com/photo-1645382738209-110622cb069f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80';

export default () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: 'Upload center',
        headerRight: () => (
          <IconButton
            accessibilityLabel="Start inspection"
            icon="check"
            color={colors.primary}

          />
        ),
      });
    }
  }, [colors.primary, navigation]);

  return (
    <SafeAreaView>
      <Card>
        <Card.Title title="All uploads" subtitle="Use high image quality, for an accurate result" />
        <Card.Content>
          <ScrollView>
            <View style={{ height: 6 * 160 }}>
              <UploadCard uri={uri} isCompliant={false} reason="Image does not respect the minimum brightness" />
              <UploadCard uri={uri} isCompliant={false} reason="Image does not respect the minimum sharpness" />
              <UploadCard uri={uri} isCompliant={false} reason="Image is not compliant" />

              {new Array(3).fill(null).map(() => (
                <UploadCard uri={uri} isCompliant />
              ))}
            </View>
          </ScrollView>
        </Card.Content>
      </Card>
    </SafeAreaView>
  );
};
