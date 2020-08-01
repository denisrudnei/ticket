const baseRules = require('../.eslintrc.js');

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  extends: ['@nuxtjs', 'airbnb-base'],
  plugins: ['vuetify', '@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-unused-vars': 'off',
      },
    },
  ],
  rules: {
    ...baseRules.rules,
    'func-names': 'off',
    'no-shadow': 'off',
    'no-console': 'off',
    'no-empty': 'off',
    'class-methods-use-this': 'off',
  },
};
