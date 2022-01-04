import { useEffect, useMemo } from 'react';
import identity from 'lodash.identity';

const useTranslation = () => ({
  t: (a, b) => identity(b),
}); // change it by a real translation hook

/**
 * Build a meta object from translations
 * @param viewName {string}
 * @param description {string}
 * @param title {string}
 * @returns {{description: string, title: string}}
 */
const useViewMeta = (viewName, description, title) => {
  const { t } = useTranslation(viewName);

  const translations = useMemo(() => ({
    description: t('description', description),
    title: t('title', title),
  }), [description, t, title]);

  useEffect(() => {
    document.title = translations.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', translations.description);
  }, [translations]);

  return translations;
};

export default useViewMeta;
