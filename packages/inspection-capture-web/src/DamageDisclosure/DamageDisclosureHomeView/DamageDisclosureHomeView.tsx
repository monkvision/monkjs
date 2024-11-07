import { useTranslation } from 'react-i18next';
import { Button } from '@monkvision/common-ui-web';
import { useResponsiveStyle } from '@monkvision/common';
import { styles, useDamageDisclosureHomeViewStyles } from './DamageDisclosureHomeView.styles';

export interface DamageDisclosureHomeViewProps {
  onDiscloseDamage?: () => void;
  onComplete?: () => void;
}

export function DamageDisclosureHomeView({
  onDiscloseDamage,
  onComplete,
}: DamageDisclosureHomeViewProps) {
  const { t } = useTranslation();
  const { responsive } = useResponsiveStyle();
  const { rootStyle } = useDamageDisclosureHomeViewStyles();

  return (
    <div
      style={{ ...styles['container'], ...responsive(styles['containerLandscape']), ...rootStyle }}
    >
      <div style={{ ...styles['section'], ...responsive(styles['sectionLandscape']) }}>
        <div style={styles['title']}>{t('damageDisclosure.home.discloseDamage.title')}</div>
        <div style={styles['description']}>
          {t('damageDisclosure.home.discloseDamage.description')}
        </div>
        <Button icon='add' onClick={onDiscloseDamage} style={styles['button']}>
          {t('damageDisclosure.home.discloseDamage.action')}
        </Button>
      </div>
      <div style={{ ...styles['section'], ...responsive(styles['sectionLandscape']) }}>
        <div style={styles['title']}>{t('damageDisclosure.home.close.title')}</div>
        <div style={styles['description']}>{t('damageDisclosure.home.close.description')}</div>
        <Button onClick={onComplete} style={styles['button']}>
          {t('damageDisclosure.home.close.action')}
        </Button>
      </div>
    </div>
  );
}
