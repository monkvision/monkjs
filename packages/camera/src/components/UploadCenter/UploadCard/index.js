import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { utils } from '@monkvision/toolkit';
import texts from './texts';

const { spacing } = utils.styles;

const styles = StyleSheet.create({
  upload: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 100,
    padding: spacing(1),
    marginVertical: spacing(0.4),
    borderRadius: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
    position: 'absolute',
  },
  imageLayout: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: spacing(2),
    position: 'relative',
    justifyContent: 'center',
  },
  imageOverlay: {
    width: 80,
    height: 80,
    position: 'absolute',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  textsLayout: {
    flexGrow: 1,
    flex: 1,
  },
  title: {
    textTransform: 'capitalize',
  },
  subtitle: {
    color: 'gray',
    fontWeight: '500',
    fontSize: 12,
    marginVertical: spacing(0.6),
  },
  activityIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 10,
  },
  retakeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});

const UNKNOWN_SIGHT_REASON = 'UNKNOWN_SIGHT--unknown sight';

function UploadCard({ compliance, id, label, onRetake, onReupload, picture, upload }) {
  const { uri } = picture;
  const errorColor = 'rgba(255, 69, 0, 0.4)';
  const warningColor = 'rgba(255, 152, 0, 0.4)';
  const loadingColor = 'rgba(211, 211, 211, 0.4)';

  const isPending = useMemo(() => (
    upload.status === 'pending'
    || (upload.status === 'fulfilled' && compliance.status === 'pending')
  ), [compliance, upload]);

  const title = useMemo(() => (isPending ? ' - Pending...' : ''), [isPending]);

  const subtitle = useMemo(() => {
    if (isPending) { return ``; }
    if (upload.error) { return `We couldn't upload this image, please retake`; }

    if (compliance.result) {
      const {
        image_quality_assessment: iqa,
        coverage_360: carCov,
      } = compliance.result.data.compliances;

      const badQuality = iqa && !iqa.is_compliant;
      const badCoverage = carCov && !carCov.is_compliant;

      const reasons = [];

      if (badQuality && iqa.reasons) {
        iqa.reasons.forEach((reason, index) => {
          const first = index === 0;
          reasons.push(first ? texts[reason] : `and ${texts[reason]}`);
        });
      }

      if (badCoverage && carCov.reasons) {
        carCov.reasons.forEach((reason, index) => {
          const first = index === 0 && !badQuality;
          // display all reasons expect `UNKNOWN_SIGHT`
          if (reason !== UNKNOWN_SIGHT_REASON) { reasons.push(first ? texts[reason] : `and ${texts[reason]}`); }
        });
      }

      if (reasons.length > 0) {
        return `This image ${reasons.join(' ')}`;
      }
    }

    return '';
  }, [compliance.result, isPending, upload.error]);

  const handleRetake = useCallback((e) => {
    e.preventDefault();
    onRetake(id);
  }, [id, onRetake]);

  const handleReupload = useCallback((e) => {
    e.preventDefault();
    onReupload(id, picture);
  }, [id, onReupload, picture]);

  return (
    <View style={styles.upload}>
      {/* preview image with a loading indicator */}
      {isPending ? (
        <View style={styles.imageLayout}>
          <View style={[styles.imageOverlay, { backgroundColor: loadingColor }]}>
            <ActivityIndicator style={styles.activityIndicator} color="#FFF" />
          </View>
          <Image style={styles.image} source={{ uri }} />
        </View>
      ) : (
        <TouchableOpacity
          style={styles.imageLayout}
          onPress={upload.error ? handleReupload : handleRetake}
        >
          <View style={[
            styles.imageOverlay,
            { backgroundColor: upload.error ? errorColor : warningColor },
          ]}
          >
            <MaterialCommunityIcons name="camera-retake" size={24} color="#FFF" />
            <Text style={styles.retakeText}>{upload.error ? 'Reupload picture' : 'Retake picture'}</Text>
          </View>
          <Image style={styles.image} source={{ uri }} />
        </TouchableOpacity>
      )}

      {/* text indicating the status of uploading and the non-compliance reasons */}
      <View style={[styles.textsLayout, { flexDirection: 'row' }]}>
        <View style={styles.textsLayout}>
          <Text style={styles.title}>{`${label}${title}`}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
    </View>
  );
}

UploadCard.propTypes = {
  compliance: PropTypes.shape({
    error: PropTypes.string,
    result: PropTypes.shape({
      data: PropTypes.shape({
        compliances: PropTypes.shape({
          coverage_360: PropTypes.shape({
            is_compliant: PropTypes.bool,
            reasons: PropTypes.arrayOf(PropTypes.string),
            status: PropTypes.string,
          }),
          image_quality_assessment: PropTypes.shape({
            is_compliant: PropTypes.bool,
            reasons: PropTypes.arrayOf(PropTypes.string),
            status: PropTypes.string,
          }),
        }),
      }),
    }),
    status: PropTypes.string,
  }).isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onRetake: PropTypes.func,
  onReupload: PropTypes.func,
  picture: PropTypes.shape({
    uri: PropTypes.string,
  }).isRequired,
  upload: PropTypes.shape({
    error: PropTypes.string,
    picture: PropTypes.shape({ uri: PropTypes.string }),
    status: PropTypes.string,
  }).isRequired,
};

UploadCard.defaultProps = {
  onRetake: () => {},
  onReupload: () => {},
};
export default UploadCard;
