import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Loader } from '@monkvision/ui';

import { CommonPropTypes, DamageMode, VehicleType } from '../../resources';
import { IconButton } from '../common';
import Gallery from '../Gallery';
import { useDamageReportStateHandlers, PdfStatus } from './hooks';
import NewInspectionConfirmModal from './NewInspectionConfirmModal';
import Overview from './Overview';
import TabButton from './TabButton';
import TabGroup from './TabGroup';
import UpdateDamageModal from './UpdateDamageModal';
import UpdateDamagePopUp from './UpdateDamagePopUp';

import { damages as mockDamages, pictures as mockPictures } from './mock';

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
    position: 'relative',
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
  notReadyContainer: {
    flex: 1,
    display: 'flex',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notReadyMessage: {
    fontSize: 20,
    paddingBottom: 30,
    color: '#ffffff',
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#414659',
  },
  retryTxt: {
    fontSize: 22,
    color: '#ffffff',
  },
});

const Tabs = {
  OVERVIEW: 0,
  GALLERY: 1,
};

export default function DamageReport({
  inspectionId,
  vehicleType,
  damageMode,
  generatePdf,
  // pdfOptions,
  onStartNewInspection,
}) {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState(Tabs.OVERVIEW);
  const [showNewInspectionConfirm, setShowNewInspectionConfirm] = useState(false);

  // const {
  //   isLoading,
  //   isError,
  //   retry,
  //   isInspectionReady,
  //   pictures,
  //   damages,
  //   setDamages,
  // } = useFetchInspection({ inspectionId });

  const isLoading = false;
  const isError = false;
  const retry = () => {};
  const isInspectionReady = true;
  const [damages, setDamages] = useState(mockDamages);
  const [pictures] = useState(mockPictures);

  const {
    state: {
      editedDamage,
      editedDamagePart,
      editedDamageImages,
      isPopUpVisible,
      isModalVisible,
    },
    handlePopUpDismiss,
    handleShowGallery,
    handleGalleryDismiss,
    handlePartPressed,
    handlePillPressed,
    handleSaveDamage,
  } = useDamageReportStateHandlers({
    inspectionId,
    damages,
    setDamages,
  });

  // const { pdfStatus, handleDownload } = usePdfReport({
  //   inspectionId,
  //   isInspectionReady,
  //   generatePdf,
  //   customer: pdfOptions?.customer,
  //   clientName: pdfOptions?.clientName,
  // });

  const { pdfStatus, handleDownload } = {
    pdfStatus: PdfStatus.NOT_REQUESTED,
    handleDownload: () => {},
  };

  const pdfIconColor = useMemo(() => {
    switch (pdfStatus) {
      case PdfStatus.READY:
        return '#FFFFFF';
      case PdfStatus.ERROR:
        return '#9f4545';
      default:
        return '#575757';
    }
  }, [pdfStatus]);

  return (
    <View style={[styles.container]}>
      <View style={[styles.header]}>
        <IconButton icon="keyboard-backspace" onPress={() => console.log('Back')} />
        <Text style={[styles.text, styles.title]}>{t('damageReport.title')}</Text>
        <IconButton
          icon="file-download"
          onPress={handleDownload}
          disabled={pdfStatus !== PdfStatus.READY}
          color={pdfIconColor}
          style={[generatePdf ? {} : { opacity: 0 }]}
        />
      </View>
      <View style={[styles.content]}>
        {isLoading && (
        <View style={[styles.notReadyContainer]}>
          <Loader texts={[t('damageReport.loading')]} />
        </View>
        )}
        {!isLoading && isError && (
        <View style={[styles.notReadyContainer]}>
          <Text style={[styles.notReadyMessage]}>{t('damageReport.error.message')}</Text>
          <TouchableOpacity style={[styles.retryButton]} onPress={retry}>
            <Text style={[styles.retryTxt]}>{t('damageReport.error.retry')}</Text>
          </TouchableOpacity>
        </View>
        )}
        {!isLoading && !isError && (
        <>
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
            {currentTab === Tabs.OVERVIEW && !isInspectionReady && (
            <View style={[styles.notReadyContainer]}>
              <Loader texts={[t('damageReport.notReady')]} />
            </View>
            )}
            {currentTab === Tabs.OVERVIEW && isInspectionReady && (
            <Overview
              damages={damages}
              damageMode={damageMode}
              vehicleType={vehicleType}
              onPressPart={handlePartPressed}
              onPressPill={handlePillPressed}
              generatePdf={generatePdf}
              pdfHandles={{ pdfStatus, handleDownload }}
              onStartNewInspection={() => setShowNewInspectionConfirm(true)}
            />
            )}
            {currentTab === Tabs.GALLERY && (
            <Gallery pictures={pictures} />
            )}
          </View>
        </>
        )}
      </View>
      {
          isPopUpVisible && (
            <UpdateDamagePopUp
              part={editedDamagePart}
              damage={editedDamage}
              damageMode={damageMode}
              imageCount={editedDamageImages.length}
              onDismiss={handlePopUpDismiss}
              onShowGallery={handleShowGallery}
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
              onDismiss={handleGalleryDismiss}
              part={editedDamagePart}
            />
          )
        }
      {showNewInspectionConfirm && (
      <NewInspectionConfirmModal
        onConfirm={onStartNewInspection}
        onCancel={() => setShowNewInspectionConfirm(false)}
      />
      )}
    </View>
  );
}

DamageReport.propTypes = {
  damageMode: CommonPropTypes.damageMode,
  generatePdf: PropTypes.bool,
  inspectionId: PropTypes.string.isRequired,
  onStartNewInspection: PropTypes.func,
  pdfOptions: PropTypes.shape({
    clientName: PropTypes.string.isRequired,
    customer: PropTypes.string.isRequired,
  }),
  vehicleType: CommonPropTypes.vehicleType,
};

DamageReport.defaultProps = {
  damageMode: DamageMode.ALL,
  generatePdf: false,
  onStartNewInspection: () => {},
  pdfOptions: undefined,
  vehicleType: VehicleType.CUV,
};
