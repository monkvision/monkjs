import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Animated, TouchableOpacity, Dimensions, Easing, Platform, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import { utils } from '@monkvision/react-native';

const { height } = Dimensions.get('window');
const { spacing } = utils.styles;

const styles = StyleSheet.create({
  card: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    ...Platform.select({
      web: {
        boxShadow: '0px 3px 15px 0px #BABABA',
      },
      native: {
        elevation: 22,
      },
    }),
    paddingVertical: spacing(4),
    height,
    zIndex: 999,
    position: 'relative',
  },
  animatedView: {
    zIndex: 999,
    width: '100%',
    position: 'absolute',
  },
  divider: {
    width: 100,
    height: 4,
    backgroundColor: 'gray',
    borderRadius: 999,
    alignSelf: 'center',
  },
  dividerLayout: {
    height: 60,
    position: 'absolute',
    width: '100%',
    top: spacing(-4),
    paddingTop: spacing(4),
    zIndex: 11,
  },
  children: {
    marginTop: spacing(4),
  },
});

export default function Drawer({ isOpen, handleClose, children, onClose, onOpen }) {
  const [isDisplayed, setIsDisplayed] = useState(false);

  const display = useCallback(() => setIsDisplayed(true), []);
  const hide = useCallback(() => setIsDisplayed(false), []);

  const translateY = useRef(new Animated.Value(height)).current;

  const handleOpenPopup = useCallback(() => {
    display();
    onOpen();
    Animated.spring(translateY, { duration: 150, ease: Easing.ease, toValue: 65, useNativeDriver: Platform.OS !== 'web' })
      .start();
  }, [display, onOpen, translateY]);

  const handleClosePopup = useCallback(() => {
    Animated.timing(translateY, { duration: 150, ease: Easing.ease, toValue: height, useNativeDriver: Platform.OS !== 'web' })
      .start(() => { hide(); onClose(); });
  }, [translateY, hide, onClose]);

  useEffect(() => {
    if (isOpen) { handleOpenPopup(); }
  }, [handleOpenPopup, isOpen]);

  useEffect(() => {
    if (!isOpen) { handleClosePopup(); }
  }, [handleClosePopup, isOpen]);

  if (!isDisplayed) { return null; }
  return (
    <Animated.View style={[styles.animatedView, { transform: [{ translateY }] }]}>
      <Card style={styles.card}>
        <TouchableOpacity
          style={styles.dividerLayout}
          onPress={handleClose}
        >
          <View style={styles.divider} />
        </TouchableOpacity>
        <View style={styles.children}>{children}</View>
      </Card>
    </Animated.View>
  );
}
// 0.65 is the best content view height of the drawer
Drawer.CONTENT_HEIGHT = height * 0.65;
Drawer.Title = Card.Title;
Drawer.Content = Card.Content;
Drawer.Actions = Card.Actions;

Drawer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  handleClose: PropTypes.func,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
};

Drawer.defaultProps = {
  children: [],
  handleClose: noop,
  isOpen: false,
  onClose: noop,
  onOpen: noop,
};
