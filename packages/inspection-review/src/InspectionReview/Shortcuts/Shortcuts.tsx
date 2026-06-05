import { styles } from './Shortcuts.styles';

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

/**
 * The Shortcuts component displaying available keyboard shortcuts while in Gallery.
 */
export function Shortcuts() {
  return (
    <>
      <ShortcutLegend letter='S' text='Show/Hide damages' />
      <ShortcutLegend letter='Q' text='Close current image' />
      <div style={styles['legend']}>
        <div style={styles['icon']} color={'white'}>
          <p style={styles['iconText']}>←</p>
        </div>
        <div style={styles['icon']} color={'white'}>
          <p style={styles['iconText']}>→</p>
        </div>
        Change image
      </div>
    </>
  );
}
