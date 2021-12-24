import useRequest from 'hooks/useRequest';
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { useFakeActivity } from '@monkvision/react-native-views';

import { getOneInspectionById, taskStatuses, taskNames } from '@monkvision/corejs';

import ActionMenu from 'components/ActionMenu';
import { useSelector } from 'react-redux';
import { DAMAGE_CREATE } from 'screens/names';

export default function useLayout({ inspection, inspectionId }) {
  const navigation = useNavigation();

  const isValidated = useMemo(
    () => inspection.tasks.find(
      (t) => t.name === taskNames.DAMAGE_DETECTION,
    ).status === taskStatuses.VALIDATED,
    [inspection.tasks],
  );

  const { isLoading, refresh } = useRequest(getOneInspectionById({ id: inspectionId }));
  const { loading: damagesLoading } = useSelector((state) => state.damages);

  const [fakeActivity] = useFakeActivity(isLoading || damagesLoading);

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
    { title: 'Refresh', loading: Boolean(fakeActivity), onPress: refresh, icon: 'refresh' },
    { title: 'Add a damage', onPress: handleAddDamage, disabled: isValidated, icon: 'camera-plus' },
    { title: 'Validate', onPress: handleOpenDialog, disabled: isValidated, divider: true, icon: 'send' },
  ], [fakeActivity, handleAddDamage, handleOpenDialog, isValidated, refresh]);

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

  return {
    fakeActivity,
    isDialogOpen,
    handleOpenDialog,
    handleDismissDialog,
    isValidated,
  };
}
