import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge, Card, IconButton } from 'react-native-paper';
import { Platform, ScrollView, Share, StyleSheet, View } from 'react-native';

import moment from 'moment';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';
import { utils, useTimeout } from '@monkvision/toolkit';
import * as WebBrowser from 'expo-web-browser';
import ExpoConstants from 'expo-constants';
import useAuth from 'hooks/useAuth';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flex: 1,
    width: '100%',
  },
  contentContainerStyle: {
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: utils.styles.spacing(2),

  },
  carHeader: {
    width: '100%',
    marginBottom: utils.styles.spacing(2),
  },
  subHeading: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cardCover: {
    width: '50%',
  },
  caption: {
    marginLeft: utils.styles.spacing(1),
    fontSize: 12,
  },
  iconButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  label: {
    position: 'absolute',
    top: utils.styles.spacing(1),
    right: utils.styles.spacing(1),
  },
});

const base = `https://${ExpoConstants.manifest.extra.IRA_DOMAIN}`;

const COPY_ICON = 'content-copy';
const COPIED_ICON = 'clipboard-check-outline';
const SHARE_ICON = 'share-variant';

function ShareButton({ message, ...props }) {
  const initialIcon = Platform.OS === 'web' ? COPY_ICON : SHARE_ICON;
  const [icon, setIcon] = useState(initialIcon);

  const delay = useMemo(() => (icon === COPIED_ICON ? 1000 : null), [icon]);
  useTimeout(() => { setIcon(COPY_ICON); }, delay);

  const handlePress = useCallback(async () => {
    if (Platform.OS === 'web') {
      utils.log(['[Click] Inspection Id copied']);
      navigator.clipboard.writeText(message);
      setIcon(COPIED_ICON);
      return;
    }

    try {
      utils.log(['[Click] Sharing the inspection']);
      const result = await Share.share({
        message,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error.message);
    }
  }, []);

  return <IconButton {...props} icon={icon} onPress={handlePress} />;
}

ShareButton.propTypes = {
  message: PropTypes.string.isRequired,
};

export default function Inspection({ createdAt, id, images }) {
  const { accessToken } = useAuth();
  const { t, i18n } = useTranslation();
  const path = `/inspections/${id}`;
  const linkTo = `${base}${path}`;

  const caption = useMemo(
    () => moment(createdAt).locale(i18n.language ?? 'en').format('LLL'),
    [createdAt, i18n.language],
  );
  const message = useMemo(() => (Platform.OS === 'web' ? linkTo : `Inspection Report - ${linkTo}`), [linkTo]);
  const titleRight = useCallback(
    (props) => <ShareButton {...props} message={message} />,
    [message],
  );

  const handlePress = useCallback(({ id: imageId }) => {
    utils.log(['[Click] View inspection image']);
    const url = `${linkTo}?access_token=${accessToken}&image_id=${imageId}`;
    WebBrowser.openBrowserAsync(url);
  }, [path, accessToken]);

  const getLabel = useCallback((image) => (
    image.additionalData.label ? image.additionalData.label[i18n.language] : ''
  ), [i18n.language]);

  return (
    <View style={styles.root}>
      <Card.Title
        title={t('landing.lastInspection')}
        subtitle={caption}
        right={titleRight}
      />
      <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.contentContainerStyle}>
        {images.filter((i) => !isEmpty(i)).sort((a, b) => (
          new Date(b.additionalData.createdAt) - new Date(a.additionalData.createdAt)
        )).map((image) => (
          <View key={`image-${image.id}`} style={styles.cardCover}>
            <Card.Cover source={{ uri: image.path }} />
            <Badge style={styles.label}>{getLabel(image)}</Badge>
            <IconButton
              icon="eye"
              accessibilityLabel="See details of the image"
              style={styles.iconButton}
              onPress={() => handlePress(image)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

Inspection.propTypes = {
  createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  id: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.shape({
    additionalData: PropTypes.shape({
      createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          en: PropTypes.string,
          fr: PropTypes.string,
        }),
      ]),
    }),
    id: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  })),
};

Inspection.defaultProps = {
  images: [],
};
