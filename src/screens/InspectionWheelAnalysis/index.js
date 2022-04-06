import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Platform, View } from 'react-native';
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
  cardActions: {
    justifyContent: 'flex-end',
  },
  images: {
    display: 'flex',
    flexBasis: 'auto',
    flexDirection: 'row',
    flexShrink: 0,
    flexWrap: 'nowrap',
  },
  tasks: {
    display: 'flex',
    flexBasis: 'auto',
    flexDirection: 'row',
    flexShrink: 0,
    flexWrap: 'nowrap',
    marginBottom: spacing(2),
  },
  image: {
    width: 300,
    height: 225,
    marginHorizontal: spacing(0),
    marginVertical: spacing(1),
  },
  previewImage: {
    flex: 1,
    width: 400,
    height: 400,
    marginHorizontal: spacing(0),
  },
  dialog: {
    maxWidth: 450,
    alignSelf: 'center',
    padding: 12,
  },
  dialogDrawing: { display: 'flex', alignItems: 'center' },
  dialogContent: { textAlign: 'center' },
  dialogActions: { flexWrap: 'wrap' },
  button: { width: '100%', marginVertical: 4 },
  actionButton: { marginLeft: spacing(1) },

  process: {
    ...Platform.select({
      native: { flex: 1 },
      default: { display: 'flex', flexGrow: 1, minHeight: 'calc(100vh - 64px)' },
    }),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    margin: spacing(2),
  },
  processButton: {
    margin: spacing(1),
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
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
            <View style={{ marginVertical: spacing(2) }}>
              <Title>
                Damages detected by AI
              </Title>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Chip style={{ marginVertical: spacing(2) }} selected>
                  Damaged
                </Chip>
                <Chip style={{ marginLeft: spacing(1), marginVertical: spacing(2) }}>
                  Not damaged
                </Chip>
              </View>
            </View>

            {/* rim/hubcap material */}
            <View style={{ marginVertical: spacing(2) }}>
              <Title>
                Rim/Hubcap material
              </Title>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Chip style={{ marginVertical: spacing(2) }}>
                  Steel
                </Chip>
                <Chip style={{ marginLeft: spacing(1), marginVertical: spacing(2) }} selected>
                  Aluminium
                </Chip>
                <Chip style={{ marginLeft: spacing(1), marginVertical: spacing(2) }}>
                  Emb
                </Chip>
              </View>
            </View>

            {/* severity */}
            <View style={{ marginVertical: spacing(2) }}>
              <Title>
                Severity
              </Title>
              <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Chip style={{ marginVertical: spacing(2) }}>
                  Minor
                </Chip>
                <Chip style={{ marginLeft: spacing(1), marginVertical: spacing(2) }} selected>
                  Moderate
                </Chip>
                <Chip style={{ marginLeft: spacing(1), marginVertical: spacing(2) }}>
                  Major
                </Chip>
              </View>
            </View>

            {/* images */}
            <View style={{ marginVertical: spacing(2) }}>
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
          </Card.Content>
        </Card>
      </ScrollView>

      <ImageViewer
        isOpen={isPreviewDialogOpen}
        images={currentWheelsAnalysisImages.map((image) => ({ uri: image.path }))}
        index={previewImage.index}
        handleDismiss={handleDismissPreviewDialog}
      />
    </SafeAreaView>
  );
};
