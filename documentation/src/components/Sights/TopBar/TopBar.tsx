import { labels, sights, vehicles } from '@monkvision/sights';
import { SearchBar } from '@site/src/components';
import { SightCard } from '@site/src/components/Sights/SightCard';
import clsx from 'clsx';
import React, { FunctionComponentElement, useRef } from 'react';
import styles from './TopBar.module.css';

export interface ListItem {
  id: string;
  lookups: string[];
  component: FunctionComponentElement<typeof SightCard>;
}

export interface Tab {
  key: string;
  items?: ListItem[];
}

export interface TopBarProps {
  selectedTabKey: string;
  onSelectTab: (tab: Tab) => void;
  onLookupInput: (value: string) => void;
}

export const tabs = {
  sights: {
    key: 'sights',
    items: Object.values(sights).map((sight) => ({
      id: sight.id,
      lookups: [
        sight.id,
        sight.category,
        sight.label,
        sight.vehicle,
        labels[sight.label].en,
        labels[sight.label].fr,
        labels[sight.label].de,
        ...sight.tasks,
      ].map((s) => s.toLowerCase()),
      component: <SightCard key={sight.id} item={sight} />,
    })),
  },
  vehicles: {
    key: 'vehicles',
    items: Object.values(vehicles).map((vehicle) => ({
      id: vehicle.id,
      lookups: [vehicle.id, vehicle.make, vehicle.model, vehicle.type].map((s) => s.toLowerCase()),
      component: <SightCard key={vehicle.id} item={vehicle} />,
    })),
  },
  labels: {
    key: 'labels',
  },
};

export function TopBar({ selectedTabKey, onSelectTab, onLookupInput }: TopBarProps) {
  const lookupRef = useRef<HTMLInputElement>(null);

  const selectTab = (tab: Tab) => {
    onSelectTab(tab);
    if (lookupRef.current) {
      onLookupInput('');
      lookupRef.current.value = '';
    }
    window.scroll({ top: 0 });
  };

  return (
    <div className={styles['top-bar']}>
      <div className={styles['tabs']}>
        <button
          className={clsx([
            styles['tab'],
            { [styles['selected']]: selectedTabKey === tabs.sights.key },
          ])}
          onClick={() => selectTab(tabs.sights)}
        >
          Sights
        </button>
        <button
          className={clsx([
            styles['tab'],
            { [styles['selected']]: selectedTabKey === tabs.vehicles.key },
          ])}
          onClick={() => selectTab(tabs.vehicles)}
        >
          Vehicles
        </button>
        <button
          className={clsx([
            styles['tab'],
            { [styles['selected']]: selectedTabKey === tabs.labels.key },
          ])}
          onClick={() => selectTab(tabs.labels)}
        >
          Labels
        </button>
      </div>
      {selectedTabKey !== tabs.labels.key && (
        <div className={styles['filters']}>
          <SearchBar ref={lookupRef} onInput={onLookupInput} />
        </div>
      )}
    </div>
  );
}
