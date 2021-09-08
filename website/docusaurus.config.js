module.exports = {
  title: 'Monk',
  url: 'https://monkvision.github.io',
  projectName: 'monk',
  organizationName: 'monkvision',
  baseUrl: '/monk/',
  trailingSlash: false,
  favicon: 'favicon.png',
  themeConfig: {
    customCss: [require.resolve('./docs.custom.css')],
    navbar: {
      title: 'Monk',
      logo: {
        alt: 'Monk logo',
        src: 'logo.svg',
      },
      items: [
        { to: 'docs', label: 'Docs', position: 'left' },
        { to: 'blog', label: 'Blog', position: 'left' },
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
          trailingSlash: false,
        },
      },
    ],
  ],
  plugins: [
    '@docusaurus/theme-live-codeblock',
  ],
};
