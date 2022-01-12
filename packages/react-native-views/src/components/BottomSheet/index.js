import React, { useCallback, useEffect } from 'react';
import { View, Animated, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { Card, Portal } from 'react-native-paper';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import { utils } from '@monkvision/react-native';

import usePanResponder from './usePanResponder';
import useToggle from '../../hooks/useToggle';

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
    paddingBottom: spacing(4),
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
    height: 70,
    position: 'absolute',
    width: '100%',
    paddingTop: spacing(4),
    zIndex: 11,
    ...Platform.select({
      web: {
        cursor: 'grab',
      },
    }),
  },
  children: {
    marginTop: spacing(8),
    paddingVertical: 10,
    overflow: 'visible',
  },
});

export default function BottomSheet({ isOpen, children, onClose, onOpen, lock }) {
  const [isDisplayed, display, hide] = useToggle();
  const { pan, panGesture, animate } = usePanResponder({ onClose, lock });
  const { height } = useWindowDimensions();

  const handleOpenPopup = useCallback(() => {
    display();
    onOpen();
    animate.visible();
  }, [display, onOpen, animate]);

  const handleClosePopup = useCallback(() => animate.hidden(() => { hide(); }),
    [animate, hide]);

  useEffect(() => {
    if (isOpen) { handleOpenPopup(); }
  }, [handleOpenPopup, isOpen]);

  useEffect(() => {
    if (!isOpen) { handleClosePopup(); }
  }, [handleClosePopup, isOpen]);

  if (!isDisplayed) { return null; }

  return (
    <Portal>
      <Animated.View style={[styles.animatedView, { backgroundColor: 'cyan', transform: [{ translateY: pan }] }]}>
        <Card style={[styles.card, { height }]}>

          {/* divider */}
          <View style={styles.dividerLayout} {...panGesture.panHandlers}>
            <View style={styles.divider} />
          </View>

          {/* childrens  */}
          {/* TODO add scrollview */}
          <View style={[styles.children, { height: height * 0.8 - height * 0.01 }]}>
            {children}
          </View>
        </Card>
      </Animated.View>
    </Portal>
  );
}

BottomSheet.Title = Card.Title;
BottomSheet.Content = Card.Content;
BottomSheet.Actions = Card.Actions;

BottomSheet.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  handleClose: PropTypes.func,
  isOpen: PropTypes.bool,
  lock: PropTypes.bool,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
};

BottomSheet.defaultProps = {
  children: [],
  handleClose: noop,
  isOpen: false,
  onClose: noop,
  onOpen: noop,
  lock: false,
};
