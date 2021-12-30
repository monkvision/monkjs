module.exports = {
  docsSidebar: ['intro', {
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
          'js/api/damages',
          'js/api/images',
          'js/api/inspections',
          'js/api/sight',
          'js/api/tasks',
          'js/api/views',
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
