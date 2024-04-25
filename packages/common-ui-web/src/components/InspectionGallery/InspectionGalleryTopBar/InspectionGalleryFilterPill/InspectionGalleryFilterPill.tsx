import { useInspectionGalleryFilterPillStyles } from './hooks';
import { Button } from '../../../Button';

export interface InspectionGalleryFilterPillProps {
  isSelected: boolean;
  label: string;
  count: number;
  onClick?: () => void;
}

export function InspectionGalleryFilterPill({
  isSelected,
  label,
  count,
  onClick,
}: InspectionGalleryFilterPillProps) {
  const { pill, countStyle } = useInspectionGalleryFilterPillStyles({ isSelected });

  return (
    <Button
      onClick={onClick}
      primaryColor={pill.primaryColor}
      secondaryColor={pill.secondaryColor}
      shade={pill.shade}
      style={pill.style}
    >
      <span>{label}</span>
      <span style={countStyle}>{count}</span>
    </Button>
  );
}
