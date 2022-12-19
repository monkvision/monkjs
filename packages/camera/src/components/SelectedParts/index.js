import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

const styles = StyleSheet.create({
  pill: {
    fontSize: 14,
    color: '#ffffff',
    backgroundColor: '#000000BE',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
    marginLeft: 16,
    textAlign: 'center',
  },
});

export default function SelectedParts({ selectedParts }) {
  const { t } = useTranslation();
  const scrollViewRef = useRef(null);
  const { height: windowHeight } = useWindowDimensions();

  return (
    <ScrollView
      endFillColor="#000"
      ref={scrollViewRef}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[{ maxHeight: windowHeight }]}
    >
      <View>
        {selectedParts.map((part) => (
          <Text style={styles.pill} key={part}>
            {t(`partSelector.parts.${part}`)}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

SelectedParts.propTypes = {
  selectedParts: PropTypes.arrayOf(PropTypes.string),
};

SelectedParts.defaultProps = {
  selectedParts: [],
};
