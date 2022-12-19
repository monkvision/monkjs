import { useCallback, useState } from 'react';

export const CarOrientation = {
  FRONT_LEFT: 0,
  REAR_LEFT: 1,
  REAR_RIGHT: 2,
  FRONT_RIGHT: 3,
};

export const sightToCarOrientationMap = {
  'vwtroc-vLcBGkeh': CarOrientation.FRONT_LEFT, // Front
  'vwtroc-xfbBpq3Q': CarOrientation.FRONT_LEFT, // Front Bumper Side Left
  'vwtroc-xQKQ0bXS': CarOrientation.FRONT_LEFT, // Front wheel left (Wheels analysis)
  'vwtroc-zjAIjUgU': CarOrientation.FRONT_LEFT, // Front Lateral Left
  'vwtroc-T24v9XS8': CarOrientation.FRONT_LEFT, // Front Door Left
  'vwtroc-UHZkpCuK': CarOrientation.FRONT_LEFT, // Rocker panel left
  'vwtroc-ClEZSucK': CarOrientation.REAR_LEFT, // Rear Lateral Left
  'vwtroc-8_W2PO8L': CarOrientation.REAR_LEFT, // Rear wheel left (Wheels analysis)
  'vwtroc-j8YHvnDP': CarOrientation.REAR_LEFT, // Rear Bumper Side Left
  'vwtroc-XyeyZlaU': CarOrientation.REAR_LEFT, // Rear
  'vwtroc-LDRoAPnk': CarOrientation.REAR_RIGHT, // Rear Bumper Side Right
  'vwtroc-rN39Y3HR': CarOrientation.REAR_RIGHT, // Rear wheel right (Wheels analysis)
  'vwtroc-QqBpHiVP': CarOrientation.REAR_RIGHT, // Rear Lateral Right
  'vwtroc-B5s1CWT-': CarOrientation.FRONT_RIGHT, // Rocker panel right
  'vwtroc-2wVqenwP': CarOrientation.FRONT_RIGHT, // Front Door Right
  'vwtroc-0U14gFyk': CarOrientation.FRONT_RIGHT, // Front Lateral Right
  'vwtroc-PuIw17h0': CarOrientation.FRONT_RIGHT, // Front wheel right (Wheels analysis)
  'vwtroc-CELBsvYD': CarOrientation.FRONT_RIGHT, // Front Bumper Side Right
};

export default function useCarOrientation(currentSight) {
  const [orientation, setOrientation] = useState(
    sightToCarOrientationMap[currentSight] ?? CarOrientation.FRONT_LEFT,
  );

  const rotateLeft = useCallback(() => {
    let newOrientation = orientation - 1;
    if (newOrientation < CarOrientation.FRONT_LEFT) {
      newOrientation = CarOrientation.FRONT_RIGHT;
    }
    setOrientation(newOrientation);
  }, [orientation, setOrientation]);

  const rotateRight = useCallback(() => {
    let newOrientation = orientation + 1;
    if (newOrientation > CarOrientation.FRONT_RIGHT) {
      newOrientation = CarOrientation.FRONT_LEFT;
    }
    setOrientation(newOrientation);
  }, [orientation, setOrientation]);

  return {
    orientation,
    rotateLeft,
    rotateRight,
  };
}
