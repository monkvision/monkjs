import { useTranslation } from 'react-i18next';
import { i18nWrap, useI18nSync, useMonkTheme, useResponsiveStyle } from '@monkvision/common';
import { VehicleType } from '@monkvision/types';
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { styles } from './VehicleTypeSelection.styles';
import { i18nVehicleTypeSelection } from './i18n';
import { Button } from '../Button';
import { getInitialSelectedVehicleType, getVehicleTypes } from './utils';
import { VehicleTypeSelectionCard } from './VehicleTypeSelectionCard';

/**
 * Props accepted by the VehicleTypeSelection component.
 */
export interface VehicleTypeSelectionProps {
  /**
   * The initially selected vehicle type.
   *
   * @default The center-most vehicle type in the list.
   */
  selectedVehicleType?: VehicleType;
  /**
   * A list of available vehicle type to choose from. The order of the list will be modified to always follow the same
   * order.
   *
   * @default [SUV, CUV, SEDAN, HATCHBACK, VAN, MINIVAN, PICKUP]
   */
  availableVehicleTypes?: VehicleType[];
  /**
   * Callback called when the user has selected a vehicle type.
   */
  onSelectVehicleType?: (type: VehicleType) => void;
  /**
   * The language to use by this component.
   *
   * @default en
   */
  lang?: string;
}

function scrollToSelectedVehicleType(
  ref: RefObject<HTMLDivElement>,
  index: number,
  smooth: boolean,
): void {
  if (ref.current && ref.current.children.length > index) {
    ref.current.children[index].scrollIntoView({
      behavior: smooth ? 'smooth' : ('instant' as ScrollBehavior),
      inline: 'center',
    });
  }
}

/**
 * A single page component that allows the user to select a vehicle type.
 */
export const VehicleTypeSelection = i18nWrap(
  ({
    availableVehicleTypes,
    selectedVehicleType,
    onSelectVehicleType,
    lang,
  }: VehicleTypeSelectionProps) => {
    useI18nSync(lang);
    const [initialScroll, setInitialScroll] = useState(true);
    const vehicleTypes = useMemo(
      () => getVehicleTypes(availableVehicleTypes),
      [availableVehicleTypes],
    );
    const [selected, setSelected] = useState(
      getInitialSelectedVehicleType(vehicleTypes, selectedVehicleType),
    );
    const { t } = useTranslation();
    const { rootStyles } = useMonkTheme();
    const sliderRef = useRef<HTMLDivElement>(null);
    const { responsive } = useResponsiveStyle();
    useEffect(() => {
      const index = vehicleTypes.indexOf(selected);
      if (index >= 0) {
        setInitialScroll(false);
        scrollToSelectedVehicleType(sliderRef, index, !initialScroll);
      }
    }, []);
    return (
      <div
        style={{
          ...rootStyles,
          ...styles['container'],
          ...responsive(styles['containerSmall']),
        }}
      >
        <div style={styles['title']}>{t('header.title')}</div>
        <Button style={styles['button']} onClick={() => onSelectVehicleType?.(selected)}>
          {t('header.confirm')}
        </Button>
        <div
          style={{
            ...styles['sliderContainer'],
            ...responsive(styles['sliderContainerSmall']),
          }}
        >
          <div style={styles['slider']} ref={sliderRef}>
            {vehicleTypes.map((v) => (
              <VehicleTypeSelectionCard
                key={v}
                vehicleType={v}
                isSelected={selected === v}
                onClick={() => setSelected(v)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  },
  i18nVehicleTypeSelection,
);
