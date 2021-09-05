/* eslint-disable react/no-danger */
import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Translate from '@docusaurus/Translate';
import { translate } from '@docusaurus/core/lib/client/exports/Translate';
import styles from './styles.module.css';

const features = [
  {
    key: 'feat-0',
    title: translate({
      id: 'homepage.features.use-cases.title',
      message: 'Use cases',
    }),
    imageUrl: 'undraw/undraw_city_driver_re_0x5e.svg',
    description: (
      <Translate
        id="homepage.features.use-cases"
        description="Use cases"
      >
        Applications are as various as insurance claims, check in and out rental vehicles,
        automate visual quality control for factories,
        remarketing or even car logistics from the factory to the reseller.
      </Translate>
    ),
  },
  {
    key: 'feat-1',
    title: translate({
      id: 'homepage.features.capture.title',
      message: 'Capture',
    }),
    imageUrl: 'undraw/undraw_Upload_image_re_svxx.svg',
    description: (
      <Translate
        id="homepage.features.capture"
        description="Capture"
      >
        Anyone can hold the cameras, experts as non professionals,
        with smartphones or fixed cameras.
        Our solution offers the possibility to assess the vehicle’s condition
        based on pictures from smartphones or fixed cameras.
      </Translate>
    ),
  },
  {
    key: 'feat-2',
    title: translate({
      id: 'homepage.features.ai.title',
      message: 'AI checks & detects',
    }),
    imageUrl: 'undraw/undraw_Data_extraction_re_0rd3.svg',
    description: (
      <Translate
        id="homepage.features.ai"
        description="AI checks & detects"
      >
        Technical, business and anti-fraud checks
        are instantly run to validate image exploitation.
        Detection and classification of all the damage
        classified by type, location and severity.
      </Translate>
    ),
  },
  {
    key: 'feat-3',
    title: translate({
      id: 'homepage.features.reports.title',
      message: 'Detailed analysis',
    }),
    imageUrl: 'undraw/undraw_Detailed_analysis_re_tk6j.svg',
    description: (
      <Translate
        id="homepage.features.reports"
        description="Detailed analysis"
      >
        Get a fully automated damage report and a precise cost estimation damage per damage.
        Normalize your vehicle inspection data to build stats and standard processes.
      </Translate>
    ),
  },
  {
    key: 'feat-4',
    title: translate({
      id: 'homepage.features.trust.title',
      message: 'Trusted results',
    }),
    imageUrl: 'undraw/undraw_Agreement_re_d4dv.svg',
    description: (
      <Translate
        id="homepage.features.trust"
        description="Trusted results"
      >
        “ Among all the solutions we have tested
        to automatically detect damage on vehicles from photos provided by our users,
        not only did Monk eclipse the competition but their results
        also exceeded by far our expectations. ”
        — Pierre Béret VP of Risk at Getaround
      </Translate>
    ),
  },
  {
    key: 'feat-5',
    title: translate({
      id: 'homepage.features.mindset.title',
      message: 'Developer mindset',
    }),
    imageUrl: 'undraw/undraw_Hacker_mindset_re_8a33.svg',
    description: (
      <Translate
        id="homepage.features.mindset"
        description="Developer mindset"
      >
        Simply connect to our API on a “plug and play” mode
        to start getting your first inspection reports.
        Access various outputs : triage, condition report,
        appraisal, comparison to a previous record.
      </Translate>
    ),
  },
];

// eslint-disable-next-line react/prop-types
function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig: { customFields = {}, tagline } = {} } = context;

  return (
    <Layout title={tagline} description={customFields.description}>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroProjectTagline}>
            <img
              alt="Monk logo"
              className={styles.heroLogo}
              src={useBaseUrl('animated-logo-slow.svg')}
            />
            <span
              className={styles.heroTitleTextHtml}
              dangerouslySetInnerHTML={{
                __html: translate({
                  id: 'homepage.hero.title',
                  message: `
                    AI-powered
                    <b>vehicle damage detection</b>
                    for fast and reliable inspections
                  `,
                  description: 'Home page hero title, can contain simple html tags',
                }),
              }}
            />
          </h1>
          <div className={styles.indexCtas}>
            <Link className={styles.indexCtasGetStartedButton} to={useBaseUrl('docs/')}>
              <Translate>Start using Monk</Translate>
            </Link>
          </div>
        </div>
      </div>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((feat) => (
                  <Feature {...feat} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
