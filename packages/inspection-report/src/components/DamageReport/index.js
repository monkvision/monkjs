import React from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n from '../../i18n';
import DamageReport from './DamageReport';
import { CurrencyProvider } from '../../hooks';

function DamageReportHOC(props) {
  return (
    <I18nextProvider i18n={i18n}>
      <CurrencyProvider>
        <DamageReport {...props} />
      </CurrencyProvider>
    </I18nextProvider>
  );
}

export default DamageReportHOC;
