import { LabelTable, ListItem, Tab, tabs, TopBar } from '@site/src/components';
import Layout from '@theme/Layout';
import React, { ReactElement, useMemo, useState } from 'react';
import styles from './styles.module.css';

function lookupItems(lookup: string, items: ListItem[]): ReactElement[] {
  const str = lookup.toLowerCase();
  const filtered = str
    ? items.filter((item) => item.lookups.some((lookupStr) => lookupStr.includes(str)))
    : items;
  return filtered.map((item) => item.component);
}

export default function Sights() {
  const [selectedTab, setSelectedTab] = useState<Tab>(tabs.sights);
  const [lookupInput, setLookupInput] = useState('');
  const displayedItems = useMemo(
    () => (selectedTab.items ? lookupItems(lookupInput, selectedTab.items) : []),
    [lookupInput, selectedTab],
  );

  return (
    <Layout title='Sights' description='Official documentation for the MonkJs Sights.'>
      <TopBar
        selectedTabKey={selectedTab.key}
        onSelectTab={setSelectedTab}
        onLookupInput={setLookupInput}
      />
      {selectedTab.key === tabs.labels.key ? (
        <LabelTable />
      ) : (
        <div className={styles['cards-container']}>{displayedItems}</div>
      )}
    </Layout>
  );
}
