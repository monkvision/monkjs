module.exports = {
  title: 'Monk',
  url: 'https://monkvision.github.io',
  projectName: 'monk',
  organizationName: 'monkvision',
  baseUrl: '/monkjs/',
  favicon: 'favicon.png',
  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    customCss: [require.resolve('./docs.custom.css')],
    navbar: {
      title: 'Monk',
      logo: {
        alt: 'Monk logo',
        src: 'logo.svg',
      },
      items: [
        { to: 'docs', label: 'Docs', position: 'left' },
        { to: 'sights', label: 'Sights', position: 'left' },
        { to: 'blog', label: 'Blog', position: 'left' },
        { to: 'licence', label: 'License', position: 'left' },
      ],
    },
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} Monk, Inc.`,
    },
    liveCodeBlock: {
      playgroundPosition: 'bottom',
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./docs.sidebars.js'),
          // eslint-disable-next-line global-require
          remarkPlugins: [require('mdx-mermaid')],
        },
        blog: {
          blogSidebarCount: 'ALL',
          blogSidebarTitle: 'All Blog Posts',
          feedOptions: {
            type: 'all',
            copyright: `Copyright © ${new Date().getFullYear()} Monk, Inc.`,
          },
        },
        sitemap: {
          changefreq: 'monthly',
          priority: 0.5,
        },
      },
    ],
  ],
  plugins: [
    '@docusaurus/theme-live-codeblock',
  ],
};
