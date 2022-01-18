import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { propTypes, sightMasks, utils } from '@monkvision/react-native';
import { Image, View, StyleSheet } from 'react-native';
import { ActivityIndicator, useTheme, IconButton } from 'react-native-paper';
import isEmpty from 'lodash.isempty';

import useToggle from '../../hooks/useToggle';
import ComplianceModal from './ComplianceModal';

const { spacing } = utils.styles;
const styles = StyleSheet.create({
  sightCard: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing(1),
    borderRadius: 22,
    position: 'relative',
    borderWidth: 1.2,
    margin: 4,
    width: 100,
    height: 100,
  },
  picture: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    marginVertical: 4,
    position: 'absolute',
    zIndex: 0,
    opacity: 0.2,
  },
  loading: {
    position: 'absolute',
    alignSelf: 'center',
  },
  reloadButtonLayout: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    zIndex: 11,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayButton: {
    backgroundColor: '#FFF',
    margin: spacing(1),
  },
});

const SightMask = ({ id, ...props }) => (sightMasks?.[id] ? sightMasks[id](props) : null);

const colorsVariant = (colors) => ({
  rejected: colors.error,
  pending: colors.primary,
  fulfilled: colors.primary,
});

function useCompliance(complianceStatus) {
  const [isOpen, handleOpen, handleDismiss] = useToggle();

  const issues = useMemo(
    () => Object.keys(complianceStatus).filter(
      (key) => !!complianceStatus[key],
    ), [complianceStatus],
  );

  const isNotCompliant = useMemo(() => !isEmpty(issues), [issues]);

  return { isNotCompliant, issues, modal: { isOpen, handleOpen, handleDismiss } };
}

function Thumbnail({ complianceStatus, image, isUploading, metadata, uploadStatus }) {
  const { colors } = useTheme();
  const { id } = metadata.sight;

  const compliance = useCompliance(complianceStatus);

  const isFailed = uploadStatus === 'rejected';
  const isPending = uploadStatus === 'pending' || isUploading;

  return (
    <>
      <ComplianceModal
        visible={compliance.modal.isOpen}
        complianceIssues={compliance.issues}
        onDismiss={compliance.modal.handleDismiss}
      />
      <View style={[styles.sightCard, { borderColor: colorsVariant(colors)[uploadStatus] }]}>
        <View style={styles.reloadButtonLayout}>

          {/* compliance button */}
          {compliance.isNotCompliant ? (
            <IconButton
              icon="information-outline"
              size={24}
              onPress={compliance.modal.handleOpen}
              style={styles.overlayButton}
              color={colors.info}
            />
          ) : null}

          {/* reload button */}
          {!isPending && isFailed ? (
            <IconButton
              icon="reload"
              size={24}
              onPress={() => null}
              style={styles.overlayButton}
              color={colors.error}
            />
          ) : null}

        </View>

        {/* sight mask */}
        {!isPending ? (
          <View style={{ transform: [{ scale: 0.19 }], zIndex: 2, height: 400 }}>
            <SightMask
              id={id.charAt(0).toUpperCase() + id.slice(1)}
              height="400"
              width="500"
              color={colorsVariant(colors)[uploadStatus]}
            />
          </View>
        ) : null}

        {/* we can try implementing the new Img component here for a smooth image rendering */}
        {image ? <Image {...image} style={styles.picture} /> : null}

        {/* loading */}
        {isPending ? (
          <ActivityIndicator
            style={styles.loading}
            color={uploadStatus === 'rejected' ? colors.error : colors.primary}
          />
        ) : null}

      </View>
    </>
  );
}

Thumbnail.propTypes = {
  complianceStatus: PropTypes.shape({
    hasBlur: PropTypes.bool,
    isOverExposed: PropTypes.bool,
    isUnderExposed: PropTypes.bool,
  }),
  image: PropTypes.shape({
    height: PropTypes.number,
    source: PropTypes.string,
    width: PropTypes.number,
  }).isRequired,
  isUploading: PropTypes.bool,
  metadata: PropTypes.shape({ sight: propTypes.sight }).isRequired,
  uploadStatus: PropTypes.oneOf(['idle', 'pending', 'fulfilled', 'rejected']),
};

Thumbnail.defaultProps = {
  complianceStatus: { hasBlur: false, isOverExposed: false, isUnderExposed: false },
  isUploading: PropTypes.bool,
  uploadStatus: 'idle',
};

export default Thumbnail;
