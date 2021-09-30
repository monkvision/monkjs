import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

const styles = StyleSheet.create({
  button: {},
});

export default function () {
  const theme = useTheme();
  return (
    <Button style={styles.button} color={theme.colors.primary}>
      Add photos
    </Button>
  );
}

export const FinishButton = () => {
  const theme = useTheme();
  return (
    <Button style={styles.button} color={theme.colors.notification}>
      Finish
    </Button>
  );
};
