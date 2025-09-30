import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { HomeFeatures, HomeHeader } from '@site/src/components';

export default function Home() {
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
