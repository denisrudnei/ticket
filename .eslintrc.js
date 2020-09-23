module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  extends: [
    'plugin:vue/recommended',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 11,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: [
    'vue',
    'vuetify',
    '@typescript-eslint',
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
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'off',
  },
};
