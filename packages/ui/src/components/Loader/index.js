import React from 'react';
import { StyleSheet, View } from 'react-native';
import Proptypes from 'prop-types';

import Dots from './dots';
import Texts from './texts';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#fff',
  },
  contentLayout: { width: '60%' },
});

function Loader({ texts, ...props }) {
  return (
    <View style={styles.container}>
      <View style={styles.contentLayout}>
        {texts ? <Texts texts={texts} /> : null}
        <Dots {...props} />
      </View>
    </View>
  );
}

Loader.Dots = Dots;
Loader.Texts = Texts;

Loader.propTypes = {
  borderRadius: Proptypes.number,
  bounceHeight: Proptypes.number,
  colors: Proptypes.arrayOf(Proptypes.string),
  dots: Proptypes.number,
  dotSize: Proptypes.number,
  texts: Proptypes.arrayOf(Proptypes.string),

};
Loader.defaultProps = {
  dots: 4,
  colors: ['#274b9f', '#3261CD', '#84A0E1', '#D6DFF5'],
  dotSize: 20,
  bounceHeight: 20,
  borderRadius: null,
  texts: null,
};

export default Loader;
