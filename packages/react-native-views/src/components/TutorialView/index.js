import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash.noop';

import { SafeAreaView, StyleSheet, View, Platform, Text, TouchableOpacity } from 'react-native';
import {
  Avatar,
  List,
  Modal,
  withTheme,
  Button,
  Dialog,
  Portal,
  Provider as PaperProvider } from 'react-native-paper';
import { SvgXml } from 'react-native-svg';
import { utils } from '@monkvision/react-native';
import drawing from './drawing';
import AdvicesView from '../AdvicesView';

const styles = StyleSheet.create({
  root: {
    ...Platform.select({
      native: { flex: 1 },
      default: { display: 'flex', flexGrow: 1, minHeight: 'calc(100vh - 64px)' },
    }),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  advices: {
    width: '100%',
    height: '100%',
    zIndex: 10,
    borderRadius: 40,
    overflow: 'hidden',
    maxWidth: 500,
    backgroundColor: '#000000c1',
    alignSelf: 'center',
    ...Platform.select({
      web: { maxHeight: 360 },
      native: { maxHeight: 360 },
    }),
  },
  listView: {
    marginTop: 8,
    marginBottom: 16,
    marginHorizontal: 8,
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    zIndex: 0,
  },
  cta: { width: 140, margin: utils.styles.spacing(1) },
  text: { textAlign: 'center', margin: utils.styles.spacing(2) },
  fab: { position: 'absolute', top: 10, right: 10 },
});

function PicturesExplanation({ nbOfOutsidePics, nbOfInsidePics, theme }) {
  const { colors } = theme;
  return (
    <View style={styles.listView}>
      <List.Item
        title="Outside pictures"
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
        title="Inside pictures"
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
  );
}
PicturesExplanation.propTypes = {
  nbOfInsidePics: PropTypes.number,
  nbOfOutsidePics: PropTypes.number,
};

PicturesExplanation.defaultProps = {
  nbOfInsidePics: 4,
  nbOfOutsidePics: 12,
};
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

  const [modalIsVisible, setModal] = useState(false);
  const onDismissAdvices = useCallback(() => setModal(false), []);
  const onOpenAdvices = useCallback(() => setModal(true), []);

  const [explanationIsVisile, setExplanationDialog] = useState(false);
  const onDismissExplanation = useCallback(() => setExplanationDialog(false), []);
  const onOpenExplanation = useCallback(() => setExplanationDialog(true), []);

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.root}>
        <View style={styles.root}>
          {Platform.OS === 'web'
            // eslint-disable-next-line react/no-danger
            ? <div dangerouslySetInnerHTML={{ __html: drawing }} />
            : <SvgXml xml={drawing} />}
          <Text style={styles.text}>
            <Text>
              {`Take ${nbOfOutsidePics} pictures outside the car and ${nbOfInsidePics} pictures from the interior.`}
            </Text>

            {/* toggle explanation dialog */}
            <TouchableOpacity onPress={onOpenExplanation} style={{ height: 16 }}>
              <Text style={{ color: colors.primary }}> See more.</Text>
            </TouchableOpacity>
          </Text>

          {/* cta */}
          <View style={styles.actions}>
            <Button onPress={onStart} mode="contained" style={styles.cta} icon="camera">
              Start
            </Button>
            <Button onPress={onOpenAdvices} mode="outlined" style={[styles.cta, { borderColor: colors.primary }]} icon="lightbulb">
              Guide
            </Button>
          </View>
        </View>

        {/* advices modal */}
        <Modal
          contentContainerStyle={styles.advices}
          style={{ display: 'flex', justifyContent: 'center' }}
          onDismiss={onDismissAdvices}
          visible={modalIsVisible}
        >
          <AdvicesView onDismiss={onDismissAdvices} canStart onStart={onStart} />
        </Modal>

        {/* pictures explanation dialog */}
        <Portal>
          <Dialog visible={explanationIsVisile} onDismiss={onDismissExplanation}>
            <Dialog.Content>
              <PicturesExplanation
                nbOfInsidePics={nbOfInsidePics}
                nbOfOutsidePics={nbOfOutsidePics}
                theme={theme}
              />
            </Dialog.Content>
          </Dialog>
        </Portal>
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
