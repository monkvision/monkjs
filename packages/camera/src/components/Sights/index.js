import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { StyleSheet, ScrollView, Text, Switch, View, useWindowDimensions } from 'react-native';

import Thumbnail from '../Thumbnail';
import Actions from '../../actions';

const styles = StyleSheet.create({
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 68,
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
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
  },
  gradient: {
    position: 'absolute',
  },
  footer: {
    marginTop: 8,
  },
});

export default function Sights({
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
  const { i18n } = useTranslation();
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
        {offline && (
          <View style={styles.switchContainer}>
            <Switch {...offline} />
            <Text style={styles.switchText}>{offline.text}</Text>
          </View>
        )}
      </View>
      <View>
        {Object.values(tour)
          .splice(0, current.index + 1)
          .reverse()
          .map(({ id, label, overlay }) => (
            <Thumbnail
              key={`thumbnail-${id}`}
              isCurrent={current.metadata.id === id}
              label={label[i18n.language]}
              overlay={overlay}
              picture={takenPictures[id]}
              onPress={(e) => handlePress(id, e)}
              onClick={(e) => handlePress(id, e)}
              style={thumbnailStyle}
              uploadStatus={uploads.state[id]?.status || 'idle'}
            />
          ))}
        <View style={styles.footer}>{footer}</View>
      </View>
    </ScrollView>
  );
}

Sights.propTypes = {
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
  contentContainerStyle: {},
  footer: null,
  offline: null,
  takenPictures: {},
  thumbnailStyle: {},
};
