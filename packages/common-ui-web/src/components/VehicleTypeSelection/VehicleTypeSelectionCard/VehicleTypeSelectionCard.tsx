import { VehicleType } from '@monkvision/types';
import { useInteractiveStatus, useObjectTranslation } from '@monkvision/common';
import { labels } from '@monkvision/sights';
import { useVehicleTypeSelectionCardStyles } from './hooks';
import { VehicleTypeAsset } from '../../VehicleTypeAsset';

export interface VehicleTypeSelectionCardProps {
  vehicleType: VehicleType;
  isSelected: boolean;
  onClick: () => void;
}

export function VehicleTypeSelectionCard({
  vehicleType,
  isSelected,
  onClick,
}: VehicleTypeSelectionCardProps) {
  const { status, eventHandlers } = useInteractiveStatus();
  const { tObj } = useObjectTranslation();
  const { containerStyle, assetContainerStyle, assetStyle, labelStyle } =
    useVehicleTypeSelectionCardStyles({ isSelected, status });

  return (
    <button style={containerStyle} {...eventHandlers} onClick={!isSelected ? onClick : undefined}>
      <div style={assetContainerStyle}>
        <VehicleTypeAsset vehicleType={vehicleType} style={assetStyle} />
      </div>
      <div style={labelStyle}>{tObj(labels[vehicleType])}</div>
    </button>
  );
}
