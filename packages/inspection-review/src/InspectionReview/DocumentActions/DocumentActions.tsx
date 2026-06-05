import { DownloadImagesButton } from './DownloadImagesButton';
import { GeneratePDFButton } from './GeneratePDFButton';

export function DocumentActions() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <DownloadImagesButton />
      <GeneratePDFButton />
    </div>
  );
}
