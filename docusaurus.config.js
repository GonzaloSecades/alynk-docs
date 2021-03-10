module.exports = {
  title: 'Alynk App ',
  tagline: 'Alynk App Docs',
  url: 'https://alynk-docs.netlify.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/isologotipoAsset4.png',
  organizationName: 'Alynk S.A.', // Usually your GitHub org/user name.
  projectName: 'Alynk app Docs', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Alynk',
      logo: {
        alt: 'Alynk S.A.',
        src: 'img/isologotipoAsset4.png',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Doc',
          items: [
            {
              label: 'Intro',
              to: 'docs/introAlynk',
            },
          
          ],
        },
        {
          title: 'About Us',
          items: [
            {
              label: 'Alynk Web',
              href: 'http://www.alynk.com.ar',
            },
            
          ],
        },
        {
          title: 'App',
          items: [
            {
              label: 'Android',
              to: 'https://play.google.com/store/apps/details?id=ar.com.alynk.alynkapp&hl=en_SG&gl=US',
            },
            {
              label: 'iOS',
              href: 'https://apps.apple.com/us/app/alynk/id1491059231?l=es',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Alynk S.A.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
