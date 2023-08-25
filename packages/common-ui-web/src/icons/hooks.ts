import { FunctionComponent, SVGProps, useMemo } from 'react';
import { MonkIconAssetsMap } from './assets';
import { IconName } from './names';

export function useIconAsset(icon: IconName): FunctionComponent<SVGProps<SVGSVGElement>> {
  return useMemo(() => {
    const asset = MonkIconAssetsMap[icon];
    if (!asset) {
      throw new Error(`Unknown icon name : ${icon}`);
    }
    return asset;
  }, [icon]);
}
