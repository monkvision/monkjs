import React from 'react';
import { ScrollView, Text, View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { utils } from '@monkvision/toolkit';

import UploadCard from './UploadCard';

const { spacing } = utils.styles;
const ROW_HEIGHT = 110;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
  },
  title: {
    marginLeft: spacing(3),
    marginBottom: spacing(0.3),
    marginTop: spacing(2),
    fontWeight: '500',
    fontSize: 20,
  },
  subtitle: {
    marginLeft: spacing(3),
    marginBottom: spacing(2),
    marginTop: spacing(0.6),
    color: 'gray',
    fontWeight: '500',
    fontSize: 12,
  },
  content: {
    marginHorizontal: spacing(2),
  },
  button: {
    backgroundColor: '#274b9f',
    width: '100%',
    borderRadius: 4,
    padding: spacing(1.4),
    marginVertical: spacing(3),
  },
  labelStyle: {
    color: '#FFF',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default function UploadCenter({ uploads, onSubmit }) {
  const uploadsList = Object.values(uploads.state);

  return (
    <SafeAreaView>
      <View style={styles.card}>
        <Text style={styles.title}>
          All uploads
        </Text>
        <Text style={styles.subtitle}>
          Use high image quality, for an accurate result
        </Text>
        <View style={styles.content}>
          <ScrollView>
            <View style={{ height: 10 * ROW_HEIGHT }}>
              {uploadsList.map(({ picture, error, id, status }) => (
                <UploadCard uri={picture.uri} hasError={error} key={id} status={status} />
              ))}
              <TouchableOpacity
                style={styles.button}
                onPress={onSubmit}
              >
                <Text style={styles.labelStyle}>START INSPECTION</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

UploadCenter.propTypes = {
  onSubmit: PropTypes.func,
  uploads: PropTypes.objectOf(PropTypes.any),
};

UploadCenter.defaultProps = {
  uploads: {},
  onSubmit: () => {},
};
