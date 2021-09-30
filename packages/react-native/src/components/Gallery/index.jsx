import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView, SafeAreaView, Image } from 'react-native';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingVertical: 8,
    maxWidth: 134,
  },
  picture: {
    height: 75,
    width: 100,
    marginVertical: 8,
    marginHorizontal: 16,
    borderStyle: 'solid',
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
      <ScrollView persistentScrollbar>
        {pictures.map(({ id, data }) => (id ? (
          <Image
            key={`picture-${id}`}
            source={data.base64}
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
      base64: PropTypes.string,
    }),
    id: PropTypes.string,
  })),
};

Gallery.defaultProps = {
  pictures: [],
};
