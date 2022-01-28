import React from 'react';
import { Capture } from '@monkvision/camera';
import { StatusBar, SafeAreaView } from 'react-native';

export default function Test() {
  return (
    <SafeAreaView>
      <StatusBar hidden />
      <Capture />
    </SafeAreaView>
  );
}
