import React from 'react';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Homepage from '@site/src/components/Homepage';
import Layout from '@theme/Layout';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <main>
        <Homepage />
      </main>
    </Layout>
  );
}
