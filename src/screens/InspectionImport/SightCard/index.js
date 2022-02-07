import { spacing } from 'config/theme';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ActivityIndicator, IconButton, useTheme } from 'react-native-paper';
import { sightMasks } from '@monkvision/react-native';
import Drawing from 'components/Drawing';
import vinSvg from '../assets/vin.svg';

const { width } = Dimensions.get('window');
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
    ...Platform.select({
      web: {
        maxWidth: 170,
        maxHeight: 170,
      },
      native: {
        maxWidth: (width * 0.4) + 14,
        maxHeight: (width * 0.4) + 14,
      },
    }),
    width: '100%',
    height: '100%',
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
  reloadButtonLayout: { position: 'absolute', display: 'flex', flexDirection: 'row', zIndex: 11 },
  reloadButton: { backgroundColor: '#FFF', alignSelf: 'center' },
});

const SightMask = ({ id, ...props }) => (sightMasks?.[id] ? sightMasks[id](props) : null);

export default function SightCard({ sight, events }) {
  const { colors } = useTheme();

  const { id, label, uri, isLoading, isFailed } = sight;

  return (
    <TouchableOpacity
      style={[styles.sightCard, {
        borderColor: isFailed ? colors.error : colors.primary,
        borderStyle: uri ? 'solid' : 'dashed',
      }]}
      onPress={() => events.handleOpenMediaLibrary(id)}
      disabled={uri}
      accessibilityLabel={label}
    >

      {/* overlay button */}
      {!isLoading && isFailed ? (
        <View style={styles.reloadButtonLayout}>
          <IconButton
            icon="reload"
            size={24}
            onPress={() => events.handleUploadPicture(uri, id)}
            style={styles.reloadButton}
            color={colors.error}
          />
        </View>
      ) : null}

      {/* overlay button */}
      {!uri ? (
        <View style={styles.reloadButtonLayout}>
          <IconButton
            icon="plus"
            size={24}
            onPress={() => events.handleOpenMediaLibrary(id)}
            style={[styles.reloadButton, { backgroundColor: colors.primary }]}
            color="white"
          />
        </View>
      ) : null}

      {/* sight mask */}
      {!isLoading ? (
        <View style={{ transform: [{ scale: 0.28 }], zIndex: 2, height: 400 }}>
          {id === 'vin' ? <Drawing xml={vinSvg} />
            : <SightMask id={id.charAt(0).toUpperCase() + id.slice(1)} height="400" width="500" color={colors.primary} />}
        </View>
      ) : null}

      {/* we can try implementing the new Img conponent here for a smooth image rendering */}
      {uri
        ? <Image source={{ uri }} style={styles.picture} />
        : null}

      {/* loading */}
      {isLoading ? <ActivityIndicator color={isFailed ? colors.error : colors.primary} /> : null}

    </TouchableOpacity>
  );
}

SightCard.propTypes = {
  events: PropTypes.shape({
    handleOpenMediaLibrary: PropTypes.func,
    handleUploadPicture: PropTypes.func,
  }).isRequired,
  sight: PropTypes.shape({
    id: PropTypes.string,
    isFailed: PropTypes.bool,
    isLoading: PropTypes.bool,
    isUploaded: PropTypes.bool,
    label: PropTypes.string,
    uri: PropTypes.string,
  }).isRequired,
};
