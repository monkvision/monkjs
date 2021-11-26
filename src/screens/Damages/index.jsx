import React, { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getOneInspectionById,
  selectInspectionById,
  selectDamageEntities,
  selectPartEntities,
} from '@monkvision/corejs';

import { useFakeActivity } from '@monkvision/react-native-views';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Dimensions, Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Appbar, useTheme, Card } from 'react-native-paper';
import DamageCard from 'screens/DamageLibrary/Damage';

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
  subListView: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  listViewContent: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    ...Platform.select({
      native: { flexDirection: 'column' },
      default: { flexDirection: 'row' },
    }),
  },
  partType: {
    fontSize: 12,
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
});

const groupDamagesByParts = ((parts, damages) => {
  if (damages && parts) {
    return Object.values(parts)
      .filter((p) => p.damage_ids?.length)
      .map((p) => ({
        ...p,
        damages: Object.values(damages).filter((d) => d.part_ids?.includes(p.id)),
      }));
  }
  return [];
});

export default () => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const inspectionId = route.params?.inspectionId ?? 'aa0b8f38-83be-7f93-aa61-2d47849872ad'; // Todo remove

  const { loading, error, paging } = useSelector(({ inspections }) => inspections);
  const inspection = useSelector((state) => selectInspectionById(state, inspectionId));
  const damages = useSelector(selectDamageEntities);
  const parts = useSelector(selectPartEntities);
  const partWithDamages = useMemo(() => groupDamagesByParts(parts, damages), [parts, damages]);
  const [fakeActivity] = useFakeActivity(loading === 'pending');

  const handleRefresh = useCallback(() => {
    dispatch(getOneInspectionById({ id: inspectionId }));
  }, [dispatch, inspectionId]);

  const handleGoBack = useCallback(() => {
    if (navigation && navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        header: () => (
          <Appbar.Header>
            <Appbar.BackAction onPress={handleGoBack} />
            <Appbar.Content
              title="Damages list"
              subtitle="Inspection damages displayed by parts"
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
  }, [fakeActivity, handleGoBack, handleRefresh, navigation, colors]);

  useEffect(() => {
    if (!inspection && !fakeActivity && !loading !== 'pending' && !error) {
      handleRefresh();
    }
  }, [error, fakeActivity, handleRefresh, inspection, loading, paging]);

  return (
    <>
      <SafeAreaView style={styles.root}>
        <ScrollView>
          <View style={styles.listView}>
            { partWithDamages.map((partWithDamage) => (
              <View key={partWithDamage.id} style={styles.subListView}>
                <Card.Title titleStyle={styles.partType} title={partWithDamage.part_type} />
                <Card.Content style={styles.listViewContent}>
                  { partWithDamage.damages && partWithDamage.damages
                    .map((damage) => (<DamageCard key={damage.id} damage={damage} />)) }
                </Card.Content>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
