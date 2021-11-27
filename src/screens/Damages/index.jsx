import camelCase from 'lodash.camelcase';
import React, { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getOneInspectionById,
  // selectInspectionById,
  selectDamageEntities,
  selectPartEntities,
} from '@monkvision/corejs';

import { ActivityIndicatorView, useFakeActivity } from '@monkvision/react-native-views';
import { useNavigation, useRoute } from '@react-navigation/native';
import usePartDamages from 'hooks/usePartDamages';

import { Vehicle } from '@monkvision/react-native';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Avatar, BottomNavigation, IconButton, List, useTheme } from 'react-native-paper';
import { spacing } from 'config/theme';

import vehicleViews from 'assets/vehicle.json';
import { INSPECTIONS } from 'screens/names';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
  },
  scene: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
    padding: spacing(2),
  },
  avatar: {
    marginHorizontal: spacing(2),
  },
});

export function DamageListItem({ damageType, createdBy }) {
  const { colors } = useTheme();

  return (
    <List.Item
      title={damageType}
      left={() => <List.Icon color="#000" icon={createdBy === 'algo' ? 'matrix' : 'account'} />}
      right={() => <IconButton icon="trash-can" color={colors.warning} onPress={() => {}} />}
    />
  );
}

DamageListItem.propTypes = {
  createdBy: PropTypes.string.isRequired,
  damageType: PropTypes.string.isRequired,
};

export function PartListSection({ partType, damages }) {
  return damages && (
    <List.Section>
      <List.Subheader>{partType}</List.Subheader>
      {damages.map((damage) => (
        <DamageListItem key={`damage-${damage.id}`} {...damage} />
      ))}
    </List.Section>
  );
}

PartListSection.propTypes = {
  damages: PropTypes.arrayOf(PropTypes.object).isRequired,
  partType: PropTypes.string.isRequired,
};

export function PartsList({ partsWithDamages }) {
  if (!partsWithDamages) { return null; }

  return (
    <ScrollView>
      {partsWithDamages.map((part) => (
        <PartListSection key={`part-${part.id}`} {...part} />
      ))}
    </ScrollView>
  );
}

PartsList.propTypes = {
  partsWithDamages: PropTypes.arrayOf(PropTypes.object),
};

PartsList.defaultProps = {
  partsWithDamages: [],
};

function Scene({ partsWithDamages, viewType }) {
  const activeParts = useMemo(
    () => {
      const object = {};
      partsWithDamages.forEach((part) => { object[camelCase(part.partType)] = true; });

      return object;
    },
    [partsWithDamages],
  );

  return (
    <ScrollView contentContainerStyle={styles.scene}>
      <Vehicle
        xml={vehicleViews[viewType]}
        activeParts={activeParts}
        pressAble={false}
        width="100%"
        height="100%"
      />
    </ScrollView>
  );
}

Scene.propTypes = {
  partsWithDamages: PropTypes.arrayOf(PropTypes.object),
  viewType: PropTypes.oneOf(['front', 'back', 'interior']).isRequired,
};

Scene.defaultProps = {
  partsWithDamages: [],
};

function Navigation({ damagedPartsCount, ...props }) {
  const [index, setIndex] = React.useState(0);
  const disabled = damagedPartsCount === 0;

  const [routes] = React.useState([
    { key: 'front', title: 'Front', icon: 'car' },
    { key: 'back', title: 'Back', icon: 'car-back' },
    { key: 'interior', title: 'Interior', icon: 'car-seat' },
    { key: 'list', title: 'List of all', icon: 'format-list-text', disabled },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    front: () => <Scene viewType="front" {...props} />,
    back: () => <Scene viewType="back" {...props} />,
    interior: () => <Scene viewType="interior" {...props} />,
    list: () => <PartsList {...props} />,
  });

  return (
    <BottomNavigation
      barStyle={{ backgroundColor: '#fff' }}
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}

Navigation.propTypes = {
  damagedPartsCount: PropTypes.number,
};

Navigation.defaultProps = {
  damagedPartsCount: 0,
};

export default () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const route = useRoute();
  const inspectionId = route.params.inspectionId;
  // const inspectionId = 'aa0b8f38-83be-7f93-aa61-2d47849872ad';

  const { loading } = useSelector(({ inspections }) => inspections);
  const [fakeActivity] = useFakeActivity(loading === 'pending');

  // const inspection = useSelector((state) => selectInspectionById(state, inspectionId));
  const damages = useSelector(selectDamageEntities);
  const parts = useSelector(selectPartEntities);

  const partsWithDamages = usePartDamages(parts, damages);

  const handleRefresh = useCallback(() => {
    dispatch(getOneInspectionById({ id: inspectionId }));
  }, [dispatch, inspectionId]);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: `Damaged parts #${inspectionId.split('-')[0]}`,
        headerLeft: () => (
          <IconButton icon="close" onPress={() => navigation.navigate(INSPECTIONS)} />
        ),
        headerRight: () => (
          <Avatar.Text
            size={36}
            style={styles.avatar}
            label={fakeActivity ? '...' : partsWithDamages.length}
          />
        ),
      });
    }
  }, [fakeActivity, handleRefresh, inspectionId, navigation, partsWithDamages.length]);

  useEffect(() => handleRefresh(), [handleRefresh]);

  return (
    <SafeAreaView style={styles.root}>
      {fakeActivity ? <ActivityIndicatorView light /> : (
        <Navigation
          partsWithDamages={partsWithDamages}
          damagedPartsCount={partsWithDamages.length}
        />
      )}
    </SafeAreaView>
  );
};
