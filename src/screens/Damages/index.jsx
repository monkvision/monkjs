import React, { useLayoutEffect, useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import camelCase from 'lodash.camelcase';
import { denormalize } from 'normalizr';

import {
  damagesEntity,
  getOneInspectionById,
  deleteOneDamage,
  selectDamageEntities,
  selectInspectionEntities,
  selectImageEntities,
  selectPartEntities,
  selectTaskEntities,
  taskStatuses,
  imagesEntity,
  inspectionsEntity,
  tasksEntity,
  updateOneTaskOfInspection,
} from '@monkvision/corejs';

import { useNavigation, useRoute } from '@react-navigation/native';
import useRequest from 'hooks/useRequest';
import usePartDamages from 'hooks/usePartDamages';

import { Vehicle, vehiclePartsNames } from '@monkvision/react-native';
import { ActivityIndicatorView, useFakeActivity } from '@monkvision/react-native-views';

import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { BottomNavigation, Button, List, Dialog, Paragraph, Portal, useTheme } from 'react-native-paper';
import { DAMAGE_CREATE, DAMAGE_READ } from 'screens/names';

import { spacing } from 'config/theme';
import vehicleViews from 'assets/vehicle.json';
import Drawing from 'components/Drawing/index';
import ActionMenu from 'components/ActionMenu';
import DamageListItem from './DamageListItem';
import submitDrawing from './assets/submit.svg';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
  },
  scene: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
    padding: spacing(2),
  },
  avatar: {
    marginHorizontal: spacing(2),
  },
  floatingButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  validationButton: { margin: spacing(2) },
  buttonLabel: { color: '#FFFFFF' },
  dialog: { maxWidth: 450, alignSelf: 'center', padding: 12 },
  dialogDrawing: { display: 'flex', alignItems: 'center' },
  dialogContent: { textAlign: 'center' },
  dialogActions: { flexWrap: 'wrap' },
  button: { width: '100%', marginVertical: 4 },
});

function DialogModal({ isDialogOpen, handleDismissDialog }) {
  const route = useRoute();
  const { inspectionId } = route.params;
  // we need error handling here
  const { isLoading, request } = useRequest(
    updateOneTaskOfInspection({
      inspectionId,
      taskName: 'damage_detection',
      data: { status: taskStatuses.VALIDATED },
    }),
    { onSuccess: handleDismissDialog },
    false,
  );
  return (
    <Portal>
      <Dialog
        visible={Boolean(isDialogOpen)}
        onDismiss={handleDismissDialog}
        style={styles.dialog}
      >
        <View style={styles.dialogDrawing}>
          <Drawing xml={submitDrawing} width="200" height="120" />
        </View>
        <Dialog.Title style={styles.dialogContent}>
          Are you sure?
        </Dialog.Title>

        <Dialog.Content>
          <Paragraph style={styles.dialogContent}>
            Please confirm your damage validation
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions style={styles.dialogActions}>
          <Button onPress={handleDismissDialog} style={styles.button} mode="outlined">
            Cancel
          </Button>
          <Button
            style={styles.button}
            onPress={request}
            mode="contained"
            disabled={isLoading}
            labelStyle={{ color: 'white' }}
          >
            Confirm
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

DialogModal.propTypes = {
  handleDismissDialog: PropTypes.func.isRequired,
  isDialogOpen: PropTypes.bool.isRequired,
};

export function PartListSection({ partType, damages }) {
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const handleSelectDamage = useCallback((damage) => {
    navigation.navigate(DAMAGE_READ, {
      id: damage.id,
      inspectionId: damage.inspectionId,
      partType,
    });
  }, [navigation, partType]);

  const handleDeleteDamage = useCallback((damage) => {
    dispatch(deleteOneDamage({ id: damage.id, inspectionId: damage.inspectionId }));
  }, [dispatch]);

  return damages && (
    <List.Section>
      <List.Subheader>{partType}</List.Subheader>
      {damages.map((damage) => (
        <DamageListItem key={`damage-${damage.id}`} onSelect={() => handleSelectDamage(damage)} onDelete={() => handleDeleteDamage(damage)} {...damage} />
      ))}
    </List.Section>
  );
}

PartListSection.propTypes = {
  damages: PropTypes.arrayOf(PropTypes.object).isRequired,
  partType: PropTypes.string.isRequired,
};

export function PartsList({ partsWithDamages, handleOpenDialog }) {
  if (!partsWithDamages) { return null; }

  return (
    <ScrollView>
      {partsWithDamages.map((part) => (
        <PartListSection key={`part-${part.id}`} {...part} />
      ))}
      <Button
        color="#5CCC68"
        labelStyle={styles.buttonLabel}
        onPress={handleOpenDialog}
        mode="contained"
        style={styles.validationButton}
        icon="send"
      >
        Validate
      </Button>
    </ScrollView>
  );
}

PartsList.propTypes = {
  handleOpenDialog: PropTypes.func.isRequired,
  partsWithDamages: PropTypes.arrayOf(PropTypes.object),
};

PartsList.defaultProps = {
  partsWithDamages: [],
};

function Scene({ partsWithDamages, viewType, handleOpenDialog }) {
  const activeParts = useMemo(
    () => {
      const object = {};
      partsWithDamages.forEach((part) => { object[camelCase(part.partType)] = true; });

      return object;
    },
    [partsWithDamages],
  );

  return (
    <ScrollView contentContainerStyle={styles.scene}>
      <Button
        style={[styles.validationButton, styles.floatingButton]}
        color="#5CCC68"
        labelStyle={styles.buttonLabel}
        mode="contained"
        onPress={handleOpenDialog}
        icon="send"
      >
        Validate
      </Button>
      <Vehicle
        xml={vehicleViews[viewType]}
        activeParts={activeParts}
        pressAble={false}
        width="100%"
        height="100%"
      />
    </ScrollView>
  );
}

Scene.propTypes = {
  handleOpenDialog: PropTypes.func.isRequired,
  partsWithDamages: PropTypes.arrayOf(PropTypes.object),
  viewType: PropTypes.oneOf(['front', 'back', 'interior']).isRequired,
};

Scene.defaultProps = {
  partsWithDamages: [],
};

function Navigation({ damagedPartsCount, computedParts, handleOpenDialog, ...props }) {
  const [index, setIndex] = useState(0);
  const disabled = damagedPartsCount === 0;
  const badge = (nb) => nb > 0 && nb;

  const [routes] = useState([
    { key: 'front', title: 'Front', icon: 'car', badge: badge(computedParts.front) },
    { key: 'back', title: 'Back', icon: 'car-back', badge: badge(computedParts.back) },
    { key: 'interior', title: 'Interior', icon: 'car-seat', badge: badge(computedParts.interior) },
    { key: 'list', title: 'List of all', icon: 'format-list-text', badge: badge(damagedPartsCount), disabled },
  ]);
  const renderScene = BottomNavigation.SceneMap({
    front: () => <Scene viewType="front" handleOpenDialog={handleOpenDialog} {...props} />,
    back: () => <Scene viewType="back" handleOpenDialog={handleOpenDialog} {...props} />,
    interior: () => <Scene viewType="interior" handleOpenDialog={handleOpenDialog} {...props} />,
    list: () => <PartsList handleOpenDialog={handleOpenDialog} {...props} />,
  });

  return (
    <>
      <BottomNavigation
        barStyle={{ backgroundColor: '#fff' }}
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </>
  );
}

Navigation.propTypes = {
  computedParts: PropTypes.shape({
    back: PropTypes.number,
    front: PropTypes.number,
    interior: PropTypes.number,
  }).isRequired,
  damagedPartsCount: PropTypes.number,
  handleOpenDialog: PropTypes.func.isRequired,
};

Navigation.defaultProps = {
  damagedPartsCount: 0,
};

export default () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { colors } = useTheme();

  const { inspectionId } = route.params;

  const { isLoading, refresh } = useRequest(getOneInspectionById({ id: inspectionId }));

  const inspectionEntities = useSelector(selectInspectionEntities);
  const imagesEntities = useSelector(selectImageEntities);
  const damagesEntities = useSelector(selectDamageEntities);
  const partsEntities = useSelector(selectPartEntities);
  const tasksEntities = useSelector(selectTaskEntities);

  const { inspection } = denormalize({ inspection: inspectionId }, {
    inspection: inspectionsEntity,
    images: [imagesEntity],
    damages: [damagesEntity],
    tasks: [tasksEntity],
  }, {
    inspections: inspectionEntities,
    images: imagesEntities,
    damages: damagesEntities,
    parts: partsEntities,
    tasks: tasksEntities,
  });

  const [fakeActivity] = useFakeActivity(isLoading);

  const partsWithDamages = inspection.damages
    ? usePartDamages(inspection.parts, inspection.damages)
    : [];

  const [isDialogOpen, setDialogOpen] = useState(false);
  const handleDismissDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);
  const handleOpenDialog = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleAddDamage = useCallback(() => {
    navigation.navigate(DAMAGE_CREATE, {
      inspectionId,
    });
  }, [inspectionId, navigation]);

  const menuItems = useMemo(() => [
    { title: 'Refresh', loading: Boolean(fakeActivity), onPress: refresh },
    { title: 'Add damage', onPress: handleAddDamage },
    { title: 'Validate', titleStyle: { color: colors.success }, onPress: handleOpenDialog, divider: true },
  ], [colors.success, fakeActivity, handleAddDamage, handleOpenDialog, refresh]);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: !inspection.damages
          ? 'Vehicle has no damage'
          : `Vehicle has ${inspection?.damages.length} damage${inspection.damages.length > 1 ? 's' : ''}`,
        headerRight: () => (<ActionMenu menuItems={menuItems} />),
      });
    }
  }, [
    fakeActivity, handleAddDamage, handleOpenDialog,
    inspection, inspectionId, menuItems, navigation, refresh,
  ]);

  if (partsWithDamages.length === 0) {
    return null;
  }
  const activeParts = partsWithDamages.map((part) => camelCase(part.partType));

  const computedParts = useCallback(() => {
    const parts = {
      front: 0,
      back: 0,
      interior: 0,
    };
    activeParts.map((item) => {
      // front
      if (vehiclePartsNames.front.some((e) => e === item)) { parts.front += 1; }
      // back
      if (vehiclePartsNames.back.some((e) => e === item)) { parts.back += 1; }
      // interior
      if (vehiclePartsNames.interior.some((e) => e === item)) { parts.interior += 1; }
      return undefined;
    });
    return parts;
  }, [activeParts]);

  return (
    <SafeAreaView style={styles.root}>
      {fakeActivity ? <ActivityIndicatorView light /> : (
        <>
          <DialogModal isDialogOpen={isDialogOpen} handleDismissDialog={handleDismissDialog} />
          <Navigation
            partsWithDamages={partsWithDamages}
            computedParts={computedParts()}
            damagedPartsCount={partsWithDamages.length}
            handleOpenDialog={handleOpenDialog}
          />
        </>
      )}
    </SafeAreaView>
  );
};
