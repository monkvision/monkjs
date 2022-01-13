import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { denormalize } from 'normalizr';

import { useRoute, useNavigation } from '@react-navigation/native';

import { DamagesView, useFakeActivity, CreateDamageForm } from '@monkvision/react-native-views';
import { DAMAGE_READ } from 'screens/names';
import {
  damagesEntity,
  selectDamageEntities,
  selectInspectionEntities,
  selectImageEntities,
  selectPartEntities,
  selectTaskEntities,
  imagesEntity,
  inspectionsEntity,
  tasksEntity,
  getOneInspectionById,
  taskNames,
  taskStatuses,
} from '@monkvision/corejs';

import useRequest from 'hooks/useRequest/index';
import ActionMenu from 'components/ActionMenu';
import useToggle from 'hooks/useToggle/index';
import { useTheme } from 'react-native-paper';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import useDamages from './useDamages';

const styles = StyleSheet.create({
  root: {
    // display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
    position: 'relative',
  },
  damages: {
    zIndex: -1,
    width: '100%',
    height: '100%',
    ...Platform.select({
      android: {
        position: 'absolute',
      },
    }),
  },
});

const currentDamageInitialState = {
  part_type: null,
  damage_type: null,
  // severity: null,
};

export default () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const route = useRoute();
  const { inspectionId } = route.params;

  const inspectionEntities = useSelector(selectInspectionEntities);
  const imagesEntities = useSelector(selectImageEntities);
  const damagesEntities = useSelector(selectDamageEntities);
  const partsEntities = useSelector(selectPartEntities);
  const tasksEntities = useSelector(selectTaskEntities);

  const { isLoading, refresh } = useRequest(getOneInspectionById({ id: inspectionId }));
  const { loading: damagesLoading } = useSelector((state) => state.damages);
  const [fakeActivity] = useFakeActivity(isLoading || damagesLoading);

  const [bottomsheetIsOpen, handleOpenBottomSheet, handleCloseBottomSheet] = useToggle();

  const [currentDamage, setCurrentDamage] = useState(currentDamageInitialState);

  const partRef = useRef({ selectedId: currentDamage.part_type });
  React.useEffect(() => {
    partRef.current.selectedId = currentDamage.part_type;
  }, [currentDamage]);

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

  const { damageIsLoading, createDamageRequest, isDamageValid, damagePicturesState } = useDamages({
    currentDamage,
    inspectionId,
    handleCloseBottomSheet,
    refresh,
    reset: () => setCurrentDamage(currentDamageInitialState),
  });

  const isValidated = useMemo(
    () => inspection.tasks.find(
      (t) => t.name === taskNames.DAMAGE_DETECTION,
    ).status === taskStatuses.VALIDATED,
    [inspection.tasks],
  );

  const handleSelectDamage = useCallback((payload) => navigation.navigate(DAMAGE_READ, payload),
    [navigation]);

  const handleSelectPart = useCallback((partType) => {
    setCurrentDamage((prev) => ({ ...prev, part_type: partType }));
    handleOpenBottomSheet();
  },
  [handleOpenBottomSheet]);

  const handleAddNewDamage = useCallback(() => {
    setCurrentDamage(currentDamageInitialState);
    handleOpenBottomSheet();
  },
  [setCurrentDamage, handleOpenBottomSheet]);

  const onChangeCurrentDamage = useCallback((newDamageMetaData) => {
    setCurrentDamage((prev) => ({ ...prev, ...newDamageMetaData }));
  }, []);

  const handleHideNavigationBar = useCallback(() => navigation.setOptions({
    headerShown: false,
  }), [navigation]);

  const handleShowNavigationBar = useCallback(() => navigation.setOptions({
    headerShown: true,
  }), [navigation]);

  const { isLoading: isValidating, request: handleValidate } = useRequest(null,
    { onSuccess: refresh }, false);

  const { isLoading: isDeleting, request: handleDelete } = useRequest(null,
    { onSuccess: refresh }, false);

  const damagesViewRef = useRef(null);
  const menuItems = useMemo(() => [
    { title: 'Refresh', loading: Boolean(fakeActivity), onPress: refresh, icon: 'refresh' },
    { title: 'Add damage', onPress: handleAddNewDamage, icon: 'camera-plus', disabled: isValidated || bottomsheetIsOpen },
    { title: 'Validate',
      onPress: () => damagesViewRef.current?.validate(),
      icon: 'send',
      disabled: isValidated,
      divider: true },

  ], [fakeActivity, refresh, handleAddNewDamage, isValidated, bottomsheetIsOpen]);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: `Inspection #${inspectionId.split('-')[0]}`,
        headerBackVisible: true,
        headerRight: () => (
          <ActionMenu menuItems={menuItems} />
        ),
      });
    }
  }, [inspectionId, menuItems, navigation]);

  return (
    <SafeAreaView style={styles.root}>
      <CreateDamageForm
        theme={theme}
        isOpen={bottomsheetIsOpen}
        onClose={() => { handleCloseBottomSheet(); setCurrentDamage(currentDamageInitialState); }}
        onSubmit={createDamageRequest}
        onCameraOpen={handleHideNavigationBar}
        onCameraClose={handleShowNavigationBar}
        onReset={() => setCurrentDamage(currentDamageInitialState)}
        isLoading={damageIsLoading}
        currentDamage={currentDamage}
        onChangeCurrentDamage={onChangeCurrentDamage}
        damagePicturesState={damagePicturesState}
        isDamageValid={isDamageValid}
      />
      <View style={styles.damages}>
        <DamagesView
          theme={theme}
          ref={damagesViewRef}
          inspection={inspection}
          onDeleteDamage={handleDelete}
          onSelectDamage={handleSelectDamage}
          onValidate={handleValidate}
          isLoading={fakeActivity}
          isDeleting={isDeleting}
          isValidating={isValidating}
          onPressPart={handleSelectPart}
          isVehiclePressAble
          selectedId={partRef.current.selectedId}
        />
      </View>
    </SafeAreaView>
  );
};
