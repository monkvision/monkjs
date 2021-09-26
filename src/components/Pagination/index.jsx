import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { spacing } from 'config/theme';
import { Button, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import utils from 'components/utils';
import useOk from 'hooks/useOk';
import noop from 'lodash.noop';

const styles = StyleSheet.create({
  root: {
    ...utils.styles.flex,
    width: '100%',
    paddingVertical: spacing(1),
    justifyContent: 'space-between',
  },
  viewCenter: {
    ...utils.styles.flex,
  },
  element: {
    marginHorizontal: spacing(1),
  },
});

export default function Pagination({
  initialLimit, isFetching, limitOptions, onLimitChange, onNext, onPrevious, paging,
}) {
  const { cursors } = paging;
  const ok = useOk(cursors);

  const [selectedOption, setSelectedOption] = useState(initialLimit);

  const handleValueChange = (itemValue) => {
    setSelectedOption(itemValue);
    onLimitChange(itemValue);
  };

  const handleNext = useCallback(() => {
    if (ok) {
      onNext(cursors.next);
    }
  }, [cursors, ok, onNext]);

  const handPrevious = useCallback(() => {
    if (ok) {
      onNext(cursors.previous);
    }
  }, [cursors, ok, onNext]);

  return ok && (
    <View style={styles.root}>
      <Button
        disabled={cursors.previous === null}
        style={styles.element}
        onPress={handPrevious}
      >
        Previous
      </Button>
      <View style={styles.viewCenter}>
        <Text style={styles.element}>
          {isFetching ? 'Fetching...' : 'Items per row'}
        </Text>
        <Picker
          selectedValue={selectedOption}
          onValueChange={handleValueChange}
          style={styles.element}
        >
          {limitOptions.map((option) => (
            <Picker.Item label={option} value={option} />
          ))}
        </Picker>
      </View>
      <Button
        disabled={cursors.next === null}
        style={styles.element}
        onPress={handleNext}
      >
        Next
      </Button>
    </View>
  );
}

Pagination.propTypes = {
  initialLimit: PropTypes.number,
  isFetching: PropTypes.bool,
  limitOptions: PropTypes.arrayOf(PropTypes.number),
  onLimitChange: PropTypes.func,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
  paging: PropTypes.shape({
    cursors: {
      after: PropTypes.string,
      before: PropTypes.string,
      next: {
        after: PropTypes.string,
        before: PropTypes.string,
        limit: PropTypes.number,
        pagination_order: PropTypes.oneOf(['asc', 'desc']),
      },
      previous: {
        after: PropTypes.string,
        before: PropTypes.string,
        limit: PropTypes.number,
        pagination_order: PropTypes.oneOf(['asc', 'desc']),
      },
    },
  }).isRequired,
};

Pagination.defaultProps = {
  initialLimit: 20,
  isFetching: false,
  limitOptions: [10, 20, 50, 100],
  onLimitChange: noop,
  onNext: noop,
  onPrevious: noop,
};
