import React, { useMemo, useState } from 'react';
import { iconNames } from '@monkvision/common-ui-web';
import Layout from '@theme/Layout';
import { IconCard, IconsTopBar } from '@site/src/components';
import styles from './styles.module.css';

const items = Object.values(iconNames).map((icon) => ({
  name: icon,
  component: <IconCard key={icon} icon={icon} />,
}));

export default function Icons() {
  const [lookupInput, setLookupInput] = useState('');
  const displayedItems = useMemo(() => {
    const filtered = lookupInput
      ? items.filter((item) => item.name.includes(lookupInput.toLowerCase()))
      : items;
    return filtered.map((item) => item.component);
  }, [lookupInput]);

  return (
    <Layout title='Icons' description='Official documentation for the MonkJs Icons.'>
      <IconsTopBar onLookupInput={setLookupInput} />
      <div className={styles['cards-container']}>{displayedItems}</div>
    </Layout>
  );
}
