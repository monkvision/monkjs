import { useWindowDimensions } from '@monkvision/common';
import { DeviceOrientation, Styles } from '@monkvision/types';
import { SVGProps, useCallback } from 'react';

export const styles: Styles = {
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  vehicleScaling: {
    width: '100%',
    height: 'auto',
    animation: 'scaleDown 2s ease-in-out forwards',
  },

  phone: {
    position: 'absolute',
    opacity: 0,
    animation: 'positionPhone 2s ease-in-out both',
  },

  phonePortrait: {
    animation: 'positionPhonePortrait 2s ease-in-out both',
  },
};

export interface VehiclePhoneParams {
  orientation: DeviceOrientation;
}

export function useVehiclePhone({ orientation }: VehiclePhoneParams) {
  const { height, width, isPortrait } = useWindowDimensions();

  const phoneSize = isPortrait
    ? Math.min(width * 0.7, height * 0.5)
    : Math.min(height * 0.7, width * 0.5);

  const getAttributes = useCallback((element: SVGElement): SVGProps<SVGElement> => {
    const id = element.getAttribute('id');
    if (id === 'person' || id === 'plot' || id === 'car_behind') {
      return {
        style: { display: 'none' },
      };
    }
    return {};
  }, []);

  return {
    phoneStyle: {
      ...styles['phone'],
      ...{ height: phoneSize },
      ...(orientation === DeviceOrientation.PORTRAIT && styles['phonePortrait']),
    },
    getAttributes,
  };
}
