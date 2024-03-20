import React from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const Empty = () => <></>;
const Icon = ExecutionEnvironment.canUseDOM ? require('@monkvision/common-ui-web').Icon : Empty;
const DynamicSVG = ExecutionEnvironment.canUseDOM
  ? require('@monkvision/common-ui-web').DynamicSVG
  : Empty;

export { Icon, DynamicSVG };
