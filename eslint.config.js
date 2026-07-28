'use strict';

const { fixupPluginRules } = require('@eslint/compat');
const js = require('@eslint/js');
const globals = require('globals');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const reactNativePlugin = require('eslint-plugin-react-native');

module.exports = [
  // Global ignores (replaces .eslintignore + ignorePatterns)
  {
    ignores: [
      '**/*.md',
      '.github/**',
      'android/**',
      'ios/**',
      'vendor/**',
      '.yarn/**',
      'node_modules/**',
      'babel.config.js',
      'metro.config.js',
      'jest.config.js',
      '.prettierrc.js',
      'eslint.config.js',
    ],
  },

  // Base JS rules
  js.configs.recommended,

  // React (native flat config)
  {
    ...reactPlugin.configs.flat.recommended,
    settings: { react: { version: '19' } },
  },

  // React Hooks (native flat config)
  reactHooksPlugin.configs.flat.recommended,

  // Prettier — disable conflicting rules, then enforce formatting
  prettierConfig,
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'error',
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
    },
  },

  // Global rule overrides for all files
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-console': 'warn',
      'no-warning-comments': [
        'error',
        { terms: ['NOCOMMIT', 'DO_NOT_COMMIT', '!!!'], location: 'anywhere' },
      ],
    },
  },

  // TypeScript + React Native — TS/TSX files only
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react-native': fixupPluginRules(reactNativePlugin),
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        __DEV__: 'readonly',
      },
    },
    settings: {
      react: { version: '19' },
    },
    rules: {
      // Spread typescript-eslint recommended rules
      ...tsPlugin.configs.recommended.rules,

      // React
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/self-closing-comp': ['error', { component: true }],
      'react/prop-types': 'off',

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React Native
      'react-native/no-unused-styles': 'error',
      'react-native/no-color-literals': 'error',
      'react-native/no-raw-text': 'error',
      'react-native/split-platform-components': 'error',

      // React JSX
      'react/jsx-newline': ['error', { prevent: false }],

      // General
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
      ],

      // TS — disable base JS rules that have TS-aware replacements
      'no-unused-vars': 'off',
      'no-unused-expressions': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        { ignoreRestSiblings: true, argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/ban-ts-comment': ['warn', { 'ts-ignore': 'allow-with-description' }],
    },
  },

  // Test file overrides
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
  },
];
