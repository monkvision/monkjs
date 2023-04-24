import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    flexDirection: 'row',
  },
  element: {
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#72768B',
    borderRightColor: 'transparent',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  firstElement: {
    borderRadius: 0,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderRightWidth: 0,
  },
  lastElement: {
    borderRadius: 0,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderRightColor: '#72768B',
  },
});

function TabGroup({ children }) {
  const totalChildren = React.Children.count(children);

  return (
    <View style={[styles.container]}>
      {
        React.Children.map(children, (child, index) => (
          <View
            style={[
              styles.element,
              index === 0 && styles.firstElement,
              index === (totalChildren - 1) && styles.lastElement,
            ]}
          >
            { React.cloneElement(child) }
          </View>
        ))
      }
    </View>
  );
}

TabGroup.propTypes = {
  children: PropTypes.array,
};
TabGroup.defaultProps = {
  children: [],
};

export default TabGroup;
