module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:prettier/recommended'
  ],
  plugins: [
    'prettier',
    'vuetify'
  ],
  // add your custom rules here
  rules: {
    'vuetify/no-deprecated-classes': 'error'
  }
}
