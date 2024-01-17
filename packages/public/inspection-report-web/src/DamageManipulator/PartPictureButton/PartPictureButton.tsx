// import { useTranslation } from 'react-i18next';
import { Button } from '@monkvision/common-ui-web';
import { Content } from '../common';
import { styles } from './PartPictureButton.styles';

export interface PartPictureButtonProps {
  partName?: string;
  pictureTaken?: number;
  onClick?: () => void;
}
// TODO: how to get the translation of partName ? by Sight using useSightLabel hook?
export function PartPictureButton({
  partName = 'no-part',
  pictureTaken = 0,
  onClick,
}: PartPictureButtonProps) {
  // const { t } = useTranslation();

  return (
    <Content>
      <div style={styles['partName']} data-testid='part-name'>
        {partName}
      </div>
      <Button icon='image' variant='outline' primaryColor='text-white' onClick={onClick}>
        {!!pictureTaken && pictureTaken}
      </Button>
    </Content>
  );
}
