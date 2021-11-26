import React, { useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash.noop';

import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, List, useTheme } from 'react-native-paper';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
  },
  listView: {
    marginVertical: 8,
  },
  illustrationView: {
    margin: 16,
  },
});

/**
 * @param navigation
 * @param nbOfInsidePics
 * @param nbOfOutsidePics
 * @param onStart
 * @returns {JSX.Element}
 * @constructor
 */
export default function TutorialView({ navigation, nbOfInsidePics, nbOfOutsidePics, onStart }) {
  const { colors } = useTheme();

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: 'Photo process',
        headerBackVisible: true,
        headerRight: () => <Button icon="camera" onPress={onStart}>Start</Button>,
      });
    }
  }, [navigation, onStart]);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView>
        <View style={styles.listView}>
          <List.Item
            title="✖ outside pictures"
            description="Make a 360° tour of the vehicle and take exterior pictures."
            left={(props) => (
              <Avatar.Text
                {...props}
                label={nbOfOutsidePics}
                color={colors.primaryContrastText}
              />
            )}
          />
          <List.Item
            title="✖ inside pictures"
            description="Open the vehicle and take interior pictures."
            left={(props) => (
              <Avatar.Text
                {...props}
                label={nbOfInsidePics}
                color={colors.primaryContrastText}
              />
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

TutorialView.propTypes = {
  navigation: PropTypes.shape({
    canGoBack: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    setOptions: PropTypes.func.isRequired,
  }),
  nbOfInsidePics: PropTypes.number,
  nbOfOutsidePics: PropTypes.number,
  onStart: PropTypes.func,
};

TutorialView.defaultProps = {
  onStart: noop,
  nbOfInsidePics: 4,
  nbOfOutsidePics: 12,
  navigation: null,
};
