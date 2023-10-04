import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import React, { JSX } from 'react';
import { HomeFeatures, HomeHeader } from '@site/src/components';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title={siteConfig.title} description='Official documentation for the MonkJs SDK.'>
      <HomeHeader />
      <main>
        <HomeFeatures />
      </main>
    </Layout>
  );
}
