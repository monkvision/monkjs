module.exports = {
  docsSidebar: ['intro', {
    type: 'category',
    label: 'Guides',
    items: [
      'js/guides/setting-up',
      'js/guides/picturing',
      'js/guides/authenticating',
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
          'js/api/tasks',
          'js/api/views',
        ],
      },
      {
        type: 'category',
        label: 'React Native',
        items: [
          'js/api/components/capture',
          'js/api/components/damage-highlight',
        ],
      },
    ],
    collapsed: false,
  },
  'troubleshooting',
  ],
};
