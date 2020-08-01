module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  plugins: [
    'vuetify',
    '@typescript-eslint/eslint-plugin',
  ],
  rules: {
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'no-unused-vars': 'off',
    'import/no-extraneous-dependencies': 'off',
    'global-require': 'off',
    semi: ['off', 'always'],
    '@typescript-eslint/semi': ['warn', 'always'],
    'no-param-reassign': 'off',
  },
};
