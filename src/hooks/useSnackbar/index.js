import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Snackbar } from 'react-native-paper';

export default function useSnackbar(
  showDismiss = false,
  colors = { surface: '#fff' },
) {
  const [showMessage, setShowMessage] = useState(null);
  const [showTranslatedMessage, setShowTranslatedMessage] = useState(null);
  const { t, i18n } = useTranslation();

  const dismiss = useCallback(() => {
    setShowMessage(null);
    setShowTranslatedMessage(null);
  }, []);
  const dismissLabel = useMemo(() => t('snackbar.dismiss'), [t, i18n.language]);
  const message = useMemo(
    () => (showTranslatedMessage ? t(showTranslatedMessage) : showMessage),
    [showMessage, showTranslatedMessage, t, i18n.language],
  );

  const Notice = useCallback(() => (
    <Snackbar
      visible={message !== null}
      theme={{ colors: colors }}
      wrapperStyle={{ width: 'auto' }}
      action={showDismiss ? { label: dismissLabel, onPress: () => dismiss() } : undefined}
      onDismiss={() => {}}
    >
      {message}
    </Snackbar>
  ), [dismissLabel, message]);

  return { setShowMessage, setShowTranslatedMessage, Notice };
}
