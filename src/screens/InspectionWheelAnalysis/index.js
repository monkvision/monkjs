import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, View } from 'react-native';
import { Title, Card, useTheme, Chip, TouchableRipple } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { denormalize } from 'normalizr';

import startCase from 'lodash.startcase';

import {
  getOneInspectionById,
  selectInspectionEntities,
  selectImageEntities,
  selectTaskEntities,
  imagesEntity,
  inspectionsEntity,
  tasksEntity,
  selectWheelAnalysisEntities,
  selectWheelAnalysisById,
  wheelAnalysisEntity,
} from '@monkvision/corejs';

import { utils, useFakeActivity } from '@monkvision/toolkit';
import { Loader } from '@monkvision/ui';

import useRequest from 'hooks/useRequest';

import ActionMenu from 'components/ActionMenu';
import Img from 'components/Img';
import ImageViewer from 'components/ImageViewer';
import isEmpty from 'lodash.isempty';

const { spacing } = utils.styles;
const styles = StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
  },
  card: {
    marginHorizontal: spacing(2),
    marginVertical: spacing(1),
    overflow: 'hidden',
  },
  image: {
    width: 300,
    height: 225,
    marginHorizontal: spacing(0),
    marginVertical: spacing(1),
  },
  chip: {
    marginVertical: spacing(2),
  },
  chipLayout: {
    display: 'flex',
    flexDirection: 'row',
  },
  section: {
    marginVertical: spacing(2),
  },
});

export default () => {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();

  const { inspectionId, wheelAnalysisId } = route.params;

  const { isLoading, refresh } = useRequest(getOneInspectionById({ id: inspectionId }));

  const inspectionEntities = useSelector(selectInspectionEntities);
  const imagesEntities = useSelector(selectImageEntities);
  const tasksEntities = useSelector(selectTaskEntities);
  const wheelAnalysisEntities = useSelector(selectWheelAnalysisEntities);

  const currentWheelAnalysis = useSelector(
    (state) => selectWheelAnalysisById(state, wheelAnalysisId),
  );

  const { inspection } = denormalize({ inspection: inspectionId }, {
    inspection: inspectionsEntity,
    images: [imagesEntity],
    tasks: [tasksEntity],
    wheelAnalysis: [wheelAnalysisEntity],
  }, {
    inspections: inspectionEntities,
    images: imagesEntities,
    tasks: tasksEntities,
    wheelAnalysis: wheelAnalysisEntities,
  });
  const [fakeActivity] = useFakeActivity(isLoading);
  const [isPreviewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState({});

  const openPreviewDialog = useCallback((image) => {
    setPreviewImage(image);
    setPreviewDialogOpen(true);
  }, []);

  const handleDismissPreviewDialog = useCallback(() => {
    setPreviewDialogOpen(false);
  }, []);

  const currentWheelsAnalysisImages = useMemo(() => {
    const allWheelAnalysisImages = Object.values(imagesEntities).filter(
      (image) => image?.wheelAnalysis,
    );
    const currentImages = allWheelAnalysisImages.filter(
      (image) => image.wheelAnalysis.id === wheelAnalysisId,
    );
    return currentImages;
  }, [imagesEntities, wheelAnalysisId]);

  console.log({ currentWheelsAnalysisImages, currentWheelAnalysis, previewImage });
  const isDamaged = true;
  const rimMaterial = 'aluminium';
  const severity = 0;

  const menuItems = useMemo(() => [
    { title: 'Refresh', loading: Boolean(fakeActivity), onPress: refresh, icon: 'refresh' },
  ], [fakeActivity, refresh]);
  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: startCase(currentWheelAnalysis?.wheelName),
        subtitle: wheelAnalysisId,
        headerBackVisible: true,
        headerRight: () => (
          <ActionMenu menuItems={menuItems} />
        ),
      });
    }
  }, [theme.colors.text, inspection, inspectionId, menuItems, navigation, wheelAnalysisId,
    currentWheelAnalysis]);

  if (fakeActivity) {
    return <Loader texts={['Loading the inspection...', 'Swapping time and space...', 'Just count to 10...']} />;
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView>
        <Card style={styles.card}>
          <Card.Content>
            {/* damage state */}
            <View style={styles.section}>
              <Title>
                Damages detected by AI
              </Title>
              <View style={styles.chipLayout}>
                <Chip style={styles.chip} selected={isDamaged}>
                  Damaged
                </Chip>
                <Chip
                  style={[styles.chip, { marginLeft: spacing(1) }]}
                  selected={!isDamaged}
                >
                  Not damaged
                </Chip>
              </View>
            </View>

            {/* rim/hubcap material */}
            <View style={styles.section}>
              <Title>
                Rim/Hubcap material
              </Title>
              <View style={styles.chipLayout}>
                <Chip style={styles.chip} selected={rimMaterial === 'steel'}>
                  Steel
                </Chip>
                <Chip style={[styles.chip, { marginLeft: spacing(1) }]} selected={rimMaterial === 'aluminium'}>
                  Aluminium
                </Chip>
                <Chip style={[styles.chip, { marginLeft: spacing(1) }]} selected={rimMaterial === 'embellisher'}>
                  Emb
                </Chip>
              </View>
            </View>

            {/* severity */}
            <View style={styles.section}>
              <Title>
                Severity
              </Title>
              <View style={styles.chipLayout}>
                <Chip style={styles.chip} selected={severity === 0}>
                  Minor
                </Chip>
                <Chip style={[styles.chip, { marginLeft: spacing(1) }]} selected={severity === 1}>
                  Moderate
                </Chip>
                <Chip style={[styles.chip, { marginLeft: spacing(1) }]} selected={severity === 3}>
                  Major
                </Chip>
              </View>
            </View>

            {/* images */}
            {!isEmpty(currentWheelsAnalysisImages) ? (
              <View style={styles.section}>
                <Title>
                  Photos of part
                </Title>
                {currentWheelsAnalysisImages.map((image, index) => (
                  <TouchableRipple
                    key={image.id}
                    onPress={() => openPreviewDialog({
                      name: image.name,
                      path: image.path,
                      index,
                    })}
                  >
                    <Img
                      style={styles.image}
                      skeletonStyle={styles.image}
                      source={{ uri: image.path }}
                    />
                  </TouchableRipple>
                ))}
              </View>
            ) : null}
          </Card.Content>
        </Card>
      </ScrollView>

      {!isEmpty(currentWheelsAnalysisImages) ? (
        <ImageViewer
          isOpen={isPreviewDialogOpen}
          images={currentWheelsAnalysisImages.map((image) => ({ url: image.path }))}
          index={previewImage.index}
          handleDismiss={handleDismissPreviewDialog}
        />
      ) : null}
    </SafeAreaView>
  );
};
