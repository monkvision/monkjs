import React, { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FAB, useTheme } from 'react-native-paper';

import { INSPECTION_VIN, INSPECTION_IMPORT } from 'screens/names';

export default function InspectionButton() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);

  const handleTakePictures = useCallback(
    () => navigation.navigate(INSPECTION_VIN),
    [navigation],
  );

  const handleImportPictures = useCallback(
    () => navigation.navigate(INSPECTION_IMPORT),
    [navigation],
  );

  return (
    <FAB.Group
      accessibilityLabel="New inspection"
      color="white"
      fabStyle={{ backgroundColor: colors.primary }}
      open={open}
      icon={open ? 'camera-image' : 'plus'}
      actions={[
        {
          icon: 'image',
          label: 'Import pictures',
          onPress: handleImportPictures,
        },
        {
          icon: 'camera',
          label: 'Take pictures',
          onPress: handleTakePictures,
        },
      ]}
      onStateChange={(state) => setOpen(state.open)}
    />
  );
}
