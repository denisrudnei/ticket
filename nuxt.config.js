const colors = require('vuetify/es5/util/colors').default;
const pkg = require('./package');

module.exports = {
  telemetry: false,

  target: 'static',

  generate: {
    fallback: true,
  },

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons',
      },
    ],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: [],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '@/plugins/dateFilter', ssr: true },
    { src: '@/plugins/apex-charts', ssr: false },
    { src: '@/plugins/google-maps', ssr: false },
    { src: '@/plugins/CKEditor', ssr: false },
    { src: '@/plugins/vue-hotkey', ssr: false },
    { src: '@/plugins/i18n', ssr: true },
  ],

  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/vuetify',
    '@nuxt/typescript-build',
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/toast',
    '@nuxtjs/apollo',
    '@nuxtjs/auth',
    '@nuxtjs/google-analytics',
  ],

  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: process.env.API,
  },

  vuetify: {
    customVariables: [],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#673ab7',
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  router: {
    middleware: ['auth'],
  },

  toast: {
    position: 'top-left',
  },

  auth: {
    redirect: {
      login: '/auth/login',
      logout: '/auth/logout',
      callback: '/auth/callback',
      home: '/',
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: 'auth/login',
            method: 'post',
            propertyName: 'user',
          },
          user: {
            url: 'auth/user',
            method: 'post',
            propertyName: 'user',
          },
          logout: {
            url: 'auth/logout',
            method: 'post',
          },
        },
      },
      auth0: {
        domain: 'bm-dns.auth0.com',
        client_id: 'hHLA1yh4Ffvj1xyWhZzEzgk5Hz9GNHY2',
        scope: ['email', 'openid', 'name', 'profile', 'picture'],
        userinfo_endpoint: 'https://bm-dns.auth0.com/userinfo',
      },
    },
  },

  googleAnalytics: {
    id: 'UA-38858408-3',
  },

  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: process.env.GRAPHQL || 'http://localhost:3000/graphql',
        wsEndpoint: process.env.SUBSCRIPTIONS || 'ws://localhost:3000/subscriptions',
      },
    },
    tokenName: 'auth._token.local',
    authenticationType: 'Bearer',
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      config.module.rules.push({
        test: /\.graphql?$/,
        exclude: /node_modules/,
        loader: 'webpack-graphql-loader',
      });
    },
  },
};
