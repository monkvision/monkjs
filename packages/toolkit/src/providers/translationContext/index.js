import React from 'react';

const translationContextTemplate = {
  i18n: null,
};

const TranslationContext = React.createContext(translationContextTemplate);

export default TranslationContext;
