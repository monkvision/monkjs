module.exports = {
  docsSidebar: ['intro', {
    type: 'category',
    label: 'Guides',
    items: [
      'js/guides/setting-up',
      'js/guides/authenticating',
      'js/guides/picturing',
      'js/guides/requesting',
      'js/guides/visualizing',
      'js/guides/upgrading-to-3.5',
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
          'js/api/damage',
          'js/api/image',
          'js/api/inspection',
          'js/api/task',
          'js/api/view',
        ],
      },
      {
        type: 'category',
        label: 'React Native',
        items: [
          'js/api/components/capture',
          'js/api/components/damage-highlight',
          'js/api/components/damage-annotation',
        ],
      },
    ],
    collapsed: false,
  },
  'troubleshooting',
  'monitoring',
  'inspection-report',
  ],
};
