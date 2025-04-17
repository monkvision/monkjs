import React, { Fragment, useMemo, useRef } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { labels, sights } from '@monkvision/sights';
import { Sight, VehicleDetails, VehicleModel } from '@monkvision/types';
import { CopyPopup, CopyPopupHandle } from '@site/src/components';
import { DynamicSVGCustomizationFunctions } from '@monkvision/common-ui-web';
import { DynamicSVG } from '../../domOnly';
import styles from './SightCard.module.css';

const vehicleModelDisplayOverlays: Record<Exclude<VehicleModel, VehicleModel.ALL>, string> = {
  [VehicleModel.AUDIA7]: sights['audia7-WKJlxkiF'].overlay,
  [VehicleModel.FESC20]: sights['fesc20-bD8CBhYZ'].overlay,
  [VehicleModel.FF150]: sights['ff150-7UI3m9B3'].overlay,
  [VehicleModel.FFOCUS18]: sights['ffocus18-GgOSpLl6'].overlay,
  [VehicleModel.FTRANSIT18]: sights['ftransit18-ffghVsNz'].overlay,
  [VehicleModel.HACCORD]: sights['haccord-huAZfQJA'].overlay,
  [VehicleModel.JGC21]: sights['jgc21-VHq_6BM-'].overlay,
  [VehicleModel.TSIENNA20]: sights['tsienna20-jY3cR5vy'].overlay,
  [VehicleModel.VWTROC]: sights['vwtroc-IzMR_OzQ'].overlay,
  [VehicleModel.MAN12]: sights['man12-u8GNhGqe'].overlay,
  [VehicleModel.TESLAM3]: sights['teslam3-Bt4VnLRj'].overlay,
  [VehicleModel.TESLAMY]: sights['teslamy-F9Nr3VtK'].overlay,
  [VehicleModel.TESLAMX]: sights['teslamx-aT9LpF7y'].overlay,
  [VehicleModel.TESLAMS]: sights['teslams-Km9XrLp5'].overlay,
};

export interface SightCardProps {
  item: Sight | VehicleDetails;
}

export function SightCard({ item }: SightCardProps) {
  const isDarkTheme = useColorMode().colorMode === 'dark';
  const copyPopupRef = useRef<CopyPopupHandle>(null);

  const details = useMemo(() => {
    const detailsObj: Record<string, never> = {};
    Object.entries(item).forEach(([key, value]) => {
      if (key !== 'overlay') {
        Object.assign(detailsObj, { [key]: value });
      }
    });
    return JSON.stringify(detailsObj, null, 2)
      .replaceAll(' ', '\u00A0')
      .split('\n')
      .map((line) => (
        <Fragment key={`${item.id}-${line}`}>
          {line}
          <br />
        </Fragment>
      ));
  }, [item]);

  const overlay = 'overlay' in item ? item.overlay : vehicleModelDisplayOverlays[item.id];

  const label = 'label' in item ? labels[item.label].en : `${item.make} ${item.model}`;

  const copyId = async () => {
    await navigator.clipboard.writeText(item.id);
    copyPopupRef.current?.open();
  };

  const getOverlayAttributes: DynamicSVGCustomizationFunctions['getAttributes'] = () => ({
    style: {
      stroke: isDarkTheme ? '#ffffff' : '#000000',
    },
  });

  return (
    <>
      <div className={styles['sight-card']}>
        <div className={styles['overlay-container']}>
          <DynamicSVG svg={overlay} width={350} getAttributes={getOverlayAttributes} />
        </div>
        <div className={styles['header-container']}>
          <div className={styles['label']}>{label}</div>
          <button className={styles['id']} onClick={copyId}>
            {item.id}
            <CopyPopup ref={copyPopupRef} />
          </button>
        </div>
        <div className={styles['details-container']}>{details}</div>
      </div>
    </>
  );
}
