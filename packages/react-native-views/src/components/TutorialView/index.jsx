import React from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash.noop';

import { SafeAreaView, ScrollView, StyleSheet, View, Platform } from 'react-native';
import { Avatar, Button, List, withTheme, Provider as PaperProvider } from 'react-native-paper';

import AdvicesView from '../AdvicesView';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 16,
  },
  listView: {
    marginTop: 8,
    marginBottom: 16,
    marginHorizontal: 8,
  },
  actions: {
    margin: 16,
    ...Platform.select({ web: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    } }),
  },
  cta: Platform.select({ web: { maxWidth: 200 } }),
  adviceCard: {
    maxWidth: 500,
    maxHeight: 360,
    borderRadius: 30,
    backgroundColor: '#43494A',
  },
  adviceContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/**
 * @param navigation
 * @param nbOfInsidePics
 * @param nbOfOutsidePics
 * @param onStart
 * @param theme
 * @returns {JSX.Element}
 * @constructor
 */
function TutorialView({ nbOfInsidePics, nbOfOutsidePics, onStart, theme }) {
  const { colors } = theme;

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.root}>
        <ScrollView>
          <View style={styles.listView}>
            <List.Item
              title="outside pictures"
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
              title="inside pictures"
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
          <View style={styles.adviceContainer}>
            <View style={styles.adviceCard}>
              <AdvicesView hideCloseButton onStart={onStart} canStart />
            </View>
          </View>
          <View style={styles.actions}>
            <Button onPress={onStart} mode="ourlined" style={styles.cta}>
              New Inspection
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
}

TutorialView.propTypes = {
  nbOfInsidePics: PropTypes.number,
  nbOfOutsidePics: PropTypes.number,
  onStart: PropTypes.func,
};

TutorialView.defaultProps = {
  onStart: noop,
  nbOfInsidePics: 4,
  nbOfOutsidePics: 12,
};

export default withTheme(TutorialView);
