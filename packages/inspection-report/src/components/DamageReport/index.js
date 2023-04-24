import React from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from '../../i18n';
import DamageReport from './DamageReport';

function DamageReportHOC(props) {
  return (
    <I18nextProvider i18n={i18n}>
      <DamageReport {...props} />
    </I18nextProvider>
  );
}

export default DamageReportHOC;
