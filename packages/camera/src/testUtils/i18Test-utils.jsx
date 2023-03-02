import { I18nextProvider } from 'react-i18next';
import i18 from '../i18n/index'
import {render} from '@testing-library/react-native';

const wrapInRouter = (component) => {
  return  <I18nextProvider i18={i18} >{component}</I18nextProvider>
};

const initiateComponent = (ui, renderOptions) => {
  if (!renderOptions) return ui;
  let component = <>{ui}</>;
  if (renderOptions.withI18) component = wrapInRouter(component, renderOptions);
  return component;
};

const customRender = (ui, renderOptions) => {
  try {
    const componentTree = initiateComponent(ui, renderOptions);
    return render(componentTree);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export * from '@testing-library/react-native';
export { customRender as render };