import { useCallback, useState } from 'react';

/**
 * Wraps states and callbacks to manage UI in one hook place
 * @param camera
 * @param pictures
 * @param onCloseCamera
 * @param onShowAdvice
 * @returns {{
 *   camera: {handleClose: function},
 *   container: { measures: {width: number, height: number}, handleLayout: function},
 *   modal: {handleDismiss: function, handleShow: function, isVisible: boolean},
 *   snackbar: {handleDismiss: function, handleToggle: function, isVisible: boolean},
 * }}
 */
function useUI(camera, pictures, onCloseCamera, onShowAdvice) {
  // container
  const [measures, setMeasures] = useState({ width: null, height: null });
  const handleLayout = useCallback((e) => {
    const layout = e.nativeEvent.layout;
    setMeasures({
      // shortest to be height always
      height: Math.min(layout.width, layout.height),
      // longest to be width always
      width: Math.max(layout.width, layout.height),
    });
  }, []);

  // modal
  const [modalIsVisible, setVisibleAdvices] = useState(false);
  const handleDismissAdvices = () => {
    camera?.resumePreview();
    setVisibleAdvices(false);
  };
  const handleShowAdvices = () => {
    camera?.pausePreview();
    setVisibleAdvices(true);
    onShowAdvice(pictures);
  };

  // snackbar
  const [snackIsVisible, setVisibleSnack] = useState(false);
  const handleToggleSnackbar = () => setVisibleSnack((prev) => !prev);
  const handleDismissSnackbar = () => setVisibleSnack(false);

  // camera
  const handleCloseCamera = useCallback(() => {
    onCloseCamera(pictures);
  }, [onCloseCamera, pictures]);

  return {
    camera: {
      handleClose: handleCloseCamera,
    },
    container: {
      handleLayout,
      measures,
    },
    modal: {
      handleDismiss: handleDismissAdvices,
      handleShow: handleShowAdvices,
      isVisible: modalIsVisible,
    },
    snackbar: {
      handleDismiss: handleDismissSnackbar,
      handleToggle: handleToggleSnackbar,
      isVisible: snackIsVisible,
    },
  };
}

export default useUI;
