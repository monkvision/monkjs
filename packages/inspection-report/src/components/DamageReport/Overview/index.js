import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View, Platform } from 'react-native';

import { CarOrientation, CommonPropTypes, DamageMode, VehicleType } from '../../../resources';
import CarView360 from '../../CarView360';
import CarView360Handles from '../../CarView360/CarView360Handles';
import { useCarOrientation } from '../../CarView360/hooks';
import { PdfStatus } from '../hooks';
import DamageCounts from './DamageCounts';
import { useDamageCounts } from './hooks';

const styles = StyleSheet.create({
  container: {},
  subContainer: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carViewContainer: {
    paddingVertical: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewViewContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  buttonsContainer: {
    marginTop: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  button: {
    borderRadius: 9999,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#67A5B3',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  pdfStatus: {
    color: '#FFFFFF',
    fontSize: 16,
    paddingTop: 16,
  },
});

const PdfStatusMessages = {
  [PdfStatus.REQUESTED]: 'damageReport.pdfStatus.generating',
  [PdfStatus.READY]: 'damageReport.pdfStatus.ready',
  [PdfStatus.ERROR]: 'damageReport.pdfStatus.error',
};

export default function Overview({
  damages,
  damageMode,
  vehicleType,
  onPressPart,
  onPressPill,
  generatePdf,
  isInspectionCompleted,
  onValidateInspection,
  pdfHandles: { pdfStatus, handleDownload },
  onStartNewInspection,
}) {
  const { width, height } = useWindowDimensions();
  const {
    orientation,
    rotateLeft,
    rotateRight,
    setOrientation,
  } = useCarOrientation(CarOrientation.FRONT_LEFT);
  const damageCounts = useDamageCounts(damages);
  const { t } = useTranslation();

  const pdfBtnDisabledState = useMemo(() => {
    switch (pdfStatus) {
      case PdfStatus.READY:
        return false;
      default:
        return true;
    }
  }, [pdfStatus]);

  const pdfButtonColor = useMemo(() => {
    switch (pdfStatus) {
      case PdfStatus.READY:
        return '#67A5B3';
      case PdfStatus.ERROR:
        return '#804c4c';
      default:
        return '#4c6065';
    }
  }, [pdfStatus]);

  return (
    <View style={[styles.container]}>
      <DamageCounts damageMode={damageMode} counts={damageCounts} />
      <View style={[styles.carViewContainer]}>
        <View style={[Platform.OS === 'web' ? styles.carViewContainer : styles.overviewViewContainer, {
          ...Platform.select({
            native: { width: width - 40, height: height / 3.0 },
          }),
        }]}
        >
          <CarView360
            damages={damages}
            vehicleType={vehicleType}
            orientation={orientation}
            width={width - 40}
            onPressPart={onPressPart}
            onPressPill={onPressPill}
          />
        </View>
        <CarView360Handles
          orientation={orientation}
          onRotateLeft={rotateLeft}
          onRotateRight={rotateRight}
          onSelectOrientation={setOrientation}
        />
        <View style={[styles.buttonsContainer]}>
          {isInspectionCompleted ? (
            <>
              <TouchableOpacity
                style={[styles.button]}
                onPress={onStartNewInspection}
              >
                <Text style={[styles.buttonText]}>{ t('damageReport.newInspection') }</Text>
              </TouchableOpacity>
              {generatePdf && (
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor: pdfButtonColor,
                      paddingHorizontal: pdfBtnDisabledState ? 65 : 20,
                    },
                  ]}
                  onPress={handleDownload}
                  disabled={pdfBtnDisabledState}
                >
                  {
                    pdfBtnDisabledState
                      ? <ActivityIndicator size="small" color="white" />
                      : <Text style={[styles.buttonText]}>{ t('damageReport.download') }</Text>
                  }
                </TouchableOpacity>
              )}
            </>
          ) : (
            <TouchableOpacity
              style={[styles.button]}
              onPress={onValidateInspection}
            >
              <Text style={[styles.buttonText]}>{ t('damageReport.validate') }</Text>
            </TouchableOpacity>
          )}
        </View>
        {[PdfStatus.REQUESTED, PdfStatus.READY, PdfStatus.ERROR].includes(pdfStatus) && (
          <Text style={[styles.pdfStatus]}>{ t(PdfStatusMessages[pdfStatus]) }</Text>
        )}
      </View>
    </View>
  );
}

Overview.propTypes = {
  damageMode: CommonPropTypes.damageMode,
  damages: PropTypes.arrayOf(CommonPropTypes.damage),
  generatePdf: PropTypes.bool,
  isInspectionCompleted: PropTypes.bool,
  onPressPart: PropTypes.func,
  onPressPill: PropTypes.func,
  onStartNewInspection: PropTypes.func,
  onValidateInspection: PropTypes.func,
  pdfHandles: PropTypes.shape({
    handleDownload: PropTypes.func.isRequired,
    pdfStatus: PropTypes.oneOf(Object.values(PdfStatus)).isRequired,
  }).isRequired,
  vehicleType: CommonPropTypes.vehicleType,
};

Overview.defaultProps = {
  damageMode: DamageMode.ALL,
  damages: [],
  generatePdf: false,
  isInspectionCompleted: false,
  onPressPart: () => {},
  onPressPill: () => {},
  onStartNewInspection: () => {},
  onValidateInspection: () => {},
  vehicleType: VehicleType.CUV,
};
