import React, { useRef } from 'react';

import noop from 'lodash.noop';
import PropTypes from 'prop-types';

import Components, { propTypes } from '@monkvision/react-native';

import { View, Platform, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { FAB, Snackbar, Text, useTheme, Modal } from 'react-native-paper';

import ActivityIndicatorView from '../ActivityIndicatorView';
import AdvicesView from '../AdvicesView';

import styles from './styles';

const SIDEBAR_WIDTH = 250;
const makeRatio = (width, height) => `${width / 240}:${height / 240}`;
const { height, width } = Dimensions.get('window');

export default function MobileBrowserView({
  sights,
  activeSight,
  pictures,
  handleCameraReady,
  fakeActivity,
  camera,
  visibleSnack,
  handleShowAdvice,
  handleTakePicture,
  toggleSnackBar,
  visibleAdvices,
  hideAdvices,
  handleDismissSnackBar,
  handleCloseCamera,
}) {
  // STATE TO PROPS
  const scrollRef = useRef();

  // UI
  const { colors } = useTheme();

  const [measures, setMeasures] = React.useState({ width: null, height: null });

  // ORIENTATION
  const ref = React.useRef(null);
  const sidebarRef = React.useRef(null);
  React.useEffect(() => {
    ref.current.setNativeProps({
      style: {
        transform: [{ rotate: '90deg' }],
      },
    });
    scrollRef.current.setNativeProps({
      style: {
        height: '100%',
      },
    });
  }, [measures.width]);

  return (
    <View
      style={[
        styles.root,
        {
          overflow: 'hidden',
          minHeight: width,
          minWidth: height,
          left: -Math.abs(width - height),
        },
      ]}
      ref={ref}
    >
      <StatusBar hidden />
      <SafeAreaView>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            display: 'flex',
            overflow: 'hidden',
            maxHeight: width,
            maxWidth: height,
          }}
          onLayout={(e) => {
            const layout = e.nativeEvent.layout;
            setMeasures({
              // shortest to be height always
              height: Math.min(layout.width, layout.height),
              // longest to be width always
              width: Math.max(layout.width, layout.height) - SIDEBAR_WIDTH,
            });
          }}
        >
          {/* pictures scroll preview sidebar */}
          <View>
            <Components.PicturesScrollPreview
              activeSight={activeSight}
              sights={sights}
              pictures={pictures}
              ref={scrollRef}
            />
          </View>

          {/* camera and mask overlay */}
          <View style={{ alignSelf: 'center' }}>
            <View
              style={{
                transform: [{ rotate: '-90deg' }, { scale: 0.8 }],
                zIndex: -1,
                ...measures,
                marginTop: 100,
              }}
            >
              {measures.width ? (
                <Components.Camera
                  onCameraReady={handleCameraReady}
                  ratio={makeRatio(measures.width, measures.height)}
                />
              ) : null}
            </View>
            <View style={styles.overLaps}>
              {fakeActivity && <ActivityIndicatorView />}
              {!fakeActivity && camera && (
                <Components.Mask
                  resizeMode="contain"
                  id={activeSight.id}
                  width="100%"
                  style={[styles.mask, { maxWidth: width - SIDEBAR_WIDTH }]}
                />
              )}
            </View>
          </View>

          {/* camera sidebar */}
          <View ref={sidebarRef}>
            <Components.CameraSideBar>
              <FAB
                accessibilityLabel="Advices"
                color="#edab25"
                disabled={fakeActivity}
                icon={Platform.OS !== 'ios' ? 'lightbulb-on' : undefined}
                label={Platform.OS === 'ios' ? 'Advices' : undefined}
                onPress={handleShowAdvice}
                small
                style={styles.fab}
              />
              <FAB
                accessibilityLabel="Take a picture"
                disabled={fakeActivity}
                icon="camera-image"
                onPress={handleTakePicture}
                style={[styles.fabImportant, styles.largeFab]}
              />
              <FAB
                accessibilityLabel="Close camera"
                disabled={fakeActivity}
                icon={Platform.OS !== 'ios' ? 'close' : undefined}
                label={Platform.OS === 'ios' ? 'Close' : undefined}
                onPress={toggleSnackBar}
                small
                style={styles.fab}
              />
            </Components.CameraSideBar>
          </View>
        </View>
        <Modal
          visible={visibleAdvices}
          onDismiss={hideAdvices}
          contentContainerStyle={styles.advices}
        >
          <AdvicesView onDismiss={hideAdvices} />
        </Modal>
      </SafeAreaView>

      <Snackbar
        visible={visibleSnack}
        onDismiss={handleDismissSnackBar}
        duration={14000}
        style={styles.snackBar}
        action={{
          label: 'Leave',
          onPress: handleCloseCamera,
          color: colors.error,
        }}
      >
        <Text style={{ color: colors.warning }}>You are leaving the process, are you sure ?</Text>
      </Snackbar>
    </View>
  );
}

MobileBrowserView.propTypes = {
  activeSight: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, propTypes.sights]))
    .isRequired,
  camera: PropTypes.oneOfType([
    // Either a function
    PropTypes.func,
    // Or the instance of a DOM native element
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
  fakeActivity: noop.isRequired,
  handleCameraReady: PropTypes.func.isRequired,
  handleCloseCamera: PropTypes.func.isRequired,
  handleDismissSnackBar: PropTypes.func.isRequired,
  handleShowAdvice: PropTypes.func.isRequired,
  handleTakePicture: PropTypes.func.isRequired,
  hideAdvices: PropTypes.func.isRequired,
  pictures: propTypes.cameraPictures.isRequired,
  sights: propTypes.sights.isRequired,
  toggleSnackBar: PropTypes.func.isRequired,
  visibleAdvices: PropTypes.bool.isRequired,
  visibleSnack: PropTypes.bool.isRequired,
};
