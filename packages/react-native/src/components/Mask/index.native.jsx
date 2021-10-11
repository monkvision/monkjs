import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import xml2js from 'react-native-xml2js';
import { SvgXml } from 'react-native-svg';
import { StyleSheet, View, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
});

export default function Mask({ alt, xml, ...props }) {
  const windowHeight = Dimensions.get('window').height;
  const [svgSizes, setSvgSizes] = useState({ height: windowHeight });

  useEffect(() => {
    xml2js.parseString(xml, (e, result) => {
      setSvgSizes({
        height: Math.floor(windowHeight),
        width: Math.floor((result.svg.$.width / result.svg.$.height) * windowHeight),
      });
    });
  }, [windowHeight, xml]);

  return (
    <View style={styles.root}>
      <SvgXml xml={xml} alt={alt} {...svgSizes} {...props} />
    </View>
  );
}

Mask.propTypes = {
  alt: PropTypes.string.isRequired,
  xml: PropTypes.string.isRequired,
};
