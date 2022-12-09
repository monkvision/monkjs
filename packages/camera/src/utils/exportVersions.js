import monk from '@monkvision/corejs';
import { version as corejs } from '@monkvision/corejs/package.json';
import { version as sights } from '@monkvision/sights/package.json';
import { version as toolkit } from '@monkvision/toolkit/package.json';
import { version as camera } from '../../package.json';

export default function exportVersions() {
  monk.config.packageVersions = {
    camera,
    corejs,
    sights,
    toolkit,
  };
}
