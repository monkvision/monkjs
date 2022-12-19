import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { ScrollView, StyleSheet, Switch, Text, useWindowDimensions, View } from 'react-native';
import Actions from '../../actions';

import Thumbnail from '../Thumbnail';

const styles = StyleSheet.create({
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignSelf: 'center',
    color: 'white',
    fontFamily: 'monospace',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 10,
  },
  textExtra: {
    backgroundColor: '#001A83BF',
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
  },
  switchContainer: {
    width: 68,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  switchText: {
    width: '100%',
    textAlign: 'center',
    color: 'white',
  },
  stickyHeader: {
    flex: 1,
    flexWrap: 'nowrap',
    justifyContent: 'center',
    paddingBottom: 15,
  },
  gradient: {
    position: 'absolute',
  },
  footer: {
    marginTop: 8,
  },
});

export default function Sights({
  additionalPictures,
  contentContainerStyle,
  current,
  dispatch,
  footer,
  ids,
  navigationOptions,
  offline,
  takenPictures,
  thumbnailStyle,
  tour,
  uploads,
}) {
  const { i18n, t } = useTranslation();
  const { height: windowHeight } = useWindowDimensions();

  const handlePress = useCallback((id, e) => {
    if (navigationOptions.allowNavigate) {
      e.preventDefault();
      dispatch({ type: Actions.sights.SET_CURRENT_SIGHT, payload: { id } });
    }
  }, [dispatch, navigationOptions.allowNavigate]);

  const scrollViewRef = useRef(null);
  // const handleScrollToNext = (i, rowHeight) => scrollViewRef.current.scrollTo({
  //   y: rowHeight * i,
  //   animated: true,
  // });

  const thumbnails = useMemo(() => {
    const tourElements = Object.values(tour).splice(0, current.index + 1);
    additionalPictures.forEach((additionalPicture) => {
      let spliceIndex = tourElements
        .findIndex((sight) => sight.id === additionalPicture.previousSight) ?? 0;
      while (
        spliceIndex < tourElements.length - 2 && tourElements[spliceIndex + 1].isAdditional
      ) {
        spliceIndex += 1;
      }
      tourElements.splice(spliceIndex, 0, {
        isAdditional: true,
        labelKey: additionalPicture.labelKey,
        picture: additionalPicture.picture,
        mapKey: `thumbnail-${additionalPicture.labelKey}-${spliceIndex}`,
      });
    });
    return tourElements.reverse();
  }, [tour, current, additionalPictures]);

  return (
    <ScrollView
      endFillColor="#000"
      ref={scrollViewRef}
      showsHorizontalScrollIndicator={false}
      stickyHeaderIndices={[0]}
      contentContainerStyle={[contentContainerStyle, { maxHeight: windowHeight }]}
    >
      <View style={styles.stickyHeader}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            {`${current.index + 1} / ${ids.length}`}
          </Text>
        </View>
        { additionalPictures.length > 0 && (
          <View style={styles.textContainer}>
            <Text style={[styles.text, styles.textExtra]}>
              {`+ ${additionalPictures.length} / 10`}
            </Text>
          </View>
        )}
        {offline && (
          <View style={styles.switchContainer}>
            <Switch {...offline} />
            <Text style={styles.switchText}>{offline.text}</Text>
          </View>
        )}
      </View>
      <View>
        {thumbnails.map((thumbnail) => (
          thumbnail.isAdditional ? (
            <Thumbnail
              key={thumbnail.mapKey}
              isCurrent={false}
              label={t(`partSelector.parts.${thumbnail.labelKey}`)}
              picture={thumbnail.picture}
              style={thumbnailStyle}
              // TODO : upload status
            />
          ) : (
            <Thumbnail
              key={`thumbnail-${thumbnail.id}`}
              isCurrent={current.metadata.id === thumbnail.id}
              label={thumbnail.label[i18n.language]}
              overlay={thumbnail.overlay}
              picture={takenPictures[thumbnail.id]}
              onPress={(e) => handlePress(thumbnail.id, e)}
              onClick={(e) => handlePress(thumbnail.id, e)}
              style={thumbnailStyle}
              uploadStatus={uploads.state[thumbnail.id]?.status || 'idle'}
            />
          )
        ))}
        <View style={styles.footer}>{footer}</View>
      </View>
    </ScrollView>
  );
}

Sights.propTypes = {
  additionalPictures: PropTypes.arrayOf({
    previousSight: PropTypes.string.isRequired,
    labelKey: PropTypes.string.isRequired,
    picture: PropTypes.any,
  }),
  contentContainerStyle: PropTypes.objectOf(PropTypes.any),
  current: PropTypes.shape({
    index: PropTypes.number.isRequired,
    metadata: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  footer: PropTypes.element,
  ids: PropTypes.arrayOf(PropTypes.string).isRequired,
  navigationOptions: PropTypes.shape({
    allowNavigate: PropTypes.bool,
    allowRetake: PropTypes.bool,
    allowSkip: PropTypes.bool,
    retakeMaxTry: PropTypes.number,
    retakeMinTry: PropTypes.number,
  }).isRequired,
  offline: PropTypes.objectOf(PropTypes.any),
  takenPictures: PropTypes.objectOf(PropTypes.object),
  thumbnailStyle: PropTypes.objectOf(PropTypes.any),
  tour: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.shape({
      en: PropTypes.string,
      fr: PropTypes.string,
    }),
    overlay: PropTypes.string,
  })).isRequired,
  uploads: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    state: PropTypes.objectOf(PropTypes.shape({
      error: PropTypes.objectOf(PropTypes.any),
      picture: PropTypes.objectOf(PropTypes.any),
      status: PropTypes.oneOf(['idle', 'pending', 'fulfilled', 'rejected']),
      uploadCount: PropTypes.number,
    })),
  }).isRequired,
};

Sights.defaultProps = {
  additionalPictures: [],
  contentContainerStyle: {},
  footer: null,
  offline: null,
  takenPictures: {},
  thumbnailStyle: {},
};
