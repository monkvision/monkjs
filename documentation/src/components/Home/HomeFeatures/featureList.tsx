import React, { JSX, ComponentType, ComponentProps } from 'react';

export interface FeatureItem {
  title: string;
  Svg: ComponentType<ComponentProps<'svg'>>;
  description: JSX.Element;
}

export const featureList: FeatureItem[] = [
  {
    title: 'Use Cases',
    Svg: require('@site/static/img/undraw_city_driver.svg').default,
    description: (
      <>
        Applications are as various as insurance claims, check in and out rental vehicles, automate
        visual quality control for factories, remarketing or even car logistics from the factory to
        the reseller.
      </>
    ),
  },
  {
    title: 'Capture',
    Svg: require('@site/static/img/undraw_upload_image.svg').default,
    description: (
      <>
        Anyone can hold the cameras, experts as non professionals, with smartphones or fixed
        cameras. Our solution offers the possibility to assess the vehicle’s condition based on
        pictures from smartphones or fixed cameras.
      </>
    ),
  },
  {
    title: 'AI Checks & Detects',
    Svg: require('@site/static/img/undraw_data_extraction.svg').default,
    description: (
      <>
        Technical, business and anti-fraud checks are instantly run to validate image exploitation.
        Detection and classification of all the damage classified by type, location and severity.
      </>
    ),
  },
  {
    title: 'Detailed Analysis',
    Svg: require('@site/static/img/undraw_detailed_analysis.svg').default,
    description: (
      <>
        Get a fully automated damage report and a precise cost estimation damage per damage.
        Normalize your vehicle inspection data to build stats and standard processes.
      </>
    ),
  },
  {
    title: 'Trusted Results',
    Svg: require('@site/static/img/undraw_agreement.svg').default,
    description: (
      <>
        <span style={{ fontStyle: 'italic' }}>
          « Among all the solutions we have tested to automatically detect damage on vehicles from
          photos provided by our users, not only did Monk eclipse the competition but their results
          also exceeded by far our expectations. »
        </span>
        <span> — Pierre Béret, VP of Risk at Getaround</span>
      </>
    ),
  },
  {
    title: 'Developer Mindset',
    Svg: require('@site/static/img/undraw_hacker_mindset.svg').default,
    description: (
      <>
        Simply connect to our API on a “plug and play” mode to start getting your first inspection
        reports. Access various outputs : triage, condition report, appraisal, comparison to a
        previous record.
      </>
    ),
  },
];
