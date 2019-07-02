module.exports = {
  presets: ['@babel/preset-env'],
  env: {
    production: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current'
            }
          }
        ],
        '@nuxt/babel-preset-app'
      ]
    },
    development: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current'
            }
          }
        ],
        '@nuxt/babel-preset-app'
      ]
    },
    test: {
      presets: [['@babel/preset-env']]
    }
  }
}
