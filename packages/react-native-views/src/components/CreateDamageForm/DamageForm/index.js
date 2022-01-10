import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { DataTable, Button, List, withTheme } from 'react-native-paper';
import { noop, startCase } from 'lodash';

import { utils } from '@monkvision/react-native';
import Drawer from '../../Drawer';

import DamagePicturesPreview from '../DamagePicturesPreview';
import DamageRow from '../DamageRow';

const { spacing } = utils.styles;
const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 16,
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  alignLeft: { justifyContent: 'flex-end' },
  buttonLabel: { color: '#FFFFFF' },
  validationButton: {
    margin: spacing(1),
    flex: 1,
    width: 120 },
  clearButton: { alignSelf: 'flex-end' },
  formWarningText: {
    marginTop: spacing(2),
    textAlign: 'center',
    color: 'gray',
  },
});

function DamageForm({
  theme,
  isOpen,
  onClose,
  currentDamage,
  isDamageValid,
  onSubmit,
  onReset,
  handleClearDamagePictures,
  damagePictures,
  handleOpenPreviewDialog,
  setSelectField,
  openCameraView,
  data,
  onChange,
  selectedValue,
  isLoading,
}) {
  const { colors } = theme;

  const wrapTitles = useMemo(() => {
    if (currentDamage.damage_type) { return startCase(currentDamage.damage_type); }
    return 'a damage';
  }, [currentDamage.damage_type]);

  const wrapSubtitles = useMemo(() => {
    if (currentDamage.part_type) { return `On the ${startCase(currentDamage.part_type)} part`; }
    return 'On a part';
  }, [currentDamage.part_type]);

  // check if the form is filled with data and not yet submitted (dirty)
  const isDirty = useMemo(() => Object.values(currentDamage).some(Boolean),
    [currentDamage]);

  return (

    <Drawer
      isOpen={isOpen}
      handleClose={() => !isDirty && onClose()}
      onClose={handleClearDamagePictures}
    >
      <ScrollView style={{ height: '100%' }}>
        <Drawer.Title
          title={`Add photos for ${wrapTitles}`}
          subtitle={wrapSubtitles}
          titleStyle={styles.cardTitle}
          left={(props) => <List.Icon {...props} icon="shape-square-plus" />}
        />
        <DamagePicturesPreview
          damagePictures={damagePictures}
          handleOpenPreviewDialog={handleOpenPreviewDialog}
        />
        <Drawer.Content>
          <Button
            accessibilityLabel="Reset form data"
            mode="outlined"
            icon="eraser-variant"
            color={colors.primary}
            style={styles.clearButton}
            onPress={() => { onReset(); handleClearDamagePictures(); }}
          >
            Reset
          </Button>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Add damage Metadata</DataTable.Title>
              <DataTable.Title style={styles.alignLeft}>Value</DataTable.Title>
            </DataTable.Header>
            <DamageRow
              title="Part type"
              value={currentDamage.part_type}
              key="metadata-partType"
              onPress={() => setSelectField('part_type')}
              data={data}
              onChange={onChange}
              selectedValue={selectedValue}
            />
            <DamageRow
              title="Damage type"
              value={currentDamage.damage_type}
              key="metadata-damageType"
              onPress={() => setSelectField('damage_type')}
              data={data}
              onChange={onChange}
              selectedValue={selectedValue}
            />
            <DamageRow
              title="Severity"
              value={currentDamage.severity}
              key="metadata-severity"
              onPress={() => setSelectField('severity')}
              disabled
            />
          </DataTable>
          {isDirty ? (
            <Text style={styles.formWarningText}>
              In order to close the form please hit submit or clear your data.
            </Text>
          ) : null}
        </Drawer.Content>
        <Drawer.Actions style={styles.cardActions}>
          <Button
            accessibilityLabel="Add damage"
            labelStyle={styles.buttonLabel}
            onPress={onSubmit}
            mode="contained"
            style={styles.validationButton}
            icon="shape-square-plus"
            disabled={!isDamageValid || isLoading}
            loading={isLoading}
          >
            Add damage
          </Button>
          <Button
            accessibilityLabel="Add pictures"
            onPress={openCameraView}
            mode="outlined"
            color={colors.primary}
            style={[styles.validationButton, { borderColor: colors.primary }]}
            icon="camera-plus"
          >
            Add pictures
          </Button>
        </Drawer.Actions>
      </ScrollView>
    </Drawer>

  );
}

DamageForm.propTypes = {
  currentDamage: PropTypes.shape({
    damage_type: PropTypes.string,
    part_type: PropTypes.string,
    severity: PropTypes.string,
  }),
  // eslint-disable-next-line react/forbid-prop-types
  damagePictures: PropTypes.any,
  data: PropTypes.arrayOf(PropTypes.any),
  handleClearDamagePictures: PropTypes.func,
  handleOpenPreviewDialog: PropTypes.func,
  isDamageValid: PropTypes.bool,
  isLoading: PropTypes.bool,
  isOpen: PropTypes.bool,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  onReset: PropTypes.func,
  onSubmit: PropTypes.func,
  openCameraView: PropTypes.func,
  selectedValue: PropTypes.string,
  setSelectField: PropTypes.func,
};

DamageForm.defaultProps = {
  currentDamage: {
    part_type: null,
    damage_type: null,
    severity: null,
  },
  onClose: noop,
  isOpen: false,
  isDamageValid: false,
  onSubmit: noop,
  onChange: noop,
  onReset: noop,
  handleClearDamagePictures: noop,
  handleOpenPreviewDialog: noop,
  setSelectField: noop,
  openCameraView: noop,
  damagePictures: [],
  data: [],
  selectedValue: null,
  isLoading: false,
};
export default withTheme(DamageForm);
