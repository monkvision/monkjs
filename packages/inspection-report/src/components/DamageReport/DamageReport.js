import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import AppStateMock from '../../mock';
import { IconButton } from '../common';
import Gallery from '../Gallery';
import Overview from './Overview';
import TabButton from './TabButton';
import TabGroup from './TabGroup';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
    height: '100%',
    minHeight: '100%',
    overflow: 'hidden',
  },
  header: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 13,
    paddingBottom: 13,
    marginBottom: 16,
  },
  content: {
    flex: 1,
    display: 'flex',
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  tabGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  text: {
    color: '#fafafa',
    fontSize: 18,
  },
  title: {
    fontSize: 20,
  },
  button: {
    marginLeft: 20,
    padding: 20,
  },
});

const Tabs = {
  OVERVIEW: 0,
  GALLERY: 1,
};

export default function DamageReport() {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState(Tabs.OVERVIEW);
  // const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  // const [isModalVisible, setIsModalVisible] = useState(false);
  //
  // const onPopUpDismiss = useCallback(() => {
  //   setIsPopUpVisible(false);
  // }, []);
  //
  // const onShowGallery = useCallback(() => {
  //   onPopUpDismiss();
  //   setIsModalVisible(true);
  // }, []);
  //
  // const onGalleryConfirm = useCallback(() => {
  //   setIsModalVisible(false);
  // }, []);
  //
  // const onGalleryDismiss = useCallback(() => {
  //   setIsModalVisible(false);
  // }, []);

  return (
    <View style={[styles.container]}>
      <View style={[styles.header]}>
        <IconButton icon="keyboard-backspace" onPress={() => console.log('Back')} />
        <Text style={[styles.text, styles.title]}>{t('damageReport.title')}</Text>
        <IconButton icon="file-download" onPress={() => console.log('download')} />
      </View>

      <View style={[styles.content]}>
        <View style={[styles.tabGroup]}>
          <TabGroup>
            <TabButton
              icon="360"
              label={t('damageReport.tabs.overviewTab.label')}
              selected={currentTab === Tabs.OVERVIEW}
              onPress={() => setCurrentTab(Tabs.OVERVIEW)}
            />
            <TabButton
              icon="photo-library"
              label={t('damageReport.tabs.photosTab.label')}
              selected={currentTab === Tabs.GALLERY}
              onPress={() => setCurrentTab(Tabs.GALLERY)}
            />
          </TabGroup>
        </View>
        <View>
          {currentTab !== Tabs.OVERVIEW ? null : (
            <Overview
              damages={AppStateMock.damages}
              damageMode={AppStateMock.damageMode}
              vehicleType={AppStateMock.vehicleType}
            />
          )}
          {currentTab !== Tabs.GALLERY ? null : (
            <Gallery pictures={AppStateMock.gallery} />
          )}
        </View>
      </View>
      {/*{*/}
      {/*  isPopUpVisible && (*/}
      {/*    <UpdateDamagePopUp*/}
      {/*      part="wheel_front_right"*/}
      {/*      damage={null}*/}
      {/*      damageMode="all"*/}
      {/*      imageCount={0}*/}
      {/*      onDismiss={onPopUpDismiss}*/}
      {/*      onShowGallery={onShowGallery}*/}
      {/*    />*/}
      {/*  )*/}
      {/*}*/}
      {/*{*/}
      {/*  isModalVisible && (*/}
      {/*    <UpdateDamageModal*/}
      {/*      damage={null}*/}
      {/*      damageMode="all"*/}
      {/*      images={[]}*/}
      {/*      onConfirm={onGalleryConfirm}*/}
      {/*      onDismiss={onGalleryDismiss}*/}
      {/*      part="wheel_front_right"*/}
      {/*    />*/}
      {/*  )*/}
      {/*}*/}
    </View>
  );
}
