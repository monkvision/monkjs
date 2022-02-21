import React, { useMemo } from 'react';
import { ScrollView, Text, View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { utils } from '@monkvision/toolkit';

import UploadCard from './UploadCard';

const { spacing } = utils.styles;

const ROW_HEIGHT = 150;

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
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  button: {
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
  const { hasPending, uploadsList } = useMemo(() => {
    const list = Object.values(uploads.state);
    const hasLoading = list.some((upload) => upload.status === 'pending');

    return { uploadsList: list, hasPending: hasLoading };
  }, [uploads.state]);

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
          <ScrollView style={{ height: 'auto' }} contentContainerStyle={{ height: uploadsList.length * ROW_HEIGHT }}>
            {uploadsList.map(({ picture, error, id, status }) => (
              <UploadCard uri={picture.uri} hasError={error} key={id} status={status} />
            ))}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: hasPending ? '#a9a9a9' : '#274b9f' }]}
              onPress={onSubmit}
              disabled={hasPending}
            >
              <Text style={styles.labelStyle}>START INSPECTION</Text>
            </TouchableOpacity>
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
