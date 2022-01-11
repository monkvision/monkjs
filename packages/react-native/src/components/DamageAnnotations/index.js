import React, { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Button, Card } from 'react-native-paper';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

import DamageHighlight from '../DamageHighlight';
import { useDamageImage } from '../../hooks';

export default function DamageAnnotations({
  image,
  onAdd,
  onRemove,
  onValidate,
}) {
  const [isPointAdded, setIsPointAdded] = useState(false);
  const [ellipse, setEllipse] = useState(null);
  const [isValidated, setIsValidated] = useState(false);
  const { getSvgRatio } = useDamageImage(image);

  const handleAddPoint = (event) => {
    const [RATIO_X, RATIO_Y] = getSvgRatio;

    if (!isPointAdded) {
      const prefixKey = Platform.select({
        native: 'location',
        default: 'layer',
      });
      const cx = event.nativeEvent[`${prefixKey}X`] * RATIO_X;
      const cy = event.nativeEvent[`${prefixKey}Y`] * RATIO_Y;
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
    onRemove(ellipse);
    setEllipse(null);
  }, [ellipse, onRemove]);

  useEffect(() => {
    if (!ellipse) {
      setIsPointAdded(false);
    } else {
      onAdd(ellipse);
    }
  }, [ellipse, onAdd]);

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
        <Button
          onPress={() => {
            setIsValidated(true);
          }}
          mode="contained"
        >
          Finish
        </Button>
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
