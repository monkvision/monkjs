import React from 'react';
import renderer from 'react-test-renderer';
import { Polygon } from 'react-native-svg';

import { DamageHighlight } from '../src';

describe('Check DamageHighlight component', () => {
  const polygons = [[[823, 1676], [769, 1746], [769, 1865], [801, 1999], [866, 2149], [979, 2327]]];
  const image = {
    id: '8a38b751-05a2-c772-8a52-152e0284c91d',
    imageHeight: 3456,
    imageWidth: 4608,
    path: 'https://www.google-image.com/o/None-6b7b5a09-bbeb-4772-a78b-01860e8e3900.jpeg?generation=1639744486056979&alt=media',
  };
  it('Should have one polygon', () => {
    const tree = renderer.create(<DamageHighlight image={image} polygons={polygons} />);
    expect(tree.toJSON().props.image.id).toBe(image.id);
    expect(tree.findByType(Polygon).length).toBe(1);
  });
});
