import { useTranslation } from 'react-i18next';
import { ShortcutLegend } from './ShortcutLegend';

/**
 * Props accepted by the Shortcuts component.
 */
export interface ShortcutsProps {
  /**
   * Flag indicating whether to show damage on the selected image.
   */
  showDamage: boolean;
}

/**
 * The Shortcuts component displaying available keyboard shortcuts while in Gallery.
 */
export function Shortcuts({ showDamage }: ShortcutsProps) {
  const { t } = useTranslation();
  return (
    <>
      <ShortcutLegend
        letter='S'
        text={showDamage ? t('gallery.spotlight.hideDamages') : t('gallery.spotlight.showDamages')}
      />
      <ShortcutLegend letter='Q' text={t('gallery.spotlight.closeSpotlight')} />
      <div style={{ display: 'flex', gap: '8px' }}>
        <ShortcutLegend letter='←' />
        <ShortcutLegend letter='→' text={t('gallery.spotlight.changeImage')} />
      </div>
    </>
  );
}
