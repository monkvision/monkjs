import { useTranslation } from 'react-i18next';
import {
  i18nWrap,
  useI18nSync,
  useLoadingState,
  useMonkAppState,
  useMonkTheme,
  useResponsiveStyle,
} from '@monkvision/common';
import { VehicleType } from '@monkvision/types';
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { useMonkApi } from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';
import { styles } from './VehicleTypeSelection.styles';
import { i18nVehicleTypeSelection } from './i18n';
import { Button } from '../Button';
import { getInitialSelectedVehicleType, getVehicleTypes } from './utils';
import { VehicleTypeSelectionCard } from './VehicleTypeSelectionCard';
import { Spinner } from '../Spinner';

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
  /**
   * Boolean indicating if the patch vehicle inspection feature is enabled. If true, it will trigger 2 actions:
   * - At the start, it will check if a vehicle type is defined. If so, it will immediately
   *   call the 'onSelectVehicleType' callback.
   * - When the 'confirm button' is pressed by the user, it will make a request to the API to PATCH the vehicle type of the inspection.
   *
   * @default true
   */
  patchInspection?: boolean;
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
    patchInspection = true,
  }: VehicleTypeSelectionProps) => {
    useI18nSync(lang);
    const { config, authToken, inspectionId } = useMonkAppState();
    const { updateInspectionVehicule, getInspection } = useMonkApi({
      authToken: authToken ?? '',
      apiDomain: config.apiDomain,
    });
    const loading = useLoadingState(true);
    const { handleError } = useMonitoring();
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

    const onValidate = (type: VehicleType) => {
      if (patchInspection && inspectionId) {
        updateInspectionVehicule({ inspectionId, vehicle: { type } });
      }
      onSelectVehicleType?.(type);
    };

    useEffect(() => {
      const fetchInspection = async () => {
        if (patchInspection && inspectionId) {
          const fetchedInspection = await getInspection({
            id: inspectionId,
          });

          const vehicle = fetchedInspection.entities.vehicles.find(
            (v) => v.inspectionId === inspectionId,
          );
          const vehicleTypeFoundInInspection = Object.values(VehicleType).find(
            (vehicleType) => vehicleType === vehicle?.type,
          );
          if (vehicleTypeFoundInInspection) {
            onSelectVehicleType?.(vehicleTypeFoundInInspection);
          }
        }
        loading.onSuccess();
      };

      loading.start();
      fetchInspection().catch(handleError);
    }, [patchInspection, inspectionId]);

    useEffect(() => {
      const index = vehicleTypes.indexOf(selected);
      if (index >= 0 && !loading.isLoading) {
        scrollToSelectedVehicleType(sliderRef, index, !initialScroll);
        setInitialScroll(false);
      }
    }, [vehicleTypes, selected, loading]);

    const loadingContainer = loading.isLoading ? styles['loadingContainer'] : {};

    return (
      <div
        style={{
          ...rootStyles,
          ...styles['container'],
          ...loadingContainer,
          ...responsive(styles['containerSmall']),
        }}
      >
        {loading.isLoading && <Spinner size={80} />}
        {!loading.isLoading && !loading.error && (
          <>
            <div style={styles['title']}>{t('header.title')}</div>
            <Button style={styles['button']} onClick={() => onValidate(selected)}>
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
          </>
        )}
      </div>
    );
  },
  i18nVehicleTypeSelection,
);
