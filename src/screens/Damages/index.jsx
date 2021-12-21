import React, { useLayoutEffect, useMemo, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import camelCase from 'lodash.camelcase';
import { denormalize } from 'normalizr';
import { useMediaQuery } from 'react-responsive';
import startCase from 'lodash.startcase';

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
  taskNames,
} from '@monkvision/corejs';

import { useNavigation, useRoute } from '@react-navigation/native';
import useRequest from 'hooks/useRequest';
import usePartDamages from 'hooks/usePartDamages';

import { Vehicle, vehiclePartsNames } from '@monkvision/react-native';
import { ActivityIndicatorView, useFakeActivity } from '@monkvision/react-native-views';

import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { BottomNavigation, Button, List, useTheme } from 'react-native-paper';
import { DAMAGE_CREATE, DAMAGE_READ } from 'screens/names';

import { spacing } from 'config/theme';
import vehicleViews from 'assets/vehicle.json';

import Drawing from 'components/Drawing/index';
import ActionMenu from 'components/ActionMenu';
import submitDrawing from 'assets/submit.svg';
import CustomDialog from 'components/CustomDialog';
import DamageListItem from './DamageListItem';

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

function ValidateDialog({ isDialogOpen, handleDismissDialog }) {
  const route = useRoute();
  const { inspectionId } = route.params;
  // we need error handling here
  const { isLoading, request } = useRequest(
    updateOneTaskOfInspection({
      inspectionId,
      taskName: taskNames.DAMAGE_DETECTION,
      data: { status: taskStatuses.VALIDATED },
    }),
    { onSuccess: handleDismissDialog },
    false,
  );

  return (
    <CustomDialog
      isOpen={Boolean(isDialogOpen)}
      handDismiss={handleDismissDialog}
      title="Are you sure?"
      content="Please confirm your damage validation"
      icon={(
        <View style={styles.dialogDrawing}>
          <Drawing xml={submitDrawing} width="200" height="120" />
        </View>
      )}
      actions={(
        <>
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
        </>
        )}
    />
  );
}

ValidateDialog.propTypes = {
  handleDismissDialog: PropTypes.func.isRequired,
  isDialogOpen: PropTypes.bool.isRequired,
};

function DeleteDamageDialog({ isDialogOpen, handleDismissDialog, handleDelete, isLoading }) {
  const { colors } = useTheme();

  return (
    <CustomDialog
      isOpen={isDialogOpen}
      handDismiss={handleDismissDialog}
      icon={<Button icon="alert" size={36} color={colors.warning} />}
      title="Confirm damage deletion"
      content="Are you sure that you really really want to DELETE this damage ?"
      actions={(
        <>
          <Button onPress={handleDismissDialog} style={styles.button} mode="outlined">
            Cancel
          </Button>
          <Button
            color={colors.error}
            style={styles.button}
            onPress={handleDelete}
            mode="contained"
            icon={isLoading ? undefined : 'trash-can'}
            labelStyle={{ color: 'white' }}
            loading={isLoading}
            disabled={isLoading}
          >
            Delete
          </Button>
        </>
        )}
    />
  );
}

DeleteDamageDialog.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  handleDismissDialog: PropTypes.func.isRequired,
  isDialogOpen: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export function PartListSection({ partType, damages, isValidated }) {
  const navigation = useNavigation();
  const [deleteDamage, setDeleteDamage] = useState({});

  const handleDismissDialog = useCallback(() => {
    setDeleteDamage({});
  }, []);

  // we need error handling here
  const { isLoading: isDeleteLoading, request: handleDelete } = useRequest(
    deleteOneDamage({ id: deleteDamage.id, inspectionId: deleteDamage.inspectionId }),
    { onSuccess: handleDismissDialog },
    false,
  );

  const handleSelectDamage = useCallback((damage) => {
    navigation.navigate(DAMAGE_READ, {
      id: damage.id,
      inspectionId: damage.inspectionId,
      partType,
    });
  }, [navigation, partType]);

  const handleDeleteDamage = useCallback(() => {
    handleDelete();
  }, [handleDelete]);

  return damages && (
    <>
      <List.Section>
        <List.Subheader>{startCase(partType)}</List.Subheader>
        {damages.map((damage) => (
          <DamageListItem isValidated={isValidated} key={`damage-${damage.id}`} onSelect={() => handleSelectDamage(damage)} onDelete={() => setDeleteDamage(damage)} {...damage} />
        ))}
      </List.Section>
      <DeleteDamageDialog
        isDialogOpen={deleteDamage.id}
        handleDismissDialog={handleDismissDialog}
        isLoading={isDeleteLoading}
        handleDelete={handleDeleteDamage}
      />
    </>
  );
}

PartListSection.propTypes = {
  damages: PropTypes.arrayOf(PropTypes.object).isRequired,
  isValidated: PropTypes.bool.isRequired,
  partType: PropTypes.string.isRequired,
};

export function ValidationButton({ onPress, isValidated }) {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-device-width: 1224px)',
  });
  return (
    <Button
      color="#5CCC68"
      labelStyle={styles.buttonLabel}
      onPress={onPress}
      mode="contained"
      style={[styles.validationButton, isDesktopOrLaptop ? { maxWidth: 180, alignSelf: 'flex-end' } : {}]}
      icon="send"
      disabled={isValidated}
    >
      Validate
    </Button>
  );
}

ValidationButton.propTypes = {
  isValidated: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
};

export function PartsList({ partsWithDamages, handleOpenDialog, isValidated }) {
  if (!partsWithDamages) { return null; }

  return (
    <ScrollView>
      {partsWithDamages.map((part) => (
        <PartListSection isValidated={isValidated} key={`part-${part.id}`} {...part} />
      ))}
      <ValidationButton onPress={handleOpenDialog} isValidated={isValidated} />
    </ScrollView>
  );
}

PartsList.propTypes = {
  handleOpenDialog: PropTypes.func.isRequired,
  isValidated: PropTypes.bool.isRequired,
  partsWithDamages: PropTypes.arrayOf(PropTypes.object),
};

PartsList.defaultProps = {
  partsWithDamages: [],
};

function Scene({ partsWithDamages, viewType, handleOpenDialog, isValidated }) {
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
        disabled={isValidated}
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
  isValidated: PropTypes.bool.isRequired,
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
    <BottomNavigation
      barStyle={{ backgroundColor: '#fff' }}
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
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
  const { loading: damagesLoading } = useSelector((state) => state.damages);

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

  const isValidated = useMemo(
    () => inspection.tasks.find(
      (t) => t.name === taskNames.DAMAGE_DETECTION,
    ).status === taskStatuses.VALIDATED,
    [inspection.tasks],
  );

  const [fakeActivity] = useFakeActivity(isLoading || damagesLoading);

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
    { title: 'Add damage', onPress: handleAddDamage, disabled: isValidated },
    { title: 'Validate', titleStyle: { color: colors.success }, onPress: handleOpenDialog, disabled: isValidated, divider: true },
  ], [colors.success, fakeActivity, handleAddDamage, handleOpenDialog, isValidated, refresh]);

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
          <ValidateDialog isDialogOpen={isDialogOpen} handleDismissDialog={handleDismissDialog} />
          <Navigation
            partsWithDamages={partsWithDamages}
            computedParts={computedParts()}
            damagedPartsCount={partsWithDamages.length}
            handleOpenDialog={handleOpenDialog}
            isValidated={isValidated}
          />
        </>
      )}
    </SafeAreaView>
  );
};
