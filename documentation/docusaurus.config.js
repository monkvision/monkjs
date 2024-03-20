// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'MonkJs Documentation',
  tagline: 'The complete documentation for the MonkJs SDK.',
  favicon: 'img/favicon.png',
  url: 'https://monkvision.github.io',
  baseUrl: '/monkjs/',
  projectName: 'monk',
  organizationName: 'monkvision',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/monkvision/monkjs/blob/main/documentation/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        pages: {
          path: 'src/pages',
          routeBasePath: '/',
          include: ['**/*.{js,jsx,ts,tsx,md,mdx}'],
          exclude: [
            '**/_*.{js,jsx,ts,tsx,md,mdx}',
            '**/_*/**',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**',
          ],
          mdxPageComponent: '@theme/MDXPage',
          remarkPlugins: [],
          rehypePlugins: [],
          beforeDefaultRemarkPlugins: [],
          beforeDefaultRehypePlugins: [],
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/monkjs-social-card.jpg',
      navbar: {
        title: 'MonkJs',
        logo: {
          alt: 'MonkJs',
          src: 'img/animated-logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Docs',
          },
          { to: 'sights', label: 'Sights', position: 'left' },
          { to: 'icons', label: 'Icons', position: 'left' },
          {
            href: 'https://github.com/monkvision/monkjs',
            label: 'GitHub',
            position: 'right',
          },
          { to: 'license', label: 'License', position: 'right' },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'MonkJs SDK',
                to: '/docs/introduction',
              },
            ],
          },
          {
            title: 'External Docs',
            items: [
              {
                label: 'API Swagger',
                href: 'https://api.monk.ai/v1/apidocs',
              },
              {
                label: 'API Documentation',
                href: 'https://documentation.preview.monk.ai',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Website',
                href: 'https://monk.ai/',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/monkvision/monkjs',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Monk, Inc.`,
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
