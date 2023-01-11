import monk from '@monkvision/corejs';
import corejs from '@monkvision/corejs/package.json';
import sights from '@monkvision/sights/package.json';
import toolkit from '@monkvision/toolkit/package.json';
import camera from '../../package.json';

export default function exportVersions() {
  monk.config.packageVersions = {
    camera: camera.version,
    corejs: corejs.version,
    sights: sights.version,
    toolkit: toolkit.version,
  };
}
