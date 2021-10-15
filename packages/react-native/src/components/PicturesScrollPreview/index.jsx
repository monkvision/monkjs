import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';
import isPlainObject from 'lodash.isplainobject';

import { Image, Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Surface, Chip, useTheme, Badge } from 'react-native-paper';
import { Sight } from '@monkvision/corejs';

import SightsWheel from '../SightsWheel';
import * as sightMasks from '../../assets/sightMasks';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    width: 116,
    ...Platform.select({
      native: { height: '100%' },
      default: { height: '100vh' },
    }),
  },
  topView: {
    display: 'flex',
    alignItems: 'center',
    width: 125,
    position: 'absolute',
    marginVertical: 8,
    marginHorizontal: 4,
  },
  chip: {
    alignSelf: 'center',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '400',
  },
  scrollContainer: {
    paddingTop: 166,
    paddingBottom: 16,
  },
  surface: {
    width: 100,
    height: 100,
    marginHorizontal: 12.5,
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    borderRadius: 8,
    padding: 15,
  },
  sightMask: {
    width: 80,
    height: 60,
  },
  picture: {
    width: 100,
    height: 75,
    borderRadius: 8,
    marginHorizontal: 12.5,
    marginVertical: 4,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

const PicturesScrollPreview = forwardRef(({
  activeSight,
  pictures,
  showPicture,
  sights,
}, ref) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={styles.root} ref={ref}>
      <ScrollView style={styles.scrollContainer}>
        {sights.map(([id]) => {
          const picture = pictures[id];
          const isImage = isPlainObject(picture) && showPicture === true;
          const source = isImage
            ? picture.source
            : sightMasks[id];

          if (isImage) {
            return (
              <Image
                key={`picture-${id}`}
                source={source}
                style={styles.picture}
              />
            );
          }

          return (
            <Surface key={id} style={[styles.surface, { backgroundColor: colors.primary }]}>
              <Badge
                visible={isPlainObject(picture)}
                style={[styles.badge, { backgroundColor: colors.success }]}
              >
                ✔️
              </Badge>
              <Image
                key={`picture-${id}`}
                source={source}
                style={styles.sightMask}
              />
            </Surface>
          );
        })}
      </ScrollView>
      {(activeSight !== null && !isEmpty(activeSight.label)) && (
        <View style={styles.topView}>
          <SightsWheel
            sights={sights.map((s) => new Sight(...s))}
            filledSightIds={Object.keys(pictures)}
            activeSightId={activeSight.id}
          />
          <Chip
            style={[styles.chip, { backgroundColor: colors.accent }]}
            textStyle={styles.chipText}
          >
            {activeSight.label}
          </Chip>
        </View>
      )}
    </SafeAreaView>
  );
});

PicturesScrollPreview.propTypes = {
  activeSight: PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
  }),
  pictures: PropTypes.objectOf(PropTypes.object).isRequired,
  showPicture: PropTypes.bool,
  sights: PropTypes.arrayOf(PropTypes.array).isRequired,
};

PicturesScrollPreview.defaultProps = {
  activeSight: null,
  showPicture: false,
};

export default PicturesScrollPreview;
