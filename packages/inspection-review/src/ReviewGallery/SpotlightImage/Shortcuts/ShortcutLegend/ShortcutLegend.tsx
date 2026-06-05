import { styles } from './ShortcutLegend.styles';

/**
 * Props for the ShortcutLegend component.
 */
export interface ShortcutLegendProps {
  /**
   * The letter representing the shortcut key.
   */
  letter: string;
  /**
   * The description of the shortcut.
   */
  text?: string;
}

/**
 * Shortcut component used to display a keyboard shortcut legend item.
 */
export function ShortcutLegend({ letter, text }: ShortcutLegendProps) {
  return (
    <div style={styles['legend']}>
      <div style={styles['icon']}>
        <p style={styles['iconText']}>{letter}</p>
      </div>
      {text && text}
    </div>
  );
}
