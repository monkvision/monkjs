import { selectAllInspections, selectImageEntities } from '@monkvision/corejs/src';
import React, { useCallback, useEffect, useLayoutEffect } from 'react';
import moment from 'moment';

import { getAllInspections } from '@monkvision/corejs';
import { useFakeActivity } from '@monkvision/react-native-views';
import { useNavigation } from '@react-navigation/native';

import { Dimensions, Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Card, IconButton, useTheme } from 'react-native-paper';
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
    minWidth: 340,
    minHeight: 227,
    ...Platform.select({
      native: { maxWidth: Dimensions.get('window').width - 16 },
      default: { maxWidth: 'calc(100% - 16px)' },
    }),
  },
});

export default () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { colors } = useTheme();

  const { loading, error, paging } = useSelector(({ inspections }) => inspections);
  const inspections = useSelector(selectAllInspections);
  const images = useSelector(selectImageEntities);

  const [fakeActivity] = useFakeActivity(loading === 'pending');

  const handleRefresh = useCallback(() => {
    dispatch(getAllInspections());
  }, [dispatch]);

  const handleDelete = useCallback(() => {
    // eslint-disable-next-line no-console
    console.log('Delete inspection');
  }, []);

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
            <Appbar.Content
              title="Inspections list"
              subtitle="Owned by your organization and you"
            />
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
    <SafeAreaView style={styles.root}>
      <ScrollView>
        <View style={styles.listView}>
          {inspections.length
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
                    <IconButton icon="trash-can" color={colors.warning} onPress={handleDelete} />
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
        {/*    <Pagination */}
        {/*      paging={paging} */}
        {/*      initialLimit={LIMIT_OPTIONS[0]} */}
        {/*      limitOptions={LIMIT_OPTIONS} */}
        {/*    /> */}
        {/*  )} */}
        {/* </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};
