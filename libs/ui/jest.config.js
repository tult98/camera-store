module.exports = {
  displayName: 'ui',
  preset: '../../jest.preset.js',
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
            decorators: false,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
          target: 'es2020',
        },
        module: {
          type: 'commonjs',
        },
      },
    ],
  },

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],

  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/src/**/*(*.)@(spec|test).[jt]s?(x)',
  ],

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/__mocks__/fileMock.js',
    '^@camera-store/ui$': '<rootDir>/src/index.ts',
    '^@camera-store/ui/(.*)$': '<rootDir>/src/$1',
  },

  coverageDirectory: '../../coverage/libs/ui',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '.stories.tsx',
    '.stories.ts',
    'test-setup.ts',
  ],

  maxWorkers: '50%',
};
