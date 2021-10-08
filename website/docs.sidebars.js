module.exports = {
  docsSidebar: [{
    type: 'category',
    label: 'Getting Started',
    items: ['intro', 'install'/* , 'configure' */],
  }, {
    type: 'category',
    label: 'JavaScript',
    items: [{
      type: 'category',
      label: 'Guides',
      items: [
        'js/guides/picturing',
        // 'js/guides/analyzing',
        // 'js/guides/manipulating',
        // 'js/guides/displaying',
      ],
    }, {
      type: 'category',
      label: 'APIs 🚧',
      items: [
        'js/api/corejs',
        'js/api/react-native',
        'js/api/react-native-views',
      ],
    }],
  }],
};
