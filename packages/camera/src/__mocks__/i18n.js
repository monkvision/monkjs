module.exports = () => ({
  useTranslation: () => ({
    t: (str) => str,
    i18n: {
      changeLanguage: () => Promise.resolve(),
    },
  }),
});
