import { ShortcutLegend } from './ShortcutLegend';

/**
 * The Shortcuts component displaying available keyboard shortcuts while in Gallery.
 */
export function Shortcuts() {
  return (
    <>
      <ShortcutLegend letter='S' text='Show/Hide damages' />
      <ShortcutLegend letter='Q' text='Close current image' />
      <div style={{ display: 'flex', gap: '8px' }}>
        <ShortcutLegend letter='←' />
        <ShortcutLegend letter='→' text='Change image' />
      </div>
    </>
  );
}
