module.exports = {
  displayName: 'api',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: false,
            decorators: false,
          },
          target: 'es2020',
        },
        module: {
          type: 'commonjs',
        },
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.[jt]s',
    '<rootDir>/src/**/*(*.)@(spec|test).[jt]s',
  ],
  coverageDirectory: '../../coverage/libs/api',
  maxWorkers: '50%',
};
