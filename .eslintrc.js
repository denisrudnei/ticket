module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  extends: [
    '@nuxtjs',
    'plugin:prettier/recommended'
  ],
  plugins: [
    'prettier',
    'vuetify',
    '@typescript-eslint'
  ],
  // add your custom rules here
  rules: {
    'vuetify/no-deprecated-classes': 'error',
    '@typescript-eslint/rule-name': 'error'
  }
}
