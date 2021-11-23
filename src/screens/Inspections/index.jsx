import { selectAllInspections, selectImageEntities } from '@monkvision/corejs/src';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import moment from 'moment';

import { getAllInspections, deleteOneInspection } from '@monkvision/corejs';
import { useFakeActivity } from '@monkvision/react-native-views';
import { useNavigation } from '@react-navigation/native';

import { Dimensions, Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import {
  Appbar,
  Button,
  Card,
  Dialog,
  IconButton,
  Paragraph,
  Portal,
  useTheme,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { INSPECTION_READ } from 'screens/names';
import Placeholder from 'components/Placeholder';
// import Pagination from 'components/Pagination';
// const LIMIT_OPTIONS = [10, 20, 50, 100];
import notFoundImage from './image-not-found-scaled.png';

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
  },
  dialogAction: {
    justifyContent: 'space-between',
  },
});

export default () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { colors } = useTheme();

  const { loading, error, paging } = useSelector(({ inspections }) => inspections);
  const inspections = useSelector(selectAllInspections);
  const images = useSelector(selectImageEntities);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [inspectionToDelete, setInspectionToDelete] = useState('');

  const [fakeActivity] = useFakeActivity(loading === 'pending');

  const handleRefresh = useCallback(() => {
    dispatch(getAllInspections());
  }, [dispatch]);

  const showDeleteDialog = useCallback((id) => {
    setInspectionToDelete(id);
    setDeleteDialog(true);
  }, []);

  const hideDeleteDialog = useCallback(() => {
    setDeleteDialog(false);
  }, []);

  const handleDelete = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('Delete inspection');
    dispatch(deleteOneInspection({ id: inspectionToDelete })); // Not available on staging env
  }, [dispatch, inspectionToDelete]);

  const handlePress = useCallback(
    (inspectionId) => {
      navigation.navigate(INSPECTION_READ, { inspectionId });
    },
    [navigation],
  );

  const handleGoBack = useCallback(() => {
    if (navigation && navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  const getCover = useCallback(
    (inspection) => {
      if (inspection.images.length === 0) {
        return notFoundImage;
      }
      const cover = images[inspection.images[0]];
      return { uri: cover.path };
    },
    [images],
  );

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        header: () => (
          <Appbar.Header>
            <Appbar.BackAction onPress={handleGoBack} />
            <Appbar.Content title="Inspections list" />
            <Button
              icon={fakeActivity ? undefined : 'refresh'}
              onPress={handleRefresh}
              color={colors.primaryContrastText}
              loading={fakeActivity}
              disabled={fakeActivity}
            >
              Refresh
            </Button>
          </Appbar.Header>
        ),
      });
    }
  }, [colors, fakeActivity, handleGoBack, handleRefresh, navigation]);

  useEffect(() => {
    if (!fakeActivity && !paging && !error) {
      handleRefresh();
    }
  }, [error, fakeActivity, handleRefresh, paging]);

  const placeHolderArray = new Array(Platform.select({ web: 6, native: 3 })).fill('');
  return (
    <>
      <SafeAreaView style={styles.root}>
        <ScrollView>
          <View style={styles.listView}>
            {inspections?.length
              ? inspections.map((inspection) => (
                <Card
                  key={inspection.id}
                  style={styles.card}
                  onPress={() => handlePress(inspection.id)}
                >
                  <Card.Title
                    title="Vehicle info"
                    subtitle={`${moment(inspection.createdAt).format('L')} - ${
                      inspection.id.split('-')[0]
                    }...`}
                    right={() => (
                      <IconButton icon="trash-can" color={colors.warning} onPress={() => showDeleteDialog(inspection.id)} />
                    )}
                  />
                  <Card.Cover source={getCover(inspection)} style={{ height: 200 }} />
                </Card>
              ))
              : placeHolderArray.map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
                <Placeholder key={i} style={styles.loadingIndicator} />
              ))}
          </View>
          {/* <View> */}
          {/*  {paging && ( */}
          {/*  <Pagination */}
          {/*    paging={paging} */}
          {/*    initialLimit={LIMIT_OPTIONS[0]} */}
          {/*    limitOptions={LIMIT_OPTIONS} */}
          {/*  /> */}
          {/*  )} */}
          {/* </View> */}
        </ScrollView>
      </SafeAreaView>
      <Portal>
        <Dialog visible={deleteDialog} onDismiss={hideDeleteDialog} style={styles.dialog}>
          <Dialog.Title>Delete inspection</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to delete this inspection ?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogAction}>
            <Button mode="outlined" onPress={hideDeleteDialog}>Cancel</Button>
            <Button mode="contained" color={colors.error} onPress={handleDelete}>Delete</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};
