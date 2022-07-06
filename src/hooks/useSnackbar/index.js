import React, { useState } from 'react';
import { Snackbar } from 'react-native-paper';

export default function useSnackbar() {
  const [showMessage, setShowMessage] = useState(null);

  function Notice() {
    return (
      <Snackbar
        visible={showMessage !== null}
        theme={{ colors: { surface: '#fff' } }}
        wrapperStyle={{ width: 'auto' }}
      >
        {showMessage}
      </Snackbar>
    );
  }

  return { setShowMessage, Notice };
}
