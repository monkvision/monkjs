module.exports = {
  docsSidebar: [{
    type: 'category',
    label: 'Getting Started',
    items: ['intro', 'install'/* , 'configure' */],
    collapsed: false,
  }, {
    type: 'category',
    label: 'Guides',
    items: [
      // 'js/guides/setting-up',
      'js/guides/picturing',
      'js/guides/authenticating',
      // 'js/guides/analyzing',
      // 'js/guides/manipulating',
      // 'js/guides/displaying',
    ],
    collapsed: false,
  }, {
    type: 'category',
    label: 'Packages',
    items: [
      {
        type: 'category',
        label: 'JavaScript',
        items: [
          'js/api/corejs',
        ],
      },
      {
        type: 'category',
        label: 'React Native',
        items: [
          'js/api/react-native',
          'js/api/react-native-views',
        ],
      },
    ],
    collapsed: false,
  },
  'troubleshooting',
  ],
};
