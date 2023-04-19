import React from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from '../i18n';
import DamageReport from './DamageReport';

function DamageReportProvider() {
  return (
    <I18nextProvider i18n={i18n}>
      <DamageReport />
    </I18nextProvider>
  );
}

export default DamageReportProvider;
