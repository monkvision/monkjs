import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { denormalize } from 'normalizr';

import { Loader, ScreenView } from '@monkvision/ui';
import { useRequestState } from '@monkvision/toolkit';
import monk from '@monkvision/corejs';

export default function InspectionList() {
  const dispatch = useDispatch();
  const [inspectionIds, setInspectionIds] = useState([]);

  const getManyInspections = useCallback(async () => monk.entity.inspection.getMany({
    params: {
      limit: 10,
      inspectionStatus: 'DONE',
      showDeleted: false,
    },
  }), []);

  const handleRequestSuccess = useCallback(({ entities, result }) => {
    setInspectionIds(result);
    dispatch(monk.actions.gotManyInspections({ entities, result }));
  }, [dispatch]);

  const [manyInspections] = useRequestState(getManyInspections, handleRequestSuccess);

  const inspectionEntities = useSelector(monk.entity.inspection.selectors.selectEntities);
  const imageEntities = useSelector(monk.entity.image.selectors.selectEntities);

  const { inspections } = denormalize(
    { inspections: inspectionIds },
    { inspections: [monk.schemas.inspection] },
    { inspections: inspectionEntities, images: imageEntities },
  );

  // eslint-disable-next-line no-console
  console.log(inspections);

  if (manyInspections.loading) {
    return <Loader />;
  }

  return (
    <ScreenView />
  );
}
