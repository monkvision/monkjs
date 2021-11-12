import { useCallback, useState } from 'react';

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
    camera: {
      handleClose: handleCloseCamera,
    },
  };
}

export default useUI;
