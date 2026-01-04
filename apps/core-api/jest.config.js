/* global module */
module.exports = {
  displayName: 'core-api',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.[jt]s$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', decorators: true },
          transform: {
            legacyDecorator: true,
            decoratorMetadata: true,
          },
          keepClassNames: true,
          target: 'es2020',
        },
        module: { type: 'commonjs' },
      },
    ],
  },
  moduleFileExtensions: ['js', 'ts', 'json'],
  testMatch: ['**/__tests__/**/*.spec.ts', '**/*.spec.ts'],
  modulePathIgnorePatterns: ['dist/', 'node_modules/'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^src/(.*)$': '<rootDir>/src/$1',
  },
};
