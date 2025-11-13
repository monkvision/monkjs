import { useTranslation } from 'react-i18next';
import {
  i18nWrap,
  useI18nSync,
  useLoadingState,
  useMonkTheme,
  useResponsiveStyle,
} from '@monkvision/common';
import { AllOrNone, VehicleType } from '@monkvision/types';
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { decodeMonkJwt, MonkApiConfig, useMonkApi } from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';
import { styles } from './VehicleTypeSelection.styles';
import { i18nVehicleTypeSelection } from './i18n';
import { Button } from '../Button';
import {
  getInitialSelectedVehicleType,
  getVehicleTypeFromInspection,
  getVehicleTypes,
} from './utils';
import { VehicleTypeSelectionCard } from './VehicleTypeSelectionCard';
import { Spinner } from '../Spinner';

/**
 * Props used to check if a vehicle type is already defined before displaying vehicle type selection.
 */
export interface MonkApiProps extends MonkApiConfig {
  /**
   * The ID of the inspection.
   */
  inspectionId: string;
}

/**
 * Props accepted by the VehicleTypeSelection component.
 */
export type VehicleTypeSelectionProps = {
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
} & AllOrNone<MonkApiProps>;

function scrollToSelectedVehicleType(
  ref: RefObject<HTMLDivElement | null>,
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
export const VehicleTypeSelection = i18nWrap(function VehicleTypeSelection(
  props: VehicleTypeSelectionProps,
) {
  useI18nSync(props.lang);
  const { getInspection } = useMonkApi({
    authToken: props.authToken ?? '',
    apiDomain: props.apiDomain ?? '',
    thumbnailDomain: props.thumbnailDomain ?? '',
  });
  const loading = useLoadingState();
  const { handleError, setTags, setUserId } = useMonitoring();
  const [initialScroll, setInitialScroll] = useState(true);
  const vehicleTypes = useMemo(
    () => getVehicleTypes(props.availableVehicleTypes),
    [props.availableVehicleTypes],
  );
  const [selected, setSelected] = useState(
    getInitialSelectedVehicleType(vehicleTypes, props.selectedVehicleType),
  );
  const { t } = useTranslation();
  const { rootStyles } = useMonkTheme();
  const sliderRef = useRef<HTMLDivElement>(null);
  const { responsive } = useResponsiveStyle();

  useEffect(() => {
    if (props.inspectionId) {
      setTags({ inspectionId: props.inspectionId });
    }
    const userId = props.authToken ? decodeMonkJwt(props.authToken) : undefined;
    if (userId?.sub) {
      setUserId(userId.sub);
    }
  }, [props.inspectionId, props.authToken, setTags, setUserId]);

  useEffect(() => {
    loading.start();
    const fetchInspection = async () => {
      if (!props.inspectionId) {
        loading.onSuccess();
        return;
      }
      const fetchedInspection = await getInspection({
        id: props.inspectionId,
      });
      const vehicleType = getVehicleTypeFromInspection(fetchedInspection);
      if (vehicleType && vehicleTypes.includes(vehicleType)) {
        props.onSelectVehicleType?.(vehicleType);
      }
      loading.onSuccess();
    };

    fetchInspection().catch(handleError);
  }, [props.inspectionId]);

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
        ...responsive(styles['containerSmall']),
        ...loadingContainer,
      }}
    >
      {loading.isLoading && <Spinner size={80} />}
      {!loading.isLoading && !loading.error && (
        <>
          <div style={styles['title']}>{t('header.title')}</div>
          <Button style={styles['button']} onClick={() => props.onSelectVehicleType?.(selected)}>
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
i18nVehicleTypeSelection);
