import isEmpty from 'lodash.isempty';
import moment from 'moment';
import PropTypes from 'prop-types';
import { utils } from '@monkvision/toolkit';
import { ScrollView } from 'react-native-web';
import { StyleSheet, View } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import { Caption, Card, Chip, IconButton, Subheading } from 'react-native-paper';

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
  chip: {
    marginLeft: utils.styles.spacing(1),
  },
  chipText: {
    fontSize: 12,
  },
  iconButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

const base = `https://${ExpoConstants.manifest.extra.ORGANIZATION_DOMAIN}`;

export default function Inspection({ createdAt, id, images }) {
  const { accessToken } = useAuth();
  const path = `/inspection/${id}`;
  const queryParams = `?access_token=${accessToken}`;
  const caption = useMemo(() => moment(createdAt).format('LLL'), [createdAt]);

  const handlePress = useCallback(({ id: imageId }) => {
    const url = `${base}${path}${queryParams}&image_id=${imageId}`;
    WebBrowser.openBrowserAsync(url);
  }, [path, queryParams]);

  return (
    <Card style={styles.root}>
      <Card.Content style={styles.carHeader}>
        <Subheading style={styles.subHeading}>
          Inspection
          <Chip
            icon="content-copy"
            mode="outlined"
            style={styles.chip}
            textStyle={styles.chipText}
          >
            {id.split('-')[0]}
          </Chip>
        </Subheading>
        <Caption>{caption}</Caption>
      </Card.Content>
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        {images.filter((i) => !isEmpty(i)).map((image) => (
          <View key={`image-${image.id}`} style={styles.cardCover}>
            <Card.Cover source={{ uri: image.path }} />
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
  createdAt: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  })),
};

Inspection.defaultProps = {
  images: [],
};
