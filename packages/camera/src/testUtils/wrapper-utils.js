import React from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { render } from '@testing-library/react-native';

const wrapInRouter = (component) => (
  <I18nextProvider i18={initReactI18next()}>
    {component}
  </I18nextProvider>
);

const initiateComponent = (ui, renderOptions) => {
  if (!renderOptions) { return ui; }
  let component = ui;
  if (renderOptions.withI18) { component = wrapInRouter(component, renderOptions); }
  return component;
};

const customRender = (ui, renderOptions) => {
  const componentTree = initiateComponent(ui, renderOptions);
  return render(componentTree);
};

export * from '@testing-library/react-native';
export { customRender as render };
