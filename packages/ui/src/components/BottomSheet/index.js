import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Animated, Platform, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import { Card, Portal } from 'react-native-paper';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

import { utils, useOrientation, useToggle } from '@monkvision/toolkit';

import usePanResponder from './usePanResponder';

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
    position: 'relative',
  },
  animatedView: {
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
    zIndex: 201,
    ...Platform.select({
      web: {
        cursor: 'grab',
      },
    }),
  },
  scrollview: {
    height: '100%',
    overflow: 'visible',
  },
  container: {
    marginTop: spacing(8),
    paddingVertical: 10,
    overflow: 'hidden',
    height: '200%',
  },
  layout: {
    position: 'absolute',
    zIndex: 100,
    width: '100%',
  },
  animatedViewContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
});

function BottomSheet({ isOpen, children, onClose, onOpen, lock, overlay: Overlay, ...props }) {
  const [isDisplayed, display, hide] = useToggle();
  const { height } = useWindowDimensions();
  const [orientation] = useOrientation();

  const [contentHeight, setContentHeight] = useState(null);
  const { pan, panGesture, animate } = usePanResponder({ onClose, lock });

  const scrollHeightHolder = useMemo(() => {
    // we check if the contentHeight is set or not yet,
    // if yes we return the contentHeight + 100px to handle large screens
    if (contentHeight) { return contentHeight + 100; }

    // else if the orientation is portrait we return the
    // full height + 30% of it (this can make the scroll longer than the content)
    if (orientation === 1) { return height + height * 0.3; }

    // else just give two times the height (this also can make the scroll longer than the content)
    return height * 2;
  }, [contentHeight, orientation, height]);

  const handleOpenPopup = useCallback(() => {
    // make the bottomsheet accessible in the viewport
    display();

    // trigger the onOpen callback
    onOpen();

    // and animate the bottomsheet to the bottom
    animate.visible();
  }, [display, onOpen, animate]);

  // animate the bottomsheet to the bottom, and when the animation finish,
  // then hide the bottomsheet from the viewport
  const handleClosePopup = useCallback(() => animate.hidden(() => { hide(); }),
    [animate, hide]);

  useEffect(() => {
    // trigger open bottomsheet
    if (isOpen) { handleOpenPopup(); }
  }, [handleOpenPopup, isOpen]);

  useEffect(() => {
    // trigger close bottomsheet
    if (!isOpen) { handleClosePopup(); }
  }, [handleClosePopup, isOpen]);

  if (!isDisplayed) { return null; }

  return (
    <Portal>
      <View style={styles.layout}>
        <Overlay />
        <View style={[styles.animatedViewContainer, { height }]}>
          <Animated.View style={[styles.animatedView, { transform: [{ translateY: pan }] }]}>
            <Card style={[styles.card, { height }]}>

              {/* divider */}
              <View style={styles.dividerLayout} {...panGesture.panHandlers}>
                <View style={styles.divider} />
              </View>

              {/* the container hold the whole layout height */}
              <View style={styles.container}>

                {/* the following view is just keeping the scrollview in the viewport and not
            overflow  */}
                <View style={{ height: height - 150 }}>
                  <ScrollView style={styles.scrollview} {...props}>
                    <View style={{ height: scrollHeightHolder }}>

                      {/* we wrap a normal view without any style just to make it more natural
                  for the content */}
                      <View onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}>
                        {children}
                      </View>
                    </View>
                  </ScrollView>
                </View>
              </View>
            </Card>
          </Animated.View>
        </View>
      </View>
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
  overlay: PropTypes.func,
};

BottomSheet.defaultProps = {
  children: [],
  handleClose: noop,
  isOpen: false,
  onClose: noop,
  onOpen: noop,
  lock: false,
  overlay: () => <></>,
};

export default BottomSheet;
