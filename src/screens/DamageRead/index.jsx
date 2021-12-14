import React, { useCallback, useLayoutEffect, useState, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { denormalize } from 'normalizr';
import isEmpty from 'lodash.isempty';

import { ActivityIndicatorView, useFakeActivity } from '@monkvision/react-native-views';
import useRequest from 'hooks/useRequest';

import { spacing } from 'config/theme';

import {
  damagesEntity,
  deleteOneDamage,
  getOneInspectionById,
  selectDamageEntities,
  selectInspectionEntities,
  selectImageEntities,
  selectPartEntities,
  imagesEntity,
  inspectionsEntity,
} from '@monkvision/corejs';

import { Image, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import {
  Card,
  Button,
  Dialog,
  Paragraph,
  Portal,
  useTheme,
  List,
} from 'react-native-paper';

import ActionMenu from 'components/ActionMenu';

const styles = StyleSheet.create({
  root: {
    paddingVertical: spacing(1),
  },
  card: {
    marginHorizontal: spacing(2),
    marginVertical: spacing(1),
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  images: {
    display: 'flex',
    flexBasis: 'auto',
    flexDirection: 'row',
    flexShrink: 0,
    flexWrap: 'nowrap',
    marginBottom: spacing(2),
    marginHorizontal: spacing(1),
  },
  image: {
    flex: 1,
    width: 500,
    height: 300,
    marginHorizontal: spacing(1),
  },
  dialog: {
    maxWidth: 450,
    alignSelf: 'center',
    padding: 12,
  },
  dialogDrawing: { display: 'flex', alignItems: 'center' },
  dialogContent: { textAlign: 'center' },
  dialogActions: { flexWrap: 'wrap' },
  button: { width: '100%', marginVertical: 4 },
  actionButton: { marginLeft: spacing(1) },
});

export default () => {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { colors } = useTheme();

  const { inspectionId, id: damageId } = route.params;

  const { isLoading, refresh } = useRequest(getOneInspectionById({ id: inspectionId }));

  const inspectionEntities = useSelector(selectInspectionEntities);
  const imagesEntities = useSelector(selectImageEntities);
  const damagesEntities = useSelector(selectDamageEntities);
  const partsEntities = useSelector(selectPartEntities);

  const { inspection, damage } = denormalize({ inspection: inspectionId, damage: damageId }, {
    inspection: inspectionsEntity,
    images: [imagesEntity],
    damages: [damagesEntity],
  }, {
    inspections: inspectionEntities,
    images: imagesEntities,
    damages: damagesEntities,
    parts: partsEntities,
  });

  console.log('voici ton damage', damage);

  const [fakeActivity] = useFakeActivity(isLoading);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { request: handleDelete } = useRequest(
    deleteOneDamage({ id: damageId, inspectionId }),
    { onSuccess: () => {
      setDialogOpen(false);
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } },
    false,
  );

  const openDeletionDialog = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleDismissDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const menuItems = useMemo(() => [
    { title: 'Refresh', loading: Boolean(fakeActivity), onPress: refresh },
    { title: 'Delete', titleStyle: { color: colors.warning }, onPress: openDeletionDialog, divider: true },
  ], [colors.warning, fakeActivity, openDeletionDialog, refresh]);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: `Damage #${damageId.split('-')[0]}`,
        headerBackVisible: true,
        headerRight: () => (<ActionMenu menuItems={menuItems} />),
      });
    }
  }, [fakeActivity, navigation, refresh, openDeletionDialog, damageId, menuItems]);

  if (isLoading) {
    return <ActivityIndicatorView light />;
  }

  return !isEmpty(inspection) && (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.root}>
        <Card style={styles.card}>
          <List.Item
            title="PartType"
            onClick={() => {}}
            left={(props) => <List.Icon {...props} icon="folder" />}
          />
          <ScrollView contentContainerStyle={styles.images} horizontal>
            {!isEmpty(inspection.images) && (
            <Image
              key={inspection.images[0].name}
              style={styles.image}
              source={{ uri: inspection.images[0].path }}
            />
            )}

          </ScrollView>
        </Card>
      </ScrollView>
      <Portal>
        <Dialog
          visible={Boolean(isDialogOpen)}
          onDismiss={handleDismissDialog}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogContent}>
            Are you sure?
          </Dialog.Title>

          <Dialog.Content>
            <Paragraph style={styles.dialogContent}>
              would you like to continue ?
            </Paragraph>
          </Dialog.Content>

          <Dialog.Actions style={styles.dialogActions}>
            <Button onPress={handleDismissDialog} style={styles.button} mode="outlined">
              Cancel
            </Button>
            <Button
              color={theme.colors.error}
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
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};
