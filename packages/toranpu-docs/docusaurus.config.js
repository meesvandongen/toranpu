// @ts-check

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Toranpu",
  tagline: "Simple pagination",
  url: "https://your-docusaurus-test-site.com",
  baseUrl: "/toranpu",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon_toranpu.png",
  organizationName: "meesvandongen",
  projectName: "toranpu",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          editUrl:
            "https://github.com/meesvandongen/toranpu/tree/main/packages/toranpu-docs/",
          routeBasePath: "/",
          path: "../toranpu/docs",
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themes: ["@docusaurus/theme-live-codeblock"],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Toranpu",
        logo: {
          alt: "Toranpu Logo",
          src: "img/logo_toranpu.png",
        },
        items: [
          {
            href: "https://github.com/meesvandongen/toranpu.git",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
