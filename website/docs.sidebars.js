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
      'js/guides/setting-up',
      'js/guides/picturing',
      'js/guides/authenticating',
      // 'js/guides/analyzing',
      // 'js/guides/manipulating',
      // 'js/guides/displaying',
    ],
    collapsed: false,
  }, {
    type: 'category',
    label: 'APIs',
    items: [
      {
        type: 'category',
        label: 'JavaScript',
        items: [
          'js/api/sight',
        ],
      },
      {
        type: 'category',
        label: 'React Native',
        items: [
          'js/api/components/capture-damage',
          'js/api/components/capture-tour',
          'js/api/components/damage-highlight',
          'js/api/components/damage-library',
          'js/api/components/inspected-vehicle',
        ],
      },
    ],
    collapsed: false,
  },
  'troubleshooting',
  ],
};
