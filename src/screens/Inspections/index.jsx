import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import moment from 'moment';
import isEmpty from 'lodash.isempty';
import { denormalize } from 'normalizr';

import {
  getAllInspections,
  selectInspectionIds,
  selectInspectionEntities,
  deleteOneInspection,
  selectImageEntities,
  inspectionsEntity,
  imagesEntity,
} from '@monkvision/corejs';

import { useFakeActivity } from '@monkvision/react-native-views';
import { useNavigation } from '@react-navigation/native';
import useRequest from 'hooks/useRequest';

import { Dimensions, Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import Placeholder from 'components/Placeholder';
import Pagination from 'components/Pagination';

import Drawing from 'components/Drawing';
import { Button, Card, Dialog, IconButton, Portal, Paragraph, Text, useTheme } from 'react-native-paper';

import { INSPECTION_READ } from 'screens/names';

import notFoundImage from './assets/image-not-found-scaled.png';
import trash from './assets/trash.svg';
import errorDrawing from './assets/error.svg';

const LIMIT_OPTIONS = ['10', '20', '50', '100'];

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
  },
  listView: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 8,
  },
  card: {
    margin: 8,
    display: 'flex',
    flexGrow: 1,
    minWidth: 304,
    ...Platform.select({
      native: { maxWidth: Dimensions.get('window').width - 16 },
      default: { maxWidth: 'calc(100% - 16px)' },
    }),
  },
  loadingIndicator: {
    margin: 8,
    display: 'flex',
    flexGrow: 1,
    minWidth: 304,
    minHeight: 227,
    ...Platform.select({
      native: { maxWidth: Dimensions.get('window').width - 16 },
      default: { maxWidth: 'calc(100% - 16px)' },
    }),
  },
  dialog: {
    maxWidth: 450,
    alignSelf: 'center',
    padding: 12,
  },
  dialogDrawing: { display: 'flex', alignItems: 'center' },
  dialogContent: { textAlign: 'center' },
  dialogActions: { width: '100%' },
  errorLayout: {
    ...Platform.select({ native: { flex: 1 },
      default: { display: 'flex', flexGrow: 1, minHeight: 'calc(100vh - 64px)' },
    }),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContent: { textAlign: 'center', margin: 12 },
});

const Placeholders = () => {
  const array = new Array(Platform.select({ web: 6, native: 3 })).fill('');
  // eslint-disable-next-line react/no-array-index-key
  return array.map((_, i) => <Placeholder key={i} style={styles.loadingIndicator} />);
};

export default () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { colors } = useTheme();

  // Request filters
  const [pageLimiter, setPageLimiter] = useState(LIMIT_OPTIONS[1]);
  const [inspectionToDelete, setInspectionToDelete] = useState(null);

  // Request
  const { error, isLoading, refresh, response } = useRequest(getAllInspections({
    params: {
      limit: pageLimiter,
      show_deleted: false,
    },
  }));

  const ids = useSelector(selectInspectionIds);
  const inspectionEntities = useSelector(selectInspectionEntities);
  const imagesEntities = useSelector(selectImageEntities);

  const { inspections } = denormalize({ inspections: ids }, {
    inspections: [inspectionsEntity],
    images: [imagesEntity],
  }, { inspections: inspectionEntities, images: imagesEntities });

  const [fakeActivity] = useFakeActivity(isLoading);

  const getCover = useCallback(
    (inspection) => {
      if (inspection?.images?.length === 0) {
        return notFoundImage;
      }

      const cover = inspection.images[0];
      return cover ? { uri: cover.path } : {};
    },
    [],
  );

  const handleDismissDialog = useCallback(() => {
    setInspectionToDelete(null);
  }, []);

  const handleDelete = useCallback(() => {
    dispatch(deleteOneInspection({ id: inspectionToDelete }));
  }, [dispatch, inspectionToDelete]);

  const handleNext = useCallback((next) => {
    dispatch(getAllInspections({ params: { limit: pageLimiter, before: next.before } }));
  }, [dispatch, pageLimiter]);

  const handlePrev = useCallback((prev) => {
    dispatch(getAllInspections({ params: { limit: pageLimiter, after: prev.after } }));
  }, [dispatch, pageLimiter]);

  const handlePress = useCallback(
    (inspectionId) => {
      navigation.navigate(INSPECTION_READ, { inspectionId });
    },
    [navigation],
  );

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: 'Inspections list',
        headerBackVisible: true,
        headerRight: () => (
          <Button
            icon={fakeActivity ? undefined : 'refresh'}
            onPress={refresh}
            loading={fakeActivity}
            disabled={fakeActivity}
          >
            Refresh
          </Button>
        ),
      });
    }
  }, [colors, fakeActivity, refresh, navigation]);

  useEffect(() => {
    if (!fakeActivity && inspectionToDelete !== null && !inspectionEntities[inspectionToDelete]) {
      setInspectionToDelete(null);
    }
  }, [fakeActivity, inspectionEntities, inspectionToDelete]);

  if (error && !inspections?.length) {
    return (
      <View style={styles.errorLayout}>
        <Drawing xml={errorDrawing} height="200" />
        <Text style={styles.errorContent}>
          Something went wrong, we
          {'\''}
          re investigating...
        </Text>
      </View>
    );
  }
  return (
    <>
      <SafeAreaView style={styles.root}>
        <ScrollView>
          <View style={styles.listView}>
            {inspections.map((inspection) => (
              <Card
                key={inspection.id}
                style={styles.card}
                onPress={() => handlePress(inspection.id)}
              >
                <Card.Title
                  title={inspection.id.split('-')[0]}
                  subtitle={moment(inspection.createdAt).format('LLL')}
                  right={() => (
                    <IconButton
                      icon="trash-can"
                      color={colors.warning}
                      onPress={() => setInspectionToDelete(inspection.id)}
                    />
                  )}
                />
                <Card.Cover source={getCover(inspection)} style={{ height: 200 }} />
              </Card>
            ))}
            {isEmpty(inspections) && <Placeholders />}
          </View>
          <View>
            {response?.result?.paging && (
              <Pagination
                paging={response?.result?.paging}
                initialLimit={pageLimiter}
                limitOptions={LIMIT_OPTIONS}
                onLimitChange={setPageLimiter}
                onNext={handleNext}
                onPrevious={handlePrev}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
      <Portal>
        <Dialog
          visible={Boolean(inspectionToDelete)}
          onDismiss={handleDismissDialog}
          style={styles.dialog}
        >
          <View style={styles.dialogDrawing}>
            <Drawing xml={trash} width="200" height="120" />
          </View>
          <Dialog.Title style={styles.dialogContent}>
            Are you sure?
          </Dialog.Title>

          <Dialog.Content>
            <Paragraph style={styles.dialogContent}>
              You
              {'\''}
              re about to delete an inspection, there is no going back in this action.
            </Paragraph>
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={handleDismissDialog} style={styles.dialogActions} mode="outlined">
              Cancel
            </Button>
          </Dialog.Actions>
          <Dialog.Actions>
            <Button
              color={colors.error}
              style={styles.dialogActions}
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
    </>
  );
};
