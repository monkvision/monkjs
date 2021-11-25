import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import moment from 'moment';
import isEmpty from 'lodash.isempty';

import {
  getAllInspections,
  deleteOneInspection,
  selectAllInspections,
  selectImageEntities,
} from '@monkvision/corejs';

import { useFakeActivity } from '@monkvision/react-native-views';
import { useNavigation } from '@react-navigation/native';

import { Dimensions, Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import Placeholder from 'components/Placeholder';
import useInterval from 'hooks/useInterval';
// import Pagination from 'components/Pagination';

import {
  Appbar,
  Button,
  Card,
  Dialog,
  IconButton,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';

import { INSPECTION_READ } from 'screens/names';
import notFoundImage from './image-not-found-scaled.png';
// const LIMIT_OPTIONS = [10, 20, 50, 100];

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
});

const MINUTE = 60000; // in ms
export default () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { colors } = useTheme();

  const { loading, error, paging } = useSelector(({ inspections }) => inspections);
  const inspections = useSelector(selectAllInspections);
  const images = useSelector(selectImageEntities);

  const [inspectionToDelete, setInspectionToDelete] = useState(null);

  const [fakeActivity] = useFakeActivity(loading === 'pending');

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

  const getSubtitle = useCallback(({ createdAt, id }) => `
    ${moment(createdAt).format('L')} - ${id.split('-')[0]}...
  `, []);

  const skeletons = useMemo(() => new Array(Platform.select({ web: 6, native: 3 }))
    .fill(<Placeholder style={styles.loadingIndicator} />), []);

  const handleRefresh = useCallback(() => {
    dispatch(getAllInspections());
  }, [dispatch]);

  const handleDismissDialog = useCallback(() => {
    setInspectionToDelete(null);
  }, []);

  const handleDelete = useCallback(() => {
    dispatch(deleteOneInspection({ id: inspectionToDelete }));
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

  useInterval(handleRefresh, MINUTE);
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
  }, [colors, fakeActivity, handleGoBack, handleRefresh, navigation, loading]);

  useEffect(() => {
    if (!fakeActivity && !paging && !error) {
      handleRefresh();
    }
  }, [error, fakeActivity, handleRefresh, paging]);

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
                  title="Vehicle info"
                  subtitle={getSubtitle(inspection)}
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
            {isEmpty(inspections) && skeletons}
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
        <Dialog
          visible={Boolean(inspectionToDelete)}
          onDismiss={handleDismissDialog}
          style={styles.dialog}
        >
          <Dialog.Title>
            <Text>
              Are you sure ?
            </Text>
          </Dialog.Title>
          <Dialog.Actions>
            <Button onPress={handleDismissDialog}>
              Cancel
            </Button>
            <Button color={colors.error} onPress={handleDelete}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};
