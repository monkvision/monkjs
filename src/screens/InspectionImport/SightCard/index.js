import PropTypes from 'prop-types';
import React from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ActivityIndicator, IconButton, useTheme } from 'react-native-paper';
import startCase from 'lodash.startcase';

import { Overlay } from '@monkvision/camera';
import { utils } from '@monkvision/toolkit';

const { spacing } = utils.styles;
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  sightCard: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing(1),
    borderRadius: 22,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1.2,
    margin: 4,
    backgroundColor: 'black',
    ...Platform.select({
      web: {
        width: 170,
        height: 170,
      },
      native: {
        maxWidth: (width * 0.4) + 14,
        maxHeight: (width * 0.4) + 14,
        width: '100%',
        height: '100%',
      },
    }),
  },
  picture: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    marginVertical: 4,
    position: 'absolute',
    zIndex: 0,
    opacity: 0.4,
  },
  reloadButtonLayout: { position: 'absolute', display: 'flex', flexDirection: 'row', zIndex: 11 },
  reloadButton: { backgroundColor: '#FFF', alignSelf: 'center' },
  sightLabel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    textAlign: 'center',
    color: '#FFF',
    zIndex: 20,
    paddingVertical: spacing(1),
    paddingHorizontal: spacing(0.4),
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  sightLabelText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: Platform.OS === 'android' ? 'normal' : '500',
  },
  overlay: {
    height: '100%',
    width: '100%',
  },
});

export default function SightCard({ sight, events }) {
  const { colors } = useTheme();

  const { id, label, uri, isLoading, isFailed, overlay } = sight;

  return (
    <TouchableOpacity
      style={[styles.sightCard, { borderColor: isFailed ? colors.error : colors.primary }]}
      onPress={() => events.handleOpenMediaLibrary(id)}
      disabled={uri}
      accessibilityLabel={label}
    >

      {/* sight label */}
      <View style={[styles.sightLabel, { backgroundColor: colors.primary }]}>
        <Text style={[styles.sightLabelText]}>
          {startCase(label)}
        </Text>
      </View>

      {!uri || (!isLoading && isFailed) ? (
        <View style={styles.reloadButtonLayout}>
          {/* retry button */}
          {!isLoading && isFailed ? (
            <IconButton
              icon="reload"
              size={24}
              onPress={() => events.handleUploadPicture(uri, id)}
              style={styles.reloadButton}
              color={colors.error}
            />
          ) : null}

          {/* add picture button */}
          <IconButton
            icon="plus"
            size={24}
            onPress={() => events.handleOpenMediaLibrary(id)}
            style={styles.reloadButton}
            color={colors.primary}
          />
        </View>
      ) : null}

      {/* sight mask */}
      {!isLoading ? (
        <Overlay
          svg={overlay}
          style={[styles.overlay, { fill: '#000' }]}
          label={label}
        />
      ) : null}

      {/* we can try implementing the new Img conponent here for a smooth image rendering */}
      {uri ? <Image source={{ uri }} style={styles.picture} /> : null}

      {/* loading */}
      {isLoading ? <ActivityIndicator color="#fff" /> : null}

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
    overlay: PropTypes.string,
    uri: PropTypes.string,
  }).isRequired,
};
