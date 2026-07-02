import { useInspectionGalleryFilterPillStyles } from './hooks';
import { Button } from '../../../Button';

export interface InspectionGalleryFilterPillProps {
  isSelected: boolean;
  label: string;
  count: number;
  id?: string;
  onClick?: () => void;
}

export function InspectionGalleryFilterPill({
  isSelected,
  label,
  count,
  id,
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
      data-e2e={id}
    >
      <span>{label}</span>
      <span style={countStyle}>{count}</span>
    </Button>
  );
}
