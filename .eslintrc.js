module.exports = {
  root: true,
  extends: '@react-native',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['warn'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'no-duplicate-imports': 'error',
        'no-unused-vars': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
        'react-native/no-inline-styles': 'off',
        'react/no-unstable-nested-components': 'off',
        'react/self-closing-comp': 'off',
        'prettier/prettier': [
          'error',
          {},
          {
            usePrettierrc: true,
          },
        ],
      },
    },
  ],
};
