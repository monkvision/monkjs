import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import noop from 'lodash.noop';
import isEmpty from 'lodash.isempty';

import { utils } from '@monkvision/react-native';
import { spacing } from 'config/theme';

import { View, StyleSheet, Platform } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

const styles = StyleSheet.create({
  root: {
    ...utils.styles.flex,
    width: '100%',
    paddingVertical: spacing(1),
    justifyContent: 'space-between',
    alignItems: 'baseline',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  element: {
    marginHorizontal: spacing(1),
  },
  picker: {
    ...Platform.select({
      web: {
        borderColor: '#FFFFFF',
        cursor: 'pointer',
      },
      android: {
        width: '100%',
        maxWidth: 100 },
    }),
  },
});

export default function Pagination({
  initialLimit, isFetching, limitOptions, onLimitChange, onNext, onPrevious, paging,
}) {
  const { cursors } = paging;

  const [selectedOption, setSelectedOption] = useState(initialLimit);

  const pickerRef = useRef(null);
  const focusPicker = () => pickerRef.current.focus();

  const handleValueChange = (itemValue) => {
    setSelectedOption(itemValue);
    onLimitChange(itemValue);
  };

  return !isEmpty(cursors) && (
    <View style={styles.root}>
      <Button
        disabled={cursors.previous === null}
        style={styles.element}
        onPress={() => onPrevious(cursors.previous)}
      >
        Prev
      </Button>
      <View>
        {Platform.OS === 'android'
          ? <Button onPress={focusPicker}>per page</Button>
          : (
            <Text style={styles.element}>
              {isFetching ? 'Fetching...' : 'Per page'}
            </Text>
          )}
        <Picker
          ref={pickerRef}
          selectedValue={selectedOption}
          onValueChange={handleValueChange}
          style={[styles.element, styles.picker]}
        >
          {limitOptions.map((option) => (
            <Picker.Item key={`pagination-option-${option}`} label={`${option}`} value={option} />
          ))}
        </Picker>
      </View>
      <Button
        disabled={cursors.next === null}
        style={styles.element}
        onPress={() => onNext(cursors.next)}
      >
        Next
      </Button>
    </View>
  );
}

Pagination.propTypes = {
  initialLimit: PropTypes.string,
  isFetching: PropTypes.bool,
  limitOptions: PropTypes.arrayOf(PropTypes.string),
  onLimitChange: PropTypes.func,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
  paging: PropTypes.shape({
    cursors: PropTypes.shape({
      after: PropTypes.string,
      before: PropTypes.string,
      next: PropTypes.shape({
        after: PropTypes.string,
        before: PropTypes.string,
      }),
      previous: PropTypes.shape({
        after: PropTypes.string,
        before: PropTypes.string,
      }),
    }),
  }).isRequired,
};

Pagination.defaultProps = {
  initialLimit: '20',
  isFetching: false,
  limitOptions: ['10', '20', '50', '100'],
  onLimitChange: noop,
  onNext: noop,
  onPrevious: noop,
};
