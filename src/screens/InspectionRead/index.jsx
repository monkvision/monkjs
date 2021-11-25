import moment from 'moment';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Image, Platform, StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { getOneInspectionById, selectInspectionById, selectAllTasks, selectImageEntities, selectAllDamages, getAllInspectionTasks } from '@monkvision/corejs';

import { Appbar, Card, Button, Modal } from 'react-native-paper';
import JSONTree from 'react-native-json-tree';
import useInterval from 'hooks/useInterval';
import Carousel from 'components/Carousel';
import { DAMAGE_LIBRARY } from '../names';

const { width } = Dimensions.get('window');
const DEFAULT_POOL = 10000; // 1 min
const MODAL_MAX_WIDTH = 512;
const CONTENT_WIDTH = Platform.select({ web: MODAL_MAX_WIDTH, native: width });
// we can customize the json component by making changes to the theme object
// see more in the docs https://www.npmjs.com/package/react-native-json-tree
const theme = {
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
};
const styles = StyleSheet.create({
  modal: {
    width: '100%',
    height: '100%',
    borderRadius: Platform.select({ web: 40, native: 0 }),
    overflow: 'hidden',
    maxWidth: 512,
    maxHeight: 512,
    alignSelf: 'center',
    position: 'relative',
    alignItems: 'flex-start',
    zIndex: 10,
  },
  image: {
    width: '100%', height: CONTENT_WIDTH,
  },
  closeButton: {
    borderRadius: 999,
    width: 32,
    height: 32,
    backgroundColor: 'grey',
    position: 'absolute',
    top: Platform.select({ web: 20, native: 20 + (MODAL_MAX_WIDTH - width) / 2 }),
    right: 20,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default () => {
  const [picturesModal, setPicturesModal] = useState(false);
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const images = useSelector(selectImageEntities);

  const { inspectionId } = route.params;
  const { loading, error } = useSelector((state) => state.inspections);
  const inspection = useSelector((state) => selectInspectionById(state, inspectionId));

  const getSubtitle = useCallback(({ createdAt, id }) => `
    ${moment(createdAt).format('L')} - ${id.split('-')[0]}...
  `, []);

  const { loading: tasksLoading, error: tasksError } = useSelector(((state) => state.tasks));
  const tasks = useSelector(selectAllTasks);

  const { loading: damagesLoading, error: damagesError } = useSelector(((state) => state.damages));
  const damages = useSelector(selectAllDamages);

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
            <Appbar.Content title="Inspection" subtitle={inspectionId} />
          </Appbar.Header>
        ),
      });
    }
  }, [handleGoBack, navigation, inspectionId]);

  useEffect(() => {
    if (loading !== 'pending' && !inspection && !error) {
      dispatch(getOneInspectionById({ id: inspectionId }));
    }
  }, [dispatch, error, inspection, inspectionId, loading]);

  const goToLibrary = useCallback(() => {
    navigation.navigate(DAMAGE_LIBRARY, { inspectionId });
  }, [inspectionId, navigation]);

  const poolTasks = useCallback(
    () => dispatch(getAllInspectionTasks({ inspectionId })), [dispatch, inspectionId],
  );

  const handleOpenModal = useCallback(() => setPicturesModal(true), [setPicturesModal]);
  const handleCloseModal = useCallback(() => setPicturesModal(false), [setPicturesModal]);

  const imagesList = useMemo(
    () => inspection.images.map((image) => images[image]).filter((image) => image),
    [images, inspection],
  );

  const tasksToBeDone = useMemo(() => (
    tasks?.length
      ? tasks?.some((task) => (
        task.status !== 'DONE'
        && task.status !== 'ERROR'
        && task.status !== 'VALIDATED'
      ))
      : true), [tasks]);

  const delay = inspection && tasksLoading !== 'pending' && !tasksError && tasksToBeDone && DEFAULT_POOL;

  useInterval(poolTasks, delay);

  useEffect(() => {
    if (!tasksToBeDone && damagesLoading !== 'pending' && !damagesError) {
      dispatch(getOneInspectionById({ id: inspectionId }));
    }
  }, [
    damagesError, damagesLoading,
    dispatch, inspectionId, tasks, tasksToBeDone,
  ]);

  return (
    <>
      <View style={{ zIndex: -1 }}>
        <Card>
          <Card.Title
            title="Vehicle info"
            subtitle={getSubtitle(inspection)}
          />
          <Card.Content>
            <JSONTree data={{ ...inspection, tasks, damages }} theme={theme} />
          </Card.Content>
          <Card.Actions>
            <Button onPress={handleOpenModal}>Show images</Button>
            <Button onPress={goToLibrary}>
              Show damages
            </Button>
          </Card.Actions>
        </Card>
      </View>
      <Modal
        contentContainerStyle={styles.modal}
        onDismiss={handleCloseModal}
        visible={picturesModal}
      >
        {/* close button */}
        <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
          <MaterialCommunityIcons name="close" size={24} color="white" />
        </TouchableOpacity>

        {/* carousel */}
        <Carousel
          withArrows
          contentWidth={CONTENT_WIDTH}
          data={imagesList}
          renderItem={({ item, index }) => (
            <Image source={{ uri: item.path }} key={index} style={styles.image} />
          )}
        />
      </Modal>
    </>
  );
};
