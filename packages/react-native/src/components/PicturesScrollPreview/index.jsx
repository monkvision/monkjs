import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';
import isPlainObject from 'lodash.isplainobject';

import { Image, Platform, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Surface, Chip, useTheme, Avatar } from 'react-native-paper';
import { Sight } from '@monkvision/corejs';

import SightsWheel from '../SightsWheel';
import * as sightMasks from '../../assets/sightMasks';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    alignItems: 'center',
    width: 125,
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
  },
  chip: {
    alignSelf: 'center',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '400',
    textTransform: 'capitalize',
  },
  scrollContainer: {
    paddingTop: 166,
    paddingBottom: 16,
    overflow: 'visible',
    paddingHorizontal: 8,
  },
  surface: {
    width: 100,
    height: 100,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    borderRadius: 8,
    padding: 15,
    borderStyle: 'solid',
    borderWidth: 2,
  },
  sightMask: {
    width: 80,
    height: 60,
  },
  picture: {
    width: 100,
    height: 75,
    borderRadius: 8,
    marginVertical: 4,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
  },
});

const PicturesScrollPreview = forwardRef(({
  activeSight,
  pictures,
  showPicture,
  sights,
  sightWheelProps,
}, ref) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={styles.root} ref={ref}>
      <ScrollView
        style={styles.scrollContainer}
        showsHorizontalScrollIndicator={false}
      >
        {sights.map(([id]) => {
          const picture = pictures[id];
          const isImage = isPlainObject(picture) && showPicture === true;
          const isActive = id === activeSight.id;

          const source = isImage ? picture.source : sightMasks[id];

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
            <Surface
              key={id}
              style={[styles.surface, {
                backgroundColor: colors.primary,
                borderColor: isActive ? colors.accent : colors.primary,
              }]}
            >
              {isPlainObject(picture) && (
                <Avatar.Icon
                  size={24}
                  icon="check"
                  style={[styles.badge, { backgroundColor: colors.success }]}
                />
              )}
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
            {...sightWheelProps}
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
  sightWheelProps: PropTypes.objectOf(PropTypes.any),
};

PicturesScrollPreview.defaultProps = {
  activeSight: null,
  showPicture: false,
  sightWheelProps: {},
};

export default PicturesScrollPreview;
