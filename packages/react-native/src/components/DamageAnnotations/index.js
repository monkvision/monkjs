import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Platform } from 'react-native';
import { Button, Card } from 'react-native-paper';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

import DamageHighlight from '../DamageHighlight';

export default function DamageAnnotations({ image, onAdd, onRemove, onValidate }) {
  const [isPointAdded, setIsPointAdded] = useState(false);
  const [ellipse, setEllipse] = useState(null);
  const [isValidated, setIsValidated] = useState(false);

  const handleAddPoint = (event) => {
    const width = Math.min(Dimensions.get('window').width - 50, 400);
    const height = image.height * (width / image.width);
    if (!isPointAdded) {
      const ratioX = image.width / width;
      const ratioY = image.height / height;
      let cx; let cy;
      if (Platform.OS === 'web') {
        cx = event.nativeEvent.layerX * ratioX;
        cy = event.nativeEvent.layerY * ratioY;
      } else {
        cx = event.nativeEvent.locationX * ratioX;
        cy = event.nativeEvent.locationY * ratioY;
      }
      setIsPointAdded(true);
      setEllipse({
        cx,
        cy,
        rx: 100,
        ry: 100,
      });
    }
    onAdd();
  };

  const handleValidate = useCallback((newEllipse) => {
    onValidate(newEllipse);
  }, [onValidate]);

  const handleRemove = useCallback(() => {
    setEllipse(null);
    onRemove();
  }, [onRemove]);

  useEffect(() => {
    if (!ellipse) {
      setIsPointAdded(false);
    }
  }, [ellipse]);

  return (
    <Card>
      <Card.Content>
        <DamageHighlight
          image={image}
          ellipse={ellipse}
          isValidated={isValidated}
          onAdd={handleAddPoint}
          onValidate={handleValidate}
        />
      </Card.Content>
      <Card.Actions>
        <Button onPress={handleRemove}>Remove</Button>
        <Button onPress={() => { setIsValidated(true); }} mode="contained">Finish</Button>
      </Card.Actions>
    </Card>
  );
}

DamageAnnotations.propTypes = {
  image: PropTypes.shape({
    height: PropTypes.number,
    id: PropTypes.string, // image's uuid
    source: PropTypes.shape({
      uri: PropTypes.string, // "https://my_image_path.monk.ai"
    }),
    width: PropTypes.number, // original size of the image
  }),
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
  onValidate: PropTypes.func,
};

DamageAnnotations.defaultProps = {
  image: null,
  onAdd: noop,
  onRemove: noop,
  onValidate: noop,
};
