import React from 'react';
import PropTypes from 'prop-types';
import { propTypes, sightMasks, utils } from '@monkvision/react-native';
import { Image, View, StyleSheet } from 'react-native';
import { ActivityIndicator, withTheme } from 'react-native-paper';

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
    // backgroundColor: '#F1F3F4',
    margin: 4,
    width: 180,
    height: 180,
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
});

const SightMask = ({ id, ...props }) => (sightMasks?.[id] ? sightMasks[id](props) : null);

function Thumbnail({ theme, complianceStatus, image, isUploading, metadata, uploadStatus }) {
  const { colors } = theme;
  const { id, uri } = metadata.sight;

  console.log({ complianceStatus, image, isUploading, uploadStatus });
  return (
    <View
      style={[styles.sightCard, {
        borderColor: uploadStatus === 'rejected' ? colors.error : colors.primary,
      }]}
    >

      {/* sight mask */}
      <View style={{ transform: [{ scale: 0.28 }], zIndex: 2, height: 400 }}>
        <SightMask id={id.charAt(0).toUpperCase() + id.slice(1)} height="400" width="500" color={colors.primary} />
      </View>

      {/* we can try implementing the new Img conponent here for a smooth image rendering */}
      {uri
        ? <Image source={{ uri }} style={styles.picture} />
        : null}

      {/* loading */}
      {uploadStatus === 'pending' ? <ActivityIndicator style={styles.loading} color={uploadStatus === 'rejected' ? colors.error : colors.primary} /> : null}
    </View>
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
  uploadStatus: PropTypes.oneOf(['pending', 'fulfilled', 'rejected']),
};
Thumbnail.defaultProps = {
  complianceStatus: { hasBlur: false, isOverExposed: false, isUnderExposed: false },
  isUploading: PropTypes.bool,
  uploadStatus: 'pending',
};
export default withTheme(Thumbnail);
