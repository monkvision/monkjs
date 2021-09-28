import React, { useCallback, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import isEmpty from 'lodash.isempty';
import isArray from 'lodash.isarray';
import moment from 'moment';

import useOk from 'hooks/useOk';
import useMinLoadingTime from 'hooks/useMinLoadingTime';
import { useNavigation } from '@react-navigation/native';
import { useGetInspectionsQuery } from 'hooks';

import Loading from 'screens/Loading';
import Empty from 'screens/Empty';
import Pagination from 'components/Pagination';

import ScreenView from 'screens/ScreenView';
import InspectionsHomeRightActions from 'screens/Inspections/Home/RightActions';
import { DataTable, Surface, Text, useTheme } from 'react-native-paper';

const styles = StyleSheet.create({
  id: {
    ...Platform.select({
      default: { fontFamily: 'monospace, Roboto' },
    }),
    fontWeight: 'bold',
  },
});

export default function InspectionsHome() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [limit, setLimit] = useState(20);

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetInspectionsQuery({ limit });

  const isRefreshing = useMinLoadingTime(isFetching);

  const ok = useOk(
    response && response.data,
    (d) => (isArray(d) && !isEmpty(d)),
  );

  const handleLimitChange = useCallback((newLimit) => {
    setLimit(newLimit);
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <Loading />;
  }

  if (!ok) {
    return (
      <Empty
        createLabel="Start"
        isFetching={isRefreshing}
        onCreatePress={() => navigation.navigate('InspectionsCreate')}
        onRefreshPress={handleRefresh}
      />
    );
  }

  return (
    <ScreenView>
      <Surface>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>ID</DataTable.Title>
            <DataTable.Title>Context</DataTable.Title>
            <DataTable.Title numeric>Created at</DataTable.Title>
          </DataTable.Header>

          {response.data.map((o) => (
            <DataTable.Row style={styles.row}>
              <DataTable.Cell title={o.id}>
                <Text style={[styles.id, { color: colors.primary }]}>
                  {`${o.id.split('-')[0]}`}
                </Text>
              </DataTable.Cell>
              <DataTable.Cell>
                {!isEmpty(o.additional_data) ? o.additional_data.context : ''}
              </DataTable.Cell>
              <DataTable.Cell numeric>
                {moment(o.created_at).calendar()}
              </DataTable.Cell>
            </DataTable.Row>
          ))}
          <Pagination
            initialLimit={limit}
            isFetching={isFetching}
            paging={response.paging}
            onLimitChange={handleLimitChange}
          />
        </DataTable>
      </Surface>
    </ScreenView>
  );
}

InspectionsHome.RightActions = InspectionsHomeRightActions;
