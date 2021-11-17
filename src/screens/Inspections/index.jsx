import React, { useCallback } from 'react';
import { Button } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { View } from 'react-native';

import { getAllInspections, selectAllInspections } from '@monkvision/corejs';

const LIMIT_PER_PAGE = 10;
const defaultImage = "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled.png";

export default () => {
  const dispatch = useDispatch();
  const inspections = useSelector(selectAllInspections);

  // eslint-disable-next-line no-console
  console.log(inspections);

  const getAll = useCallback((params) => {
    dispatch(getAllInspections({ params }));
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    getAll({ limit: LIMIT_PER_PAGE });
  }, []);

  const handlePrevPage = useCallback(() => {
    if (inspections[0]?.paging?.cursors?.previous?.after)
      getAll({limit: LIMIT_PER_PAGE, after: inspections[0].paging.cursors.previous.after});
  }, [inspections]);

  const handleNextPage = useCallback(() => {
    if (inspections[0]?.paging?.cursors?.next?.before)
      getAll({ limit: LIMIT_PER_PAGE, before: inspections[0].paging.cursors.next.before });
  }, [inspections]);

  const handleDelete = useCallback(() => {
    console.log('Delete inspection')
  }, [inspections])

  const handlePress = useCallback(() => {
    console.log('See inspection details')
  }, [inspections])

  return (
    <View style={{ display: 'flex', width: '100%', height: '100%' }}>
      <Button onPress={handleRefresh}>Get All</Button>
      <View style={{ flex: .95, alignItems: 'center', width: '100%' }}>
        <ScrollView style={{ width: '100%' }}>
          {inspections?.map(d => d.data?.map(inspection => {
            return <Card key={inspection.id} style={{ width: '90%', height: 200, margin: 10 }} onPress={handlePress}>
              <Card.Title
                title={inspection.id}
                subtitle={new Date(inspection.created_at).toDateString()}
                right={() => <Button icon='trash-can' color='red' onPress={handleDelete}/>}
              />
              <Card.Cover source={{ uri: inspection.images.length > 0? inspection.images[0] : defaultImage }} style={{ height: '45%' }}/>
            </Card>
          }))}
        </ScrollView>
      </View>
      <View style={{ flex: .05, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Button
          icon='chevron-left'
          contentStyle={{ flexDirection: 'row-reverse' }}
          disabled={inspections.length === 0 || !inspections[0]?.paging?.cursors?.previous}
          onPress={handlePrevPage}
        />
        <Button icon='chevron-right' disabled={inspections.length === 0 || !inspections[0]?.paging?.cursors?.next} onPress={handleNextPage}/>
      </View>
    </View>
  );
};
