import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { IconButton } from '../common';

const styles = StyleSheet.create({
  container: {
    border: '1px solid #a29e9e',
    borderRadius: 8,
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...Platform.select({
      web: {
        padding: '10px'
      },
      native: {
        pospaddingition: 10
      }
    })
  },
  title: {
    color: '#fafafa',
    fontSize: 18,
  },
});

function Accordion({ title, isCollapsed, children, onPress }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <IconButton
            icon={isCollapsed ? 'add' : 'remove'}
            color="#fafafa"
            onPress={onPress}
          />
        </View>
      </TouchableOpacity>
      {
        !isCollapsed && children
      }
    </View>
  );
}

Accordion.propTypes = {
  children: PropTypes.element,
  isCollapsed: PropTypes.bool,
  onPress: PropTypes.func,
  title: PropTypes.string,
};

Accordion.defaultProps = {
  title: '',
  isCollapsed: false,
  children: null,
  onPress: () => { },
};

export default Accordion;
