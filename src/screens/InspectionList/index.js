import { useNavigation } from '@react-navigation/native';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { denormalize } from 'normalizr';
import isEmpty from 'lodash.isempty';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import useAuth from 'hooks/useAuth';

import { ScrollView, StyleSheet, View } from 'react-native';
import { Loader } from '@monkvision/ui';
import { useError, useRequest } from '@monkvision/toolkit';
import monk from '@monkvision/corejs';

import { List, Paragraph, Title, useTheme } from 'react-native-paper';

import ListItem from './ListItem';
import Sentry from '../../config/sentry';

const styles = StyleSheet.create({
  empty: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
});

export default function InspectionList({ listItemProps, scrollViewProps, ...props }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  const { loaderDotsColors } = useTheme();
  const { errorHandler, Constants: ErrorConstant } = useError(Sentry);

  const getManyInspections = useCallback(async () => monk.entity.inspection.getMany({
    limit: 5,
    inspectionStatus: monk.types.InspectionStatus.DONE,
    showDeleted: false,
  }), []);

  const inspectionEntities = useSelector(monk.entity.inspection.selectors.selectEntities);
  const inspectionIds = useSelector(monk.entity.inspection.selectors.selectIds);
  const imageEntities = useSelector(monk.entity.image.selectors.selectEntities);

  const { inspections } = denormalize(
    { inspections: inspectionIds },
    { inspections: [monk.schemas.inspection] },
    { inspections: inspectionEntities, images: imageEntities },
  );

  const handleRequestSuccess = useCallback(({ entities, result }) => {
    dispatch(monk.actions.gotManyInspections({ entities, result }));
  }, [dispatch]);

  const canRequest = useCallback(
    () => isAuthenticated,
    [isAuthenticated],
  );

  const request = useRequest({
    request: getManyInspections,
    onRequestSuccess: handleRequestSuccess,
    canRequest,
  });
  const manyInspections = request.state;

  const handlePress = useCallback((id) => {
    const url = `https://${Constants.manifest.extra.IRA_DOMAIN}/inspection/${id}`;
    WebBrowser.openBrowserAsync(url).catch((err) => errorHandler(err, ErrorConstant.type.APP, id));
  }, []);

  useEffect(
    () => navigation.addListener('focus', getManyInspections.start),
    [navigation, getManyInspections.start],
  );

  useEffect(() => {
    if (manyInspections.error) {
      errorHandler(manyInspections.error, ErrorConstant.type.APP);
    }
  }, [manyInspections.error]);

  if (manyInspections.loading) {
    return <Loader colors={loaderDotsColors} />;
  }

  if (manyInspections.error) {
    return (
      <View style={styles.empty}>
        <Title>An error occurred</Title>
        <Paragraph>
          An unexpected error occurred when fetching the inspections. Please try again later.
        </Paragraph>
      </View>
    );
  }

  if (isEmpty(inspections)) {
    return (
      <View style={styles.empty}>
        <Title>Empty inspection list</Title>
        <Paragraph>Add new inspection and it will show up here.</Paragraph>
      </View>
    );
  }

  return (
    <List.Section {...props}>
      <ScrollView {...scrollViewProps}>
        {inspections.map((inspection, index) => (!isEmpty(inspection) && (
          <ListItem
            key={`inspection-${inspection.id}`}
            {...inspection}
            index={index}
            onPress={() => handlePress(inspection.id)}
            {...listItemProps}
          />
        )))}
      </ScrollView>
    </List.Section>
  );
}

InspectionList.propTypes = {
  listItemProps: PropTypes.shape({ onPress: PropTypes.func }),
  scrollViewProps: PropTypes.shape({ onScroll: PropTypes.func }),
};

InspectionList.defaultProps = {
  listItemProps: {},
  scrollViewProps: {},
};
