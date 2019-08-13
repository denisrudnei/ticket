const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: ['~/assets/style/app.styl'],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '@/plugins/vuetify' },
    { src: '@/plugins/socketIo', ssr: false },
    { src: '@/plugins/apex-charts', ssr: false },
    { src: '@/plugins/google-maps', ssr: false },
    { src: '@/plugins/CKEditor', ssr: false }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/toast',
    '@nuxtjs/auth',
    '@nuxtjs/google-analytics'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    proxy: true,
    prefix: '/api'
  },

  router: {
    middleware: ['auth']
  },

  toast: {
    position: 'top-left'
  },

  auth: {
    redirect: {
      login: '/auth/',
      logout: '/auth/logout',
      callback: '/auth/callback',
      home: '/'
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: 'auth/login',
            method: 'post',
            propertyName: 'user'
          },
          user: {
            url: 'auth/user',
            method: 'post',
            propertyName: 'user'
          },
          logout: {
            url: 'auth/logout',
            method: 'post'
          }
        }
      },
      auth0: {
        domain: 'bm-dns.auth0.com',
        client_id: 'hHLA1yh4Ffvj1xyWhZzEzgk5Hz9GNHY2'
      }
    }
  },

  googleAnalytics: {
    id: 'UA-38858408-3'
  },

  /*
  ** Build configuration
  */
  build: {
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },

    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
