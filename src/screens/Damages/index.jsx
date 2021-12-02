import usePartDamages from 'hooks/usePartDamages';
import React, { useLayoutEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import camelCase from 'lodash.camelcase';
import { denormalize } from 'normalizr';

import {
  damagesEntity,
  getOneInspectionById,
  selectDamageEntities,
  selectInspectionEntities,
  selectImageEntities,
  selectPartEntities,
  selectTaskEntities,
  imagesEntity,
  inspectionsEntity,
  tasksEntity,
} from '@monkvision/corejs';

import { useNavigation, useRoute } from '@react-navigation/native';
import useRequest from 'hooks/useRequest';

import { Vehicle } from '@monkvision/react-native';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { BottomNavigation, Button, IconButton, List, useTheme } from 'react-native-paper';
import { ActivityIndicatorView, useFakeActivity } from '@monkvision/react-native-views';

import { spacing } from 'config/theme';
import vehicleViews from 'assets/vehicle.json';
import { vehiclePartsNames } from '../../../packages/react-native/src/components/Vehicle/index';

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

function Navigation({ damagedPartsCount, computedParts, ...props }) {
  const [index, setIndex] = React.useState(0);
  const disabled = damagedPartsCount === 0;

  const [routes] = React.useState([
    { key: 'front', title: 'Front', icon: 'car', badge: computedParts.front },
    { key: 'back', title: 'Back', icon: 'car-back', badge: computedParts.back },
    { key: 'interior', title: 'Interior', icon: 'car-seat', badge: computedParts.interior },
    { key: 'list', title: 'List of all', icon: 'format-list-text', badge: damagedPartsCount, disabled },
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
  computedParts: PropTypes.shape({
    back: PropTypes.number,
    front: PropTypes.number,
    interior: PropTypes.number,
  }).isRequired,
  damagedPartsCount: PropTypes.number,
};

Navigation.defaultProps = {
  damagedPartsCount: 0,
};

export default () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { inspectionId } = route.params;

  const { isLoading, refresh } = useRequest(getOneInspectionById({ id: inspectionId }));

  const inspectionEntities = useSelector(selectInspectionEntities);
  const imagesEntities = useSelector(selectImageEntities);
  const damagesEntities = useSelector(selectDamageEntities);
  const partsEntities = useSelector(selectPartEntities);
  const tasksEntities = useSelector(selectTaskEntities);

  const { inspection } = denormalize({ inspection: inspectionId }, {
    inspection: inspectionsEntity,
    images: [imagesEntity],
    damages: [damagesEntity],
    tasks: [tasksEntity],
  }, {
    inspections: inspectionEntities,
    images: imagesEntities,
    damages: damagesEntities,
    parts: partsEntities,
    tasks: tasksEntities,
  });

  const [fakeActivity] = useFakeActivity(isLoading);

  const partsWithDamages = inspection.damages
    ? usePartDamages(inspection.parts, inspection.damages)
    : [];

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: !inspection.damages
          ? 'Vehicle has no damage'
          : `Vehicle has ${inspection?.damages.length} damage${inspection.damages.length > 1 ? 's' : ''}`,
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
  }, [fakeActivity, inspection, inspectionId, navigation, refresh]);

  if (partsWithDamages.length === 0) {
    return null;
  }
  const activeParts = partsWithDamages.map((part) => camelCase(part.partType));

  const computedParts = useCallback(() => {
    const parts = {
      front: 0,
      back: 0,
      interior: 0,
    };
    activeParts.map((item) => {
      // front
      if (vehiclePartsNames.front.some((e) => e === item)) { parts.front += 1; }
      // back
      if (vehiclePartsNames.back.some((e) => e === item)) { parts.back += 1; }
      // interior
      if (vehiclePartsNames.interior.some((e) => e === item)) { parts.interior += 1; }
      return undefined;
    });
    return parts;
  }, [activeParts]);

  return (
    <SafeAreaView style={styles.root}>
      {fakeActivity ? <ActivityIndicatorView light /> : (
        <Navigation
          partsWithDamages={partsWithDamages}
          computedParts={computedParts()}
          damagedPartsCount={partsWithDamages.length}
        />
      )}
    </SafeAreaView>
  );
};
