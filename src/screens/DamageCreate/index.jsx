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
  useTheme,
  List,
  Button,
} from 'react-native-paper';

const styles = StyleSheet.create({
  root: {
    paddingVertical: spacing(1),
  },
  card: {
    marginHorizontal: spacing(2),
    marginVertical: spacing(1),
  },
  cardActions: {
    justifyContent: 'center',
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

  const { inspection } = denormalize({ inspection: inspectionId, damage: damageId }, {
    inspection: inspectionsEntity,
    images: [imagesEntity],
    damages: [damagesEntity],
  }, {
    inspections: inspectionEntities,
    images: imagesEntities,
    damages: damagesEntities,
    parts: partsEntities,
  });

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: `Create new damage`,
        headerBackVisible: true,
      });
    }
  }, [navigation, refresh, damageId]);

  if (isLoading) {
    return <ActivityIndicatorView light />;
  }

  return !isEmpty(inspection) && (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.root}>
        <Card style={styles.card}>

          <List.Item
            title="Select part type"
            onClick={() => {}}
            left={(props) => <List.Icon {...props} icon="select" />}
          />
          <List.Item
            title="Select severity"
            onClick={() => {}}
            left={(props) => <List.Icon {...props} icon="select" />}
          />
          <List.Item
            title="Add photos"
            onClick={() => {}}
            left={(props) => <List.Icon {...props} icon="camera" />}
          />
          <ScrollView contentContainerStyle={styles.images} horizontal>
            {!isEmpty(inspection.images) && (
            <Image
              key={inspection.images[0].name}
              style={styles.image}
            />
            )}

          </ScrollView>
          <Card.Actions style={styles.cardActions}>
            <Button
              icon="send"
              color={theme.colors.primary}
              onPress={() => {}}
            >
              Create
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};
