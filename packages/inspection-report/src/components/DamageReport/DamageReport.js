import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import AppStateMock, { cleanMockDamages } from '../../mock';
import { DamageMode, VehicleType } from '../../resources';
import { IconButton } from '../common';
import Gallery from '../Gallery';
import MockControlPanel from './MockControlPanel';
import Overview from './Overview';
import TabButton from './TabButton';
import TabGroup from './TabGroup';
import UpdateDamageModal from './UpdateDamageModal';
import UpdateDamagePopUp from './UpdateDamagePopUp';

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
    overflowY: 'scroll',
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
  // -------- MOCK --------
  const [vehicleType, setVehicleType] = useState(VehicleType.CUV);
  const [damageMode, setDamageMode] = useState(DamageMode.SEVERITY);
  const [damages, setDamages] = useState(cleanMockDamages(damageMode, AppStateMock.damages));
  const [gallery] = useState(AppStateMock.gallery);

  const applyMockState = useCallback((vt, dm) => {
    setVehicleType(vt);
    setDamageMode(dm);
    setDamages(cleanMockDamages(dm, AppStateMock.damages));
  }, []);

  // -------- MOCK --------
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState(Tabs.OVERVIEW);
  const [editedDamage, setEditedDamage] = useState(undefined);
  const [editedDamagePart, setEditedDamagePart] = useState(undefined);
  const [editedDamageImages, setEditedDamageImages] = useState(undefined);
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const resetEditedDamageState = useCallback(() => {
    setEditedDamage(undefined);
    setEditedDamagePart(undefined);
    setEditedDamageImages(undefined);
  }, []);

  const onPopUpDismiss = useCallback(() => {
    resetEditedDamageState();
    setIsPopUpVisible(false);
  }, []);

  const onShowGallery = useCallback(() => {
    setIsPopUpVisible(false);
    setIsModalVisible(true);
  }, []);

  const onGalleryDismiss = useCallback(() => {
    resetEditedDamageState();
    setIsModalVisible(false);
  }, []);

  const handlePartPressed = useCallback((partName) => {
    const damage = damages.find((dmg) => dmg.part === partName);
    if (!damage) {
      setEditedDamagePart(partName);
      setEditedDamageImages([]);
      setIsPopUpVisible(true);
    }
  }, [damages]);

  const handlePillPressed = useCallback((partName) => {
    const damage = damages.find((dmg) => dmg.part === partName);
    if (!damage) {
      throw new Error(`Unable to find damage with corresponding pill part "${partName}"`);
    }
    setEditedDamage(damage);
    setEditedDamagePart(partName);
    setEditedDamageImages(damage.images);
    setIsPopUpVisible(true);
  }, [damages]);

  const handleSaveDamage = useCallback((partialDamage) => {
    if (!partialDamage) {
      // Removing the damage
      const newDamages = damages.filter((dmg) => dmg.part !== editedDamagePart);
      setDamages(newDamages);
    } else {
      // Creating or updating a damage
      const damage = {
        part: editedDamagePart,
        images: editedDamageImages,
        ...partialDamage,
      };
      if (!editedDamage) {
        // Creating a new damage
        setDamages((dmgs) => [...dmgs, damage]);
      } else {
        // Editing a damage
        const dmgs = [...damages];
        const editedIndex = damages.findIndex((dmg) => dmg.part === editedDamage.part);
        dmgs[editedIndex] = damage;
        setDamages(dmgs);
      }
    }
    resetEditedDamageState();
    setIsPopUpVisible(false);
    setIsModalVisible(false);
  }, [editedDamage, damages, resetEditedDamageState, editedDamagePart, editedDamageImages]);

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
              position="left"
            />
            <TabButton
              icon="photo-library"
              label={t('damageReport.tabs.photosTab.label')}
              selected={currentTab === Tabs.GALLERY}
              onPress={() => setCurrentTab(Tabs.GALLERY)}
              position="right"
            />
          </TabGroup>
        </View>
        <View>
          {currentTab !== Tabs.OVERVIEW ? null : (
            <Overview
              damages={damages}
              damageMode={damageMode}
              vehicleType={vehicleType}
              onPressPart={handlePartPressed}
              onPressPill={handlePillPressed}
            />
          )}
          {currentTab !== Tabs.GALLERY ? null : (
            <Gallery pictures={gallery} />
          )}
        </View>
      </View>
      {
        isPopUpVisible && (
          <UpdateDamagePopUp
            part={editedDamagePart}
            damage={editedDamage}
            damageMode={damageMode}
            imageCount={editedDamageImages.length}
            onDismiss={onPopUpDismiss}
            onShowGallery={onShowGallery}
            onConfirm={handleSaveDamage}
          />
        )
      }
      {
        isModalVisible && (
          <UpdateDamageModal
            damage={editedDamage}
            damageMode={damageMode}
            images={editedDamageImages}
            onConfirm={handleSaveDamage}
            onDismiss={onGalleryDismiss}
            part={editedDamagePart}
          />
        )
      }
      <MockControlPanel
        vehicleType={vehicleType}
        damageMode={damageMode}
        onSelectDamageMode={(dm) => applyMockState(vehicleType, dm)}
        onSelectVehicleType={(vt) => applyMockState(vt, damageMode)}
      />
    </View>
  );
}
