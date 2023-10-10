import { Loader } from '@monkvision/ui';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';

import { CommonPropTypes, DamageMode, VehicleType } from '../../resources';
import { IconButton } from '../common';
import Gallery from '../Gallery';
import ConfirmModal from './ConfirmModal';
import { PdfStatus, useConfirmModals, useDamageReportStateHandlers, useFetchInspection, usePdfReport } from './hooks';
import Overview from './Overview';
import TabButton from './TabButton';
import TabGroup from './TabGroup';
import Accordion from './Accordion';
import UpdateDamageModal from './UpdateDamageModal';
import UpdateDamagePopUp from './UpdateDamagePopUp';
import { useCurrency, useDesktopMode } from '../../hooks';

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
    justifyContent: 'center',
    paddingTop: 13,
    paddingBottom: 13,
    marginBottom: 16,
  },
  content: {
    flex: 1,
    display: 'flex',
    alignSelf: 'stretch',
    marginBottom: 16,
    overflowY: 'hidden',
  },
  tabGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  tabContent: {
    flex: 1,
    overflowY: 'auto',
  },
  tabDesktopContent: {
    display: 'flex',
    flexDirection: 'row',
  },
  tabDesktopInnerContainer: {
    width: '50%',
    paddingHorizontal: 15,
  },
  text: {
    color: '#fafafa',
    fontSize: 18,
  },
  fileIcon: {
    position: 'absolute',
    right: 0,
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
  partsImageWrapper: {
    border: '1px solid #a29e9e',
    borderRadius: 8,
    marginTop: 15,
  },
  galleryWrapper: {
    ...Platform.select({
      web: {
        maxHeight: '39vh',
      },
      native: {
        maxHeight: '39%'
      }
    }),
    overflowY: 'auto',
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
  currencyCharacter,
  generatePdf,
  pdfOptions,
  onStartNewInspection,
  onPdfPressed,
}) {
  const { t } = useTranslation();
  const { updateCurrency } = useCurrency();
  const isDesktopMode = useDesktopMode();
  const [currentTab, setCurrentTab] = useState(Tabs.OVERVIEW);
  const [showPictures, setShowPictures] = useState(true);

  useEffect(() => {
    updateCurrency(currencyCharacter);
  }, [currencyCharacter]);

  const {
    isLoading,
    isError,
    retry,
    isInspectionReady,
    pictures,
    damages,
    setDamages,
  } = useFetchInspection({ inspectionId });

  const {
    state: {
      editedDamage,
      editedPartDamageImages,
      editedZoomedDamageImages,
      editedDamagePart,
      editedDamageImages,
      isPopUpVisible,
      isModalVisible,
      isEditable,
    },
    handlePopUpDismiss,
    handleShowGallery,
    handleGalleryDismiss,
    handlePartPressed,
    handlePillPressed,
    handleSaveDamage,
    setIsEditable,
  } = useDamageReportStateHandlers({
    inspectionId,
    damages,
    setDamages,
  });

  const {
    reportUrl,
    pdfStatus,
    requestPdf,
    handleDownload,
  } = usePdfReport({
    inspectionId,
    isInspectionReady,
    generatePdf,
    customer: pdfOptions?.customer,
    clientName: pdfOptions?.clientName,
  });

  const handlePDFDownload = useCallback(() => {
    handleDownload();
    onPdfPressed(reportUrl);
  });

  const {
    confirmModal,
    handleHideConfirmModal,
    handleValidateInspection,
    handleNewInspection,
  } = useConfirmModals({
    generatePdf,
    requestPdf,
    setIsEditable,
    onStartNewInspection,
  });

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

  useEffect(() => {
    if (pdfStatus === PdfStatus.ERROR) {
      setIsEditable(true);
    }
  }, [pdfStatus]);

  useEffect(() => {
    if (isPopUpVisible) {
      setShowPictures(false);
    } else {
      setShowPictures(true);
    }
  }, [isPopUpVisible]);

  return (
    <View style={[styles.container]}>
      <View style={[styles.header]}>
        <Text style={[styles.text, styles.title]}>{t('damageReport.title')}</Text>
        <IconButton
          icon="file-download"
          onPress={handlePDFDownload}
          disabled={pdfStatus !== PdfStatus.READY}
          color={pdfIconColor}
          style={[styles.fileIcon, generatePdf ? {} : { opacity: 0 }]}
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
            {
              !isDesktopMode
              && (
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
              )
            }
            <View style={[styles.tabContent, isDesktopMode && styles.tabDesktopContent]}>
              {currentTab === Tabs.OVERVIEW && !isInspectionReady && (
                <View style={[styles.notReadyContainer]}>
                  <Loader texts={[t('damageReport.notReady')]} />
                </View>
              )}
              {currentTab === Tabs.OVERVIEW && isInspectionReady && (
                <Overview
                  isInspectionCompleted={!isEditable}
                  damages={damages}
                  damageMode={damageMode}
                  vehicleType={vehicleType}
                  onPressPart={handlePartPressed}
                  onPressPill={handlePillPressed}
                  generatePdf={generatePdf}
                  onValidateInspection={handleValidateInspection}
                  pdfHandles={{ pdfStatus, handleDownload: handlePDFDownload }}
                  onStartNewInspection={handleNewInspection}
                />
              )}
              {currentTab === Tabs.GALLERY && (
                <Gallery pictures={pictures} />
              )}
              {
                isDesktopMode && (
                  <View style={styles.tabDesktopInnerContainer}>
                    <Accordion title={t('damageReport.pictures')} isCollapsed={!showPictures} onPress={() => setShowPictures(!showPictures)}>
                      <View style={styles.galleryWrapper}>
                        <Gallery pictures={pictures} />
                      </View>
                    </Accordion>
                    {
                      isPopUpVisible && (
                        <View style={[styles.partsImageWrapper, styles.galleryWrapper]}>
                          <View>
                            <Text style={[styles.text, { padding: 10 }]}>{t('damageReport.partsPictures')}</Text>
                            <Gallery pictures={editedPartDamageImages || []} />
                          </View>
                          <View>
                            <Text style={[styles.text, { paddingHorizontal: 10 }]}>{t('damageReport.zoomedPicturesOfThePart')}</Text>
                            <Gallery pictures={editedZoomedDamageImages || []} />
                          </View>
                        </View>
                      )
                    }
                  </View>
                )
              }
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
            imageCount={(editedDamageImages ?? []).length}
            onDismiss={handlePopUpDismiss}
            onShowGallery={handleShowGallery}
            onConfirm={handleSaveDamage}
            isEditable={isEditable}
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
            isEditable={isEditable}
          />
        )
      }
      {
        confirmModal && (
          <ConfirmModal
            texts={confirmModal.texts}
            onConfirm={confirmModal.onConfirm}
            onCancel={handleHideConfirmModal}
          />
        )
      }
    </View>
  );
}

DamageReport.propTypes = {
  currencyCharacter: PropTypes.string,
  damageMode: CommonPropTypes.damageMode,
  generatePdf: PropTypes.bool,
  inspectionId: PropTypes.string.isRequired,
  onPdfPressed: PropTypes.func,
  onStartNewInspection: PropTypes.func,
  pdfOptions: PropTypes.shape({
    clientName: PropTypes.string.isRequired,
    customer: PropTypes.string.isRequired,
  }),
  vehicleType: CommonPropTypes.vehicleType,
};

DamageReport.defaultProps = {
  currencyCharacter: '€',
  damageMode: DamageMode.ALL,
  generatePdf: false,
  onStartNewInspection: () => { },
  onPdfPressed: () => { },
  pdfOptions: undefined,
  vehicleType: VehicleType.CUV,
};
