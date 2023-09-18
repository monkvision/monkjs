import { PropsWithChildren } from 'react';

export const I18N_LANGUAGE_TEST_ID = 'i18n-language';

export function I18nextProviderMock(props: PropsWithChildren<{ i18n: { language: string } }>) {
  return (
    <div>
      <div data-testid={I18N_LANGUAGE_TEST_ID}>{props.i18n.language}</div>
      {props.children}
    </div>
  );
}
