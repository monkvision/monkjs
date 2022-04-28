import { makeStyles } from '@mui/styles';
import React, { useCallback, useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { useRequest } from '@monkvision/toolkit';
import monk from '@monkvision/corejs';
import { View } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'lodash.isempty';
import * as dayjs from 'dayjs';
import Paper from '@mui/material/Paper';
import InspectionList from './InspectionList';
import { Loader } from '../../components';
import ListControls from './ListControls';

const useStyles = makeStyles(() => ({
  view: {
    display: 'flex',
    flexGrow: 1,
    overflow: 'hidden',
    flexDirection: 'column',
  },
}));

const extractNextCursor = (axiosResponse) => {
  if (!axiosResponse.data.paging?.cursors?.next) {
    return null;
  }
  if (axiosResponse.data.paging.cursors.next.after) {
    return { param: 'after', value: axiosResponse.data.paging.cursors.next.after };
  }
  return { param: 'before', value: axiosResponse.data.paging.cursors.next.before };
};

function Empty() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
      <Paper elevation={2} style={{ height: 'fit-content', padding: '15px', marginTop: '20px' }}>
        No inspection match your query.
        Start a new inspection in our application and it will be shown here.
      </Paper>
    </div>
  );
}

function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
      <Loader width={200} height={200} />
    </div>
  );
}

function ListDisplay({ isLoading, isEmpty, items, loadNextPage, hasNextPage }) {
  if (isLoading) {
    return <Loading />;
  } else if (isEmpty) {
    return <Empty />;
  } else {
    return (
      <InspectionList
        items={items}
        loadMore={loadNextPage}
        hasNextPage={hasNextPage}
      />
    );
  }
}

export default function Inspections() {
  const dispatch = useDispatch();
  const [hasNextPage, setHasNextPage] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);
  const [inspectionIds, setInspectionIds] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [fetchFirstPage, setFetchFirstPage] = useState(false);
  const styles = useStyles();

  const inspections = useSelector(monk.entity.inspection.selectors.selectEntities);

  const makeNextRequest = () => monk.entity.inspection.getMany({
    params: {
      limit: 20,
      inspectionStatus: 'DONE',
      showDeleted,
      ...(nextCursor !== null && {[nextCursor.param]: nextCursor.value}),
    },
  });

  const makeNextRequestMemoized = useCallback(async () => makeNextRequest(), []);

  const onFetchSuccess = ({ axiosResponse, entities, result }) => {
    const next = extractNextCursor(axiosResponse);
    if (next === null) {
      setHasNextPage(false);
    }
    setNextCursor(next);
    setInspectionIds([
      ...inspectionIds,
      ...axiosResponse.data.data.map((inspection) => inspection.id),
    ]);
    setFetchFirstPage(false);
    dispatch(monk.actions.gotManyInspections({ entities, result }));
  };

  const loadNextPage = () => hasNextPage ? makeNextRequest().then(onFetchSuccess) : Promise.resolve();

  const onFetchSuccessMemoized = useCallback(onFetchSuccess, []);

  const canRequest = useCallback(
    (requestState) => !requestState.loading && (requestState.count === 0 || fetchFirstPage),
    [fetchFirstPage],
  );

  const firstRequest = useRequest({
    request: makeNextRequestMemoized,
    onRequestSuccess: onFetchSuccessMemoized,
    canRequest,
  });

  const items = inspectionIds.map((id) => inspections[id])
    .map((inspection) => {
      const date = dayjs(inspection.createdAt).format('DD/MM/YYYY - HH:mm');
      const imageCount = inspection.images?.length ?? 0;
      const imageCountLabel = ` (${imageCount} image${imageCount > 1 ? 's' : ''})`;
      return { id: inspection.id, label: date + imageCountLabel };
    });

  const onShowDeletedChange = (isChecked) => {
    setShowDeleted(isChecked);
    setInspectionIds([]);
    setNextCursor(null);
    setHasNextPage(true);
    setFetchFirstPage(true);
  };

  useEffect(() => {
    firstRequest.start();
  }, [firstRequest]);

  return (
    <View viewName="inspections" title="My Inspections" className={styles.view}>
      <CssBaseline />
      <ListControls onShowDeletedChange={onShowDeletedChange} />
      <ListDisplay
        isLoading={firstRequest.state.loading}
        isEmpty={isEmpty(inspections)}
        items={items}
        loadNextPage={loadNextPage}
        hasNextPage={hasNextPage}
      />
    </View>
  );
}
