module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    NODE_ENV: true,
  },
  rules: {
    'no-console': 0,
    '@typescript-eslint/dot-notation': 0,
    '@typescript-eslint/no-unused-expressions': 0,
    '@typescript-eslint/no-loop-func': 0,
    '@typescript-eslint/no-redeclare': 0,
    '@typescript-eslint/no-shadow': 0,
    'react-hooks/rules-of-hooks': 0,
    'prefer-promise-reject-errors': 0,
    'no-return-await': 0,
  },
};
