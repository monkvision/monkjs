import React, { useCallback, useMemo } from 'react';
import { Badge, Card, IconButton } from 'react-native-paper';
import { ScrollView, Share, StyleSheet, View } from 'react-native';

import moment from 'moment';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';
import { utils } from '@monkvision/toolkit';
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
  },
  carHeader: {
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
    marginBottom: utils.styles.spacing(2),
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

const base = `https://${ExpoConstants.manifest.extra.ORGANIZATION_DOMAIN}`;

function ShareButton({ message, ...props }) {
  const handlePress = useCallback(async () => {
    try {
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

  return <IconButton {...props} icon="share-variant" onPress={handlePress} />;
}

ShareButton.propTypes = {
  message: PropTypes.string.isRequired,
};

export default function Inspection({ createdAt, id, images }) {
  const { accessToken } = useAuth();
  const path = `/inspection/${id}`;
  const queryParams = `?access_token=${accessToken}`;
  const linkTo = `${base}${path}${queryParams}`;

  const caption = useMemo(() => moment(createdAt).format('LLL'), [createdAt]);
  const message = useMemo(() => `Inspection Report - ${linkTo}`, [linkTo]);
  const titleRight = useCallback(
    (props) => <ShareButton {...props} message={message} />,
    [message],
  );

  const handlePress = useCallback(({ id: imageId }) => {
    const url = `${linkTo}&image_id=${imageId}`;
    WebBrowser.openBrowserAsync(url);
  }, [path, queryParams]);

  return (
    <Card style={styles.root}>
      <Card.Title
        title="Last inspection"
        subtitle={caption}
        right={titleRight}
      />
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        {images.filter((i) => !isEmpty(i)).sort((a, b) => (
          new Date(b.additionalData.createdAt) - new Date(a.additionalData.createdAt)
        )).map((image) => (
          <View key={`image-${image.id}`} style={styles.cardCover}>
            <Card.Cover source={{ uri: image.path }} />
            <Badge style={styles.label}>{image.additionalData.label}</Badge>
            <IconButton
              icon="eye"
              accessibilityLabel="See details of the image"
              style={styles.iconButton}
              onPress={() => handlePress(image)}
            />
          </View>
        ))}
      </ScrollView>
    </Card>
  );
}

Inspection.propTypes = {
  createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  id: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.shape({
    additionalData: PropTypes.shape({
      createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    }),
    id: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  })),
};

Inspection.defaultProps = {
  images: [],
};
