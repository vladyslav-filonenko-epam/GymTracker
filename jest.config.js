/** @type {import('jest').Config} */
const config = {
  preset: 'react-native',

  // Use the root jest-environment-node (Jest 30) instead of the one bundled
  // inside react-native (jest 29) to avoid the `clearMocksOnScope` mismatch.
  testEnvironment: 'node',
  testEnvironmentOptions: {
    customExportConditions: ['require', 'react-native'],
  },

  // Override transform to handle SVG as mock component
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },

  // SVG imports → lightweight mock component
  moduleNameMapper: {
    '\\.svg$': '<rootDir>/__mocks__/svgMock.tsx',
  },

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Transpile RN ecosystem packages that ship as ESM / untranspiled source
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      [
        'react-native',
        '@react-native(-community)?',
        '@react-navigation',
        'react-native-screens',
        'react-native-safe-area-context',
        'react-native-gesture-handler',
        'react-native-pager-view',
        'react-native-svg',
      ].join('|') +
      ')/)',
  ],

  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],

  // Automatically reset/restore mocks between tests
  clearMocks: true,
  restoreMocks: true,

  // Coverage
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.styles.ts',
    '!src/**/*.consts.ts',
    '!src/**/index.ts',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },

  verbose: true,
};

module.exports = config;
