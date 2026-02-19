import { useTranslation } from 'react-i18next';
import { styles } from './InspectionReviewHeader.styles';

function ShortcutLegend({ letter, text }: { letter: string; text: string }) {
  return (
    <div style={styles['legend']}>
      <div style={styles['icon']} color={'white'}>
        <p style={styles['iconText']}>{letter}</p>
      </div>
      {text}
    </div>
  );
}

export function Shortcuts() {
  const { t } = useTranslation();

  return (
    <>
      <ShortcutLegend letter='S' text={t('inspectionReview.header.showHideDamages')} />
      <ShortcutLegend letter='Q' text={t('inspectionReview.header.closeCurrentImage')} />
      <div style={styles['legend']}>
        <div style={styles['icon']} color={'white'}>
          <p style={styles['iconText']}>←</p>
        </div>
        <div style={styles['icon']} color={'white'}>
          <p style={styles['iconText']}>→</p>
        </div>
        {t('inspectionReview.header.changeImage')}
      </div>
    </>
  );
}
