module.exports = {
  docsSidebar: [{
    type: 'category',
    label: 'Getting Started',
    items: ['intro', 'install', 'configure'],
  }, {
    type: 'category',
    label: 'JavaScript',
    items: [{
      type: 'category',
      label: 'Guides',
      items: [
        'js/guides/picturing',
        'js/guides/analyzing',
        'js/guides/manipulating',
        'js/guides/displaying',
      ],
    }, {
      type: 'category',
      label: 'Components',
      items: [
        'js/components/react-native',
        'js/components/react-native-views',
      ],
    }, {
      type: 'category',
      label: 'API',
      items: [
        'js/api/corejs',
        'js/api/react-native',
        'js/api/react-native-views',
      ],
    }],
  }],
};
