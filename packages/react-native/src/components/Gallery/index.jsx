import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView, SafeAreaView, Image, Platform } from 'react-native';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    maxWidth: 125,
    overflow: 'visible',
    ...Platform.select({
      native: { flexGrow: 1 },
      default: { width: 125 },
    }),
  },
  scrollView: {
    paddingVertical: 4,
  },
  picture: {
    ...Platform.select({
      native: { width: 80, height: 60, paddingLeft: 16 },
      default: { width: 160, height: 120, borderStyle: 'solid' },
    }),
    margin: 8,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
  },
});

/**
 * @returns {JSX.Element}
 * @constructor
 */
function Gallery({ pictures }) {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {pictures.map(({ id, source }) => (id ? (
          <Image
            key={`picture-${id}-${source.uri}`}
            source={source}
            style={styles.picture}
          />
        ) : null))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default Gallery;

Gallery.propTypes = {
  pictures: PropTypes.arrayOf(PropTypes.shape({
    data: PropTypes.shape({
      uri: PropTypes.string,
    }),
    id: PropTypes.string,
  })),
};

Gallery.defaultProps = {
  pictures: [],
};
