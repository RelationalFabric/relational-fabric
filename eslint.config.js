import antfu from '@antfu/eslint-config'

export default antfu({
  // Enable all features
  typescript: true,
  vue: true,
  react: false,
  unocss: false,
  markdown: false,

  // Monorepo configuration
  ignores: [
    'dist',
    'node_modules',
    'coverage',
    '*.config.*',
    '*.d.ts',
  ],

  // Custom rules for your project
  rules: {
    // Enable stricter rules
    'no-console': 'warn',
    'prefer-const': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'unused-imports/no-unused-imports': 'error',
    'ts/no-unused-expressions': 'error',
    'unicorn/error-message': 'warn',
    'unicorn/prefer-number-properties': 'warn',
    'no-empty': 'warn',
    'ts/no-explicit-any': 'error',
  },
})
