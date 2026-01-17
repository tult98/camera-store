module.exports = {
  displayName: 'admin-dashboard',
  preset: '../../jest.preset.js',
  rootDir: '.',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
          target: 'es2020',
        },
        module: { type: 'commonjs' },
      },
    ],
  },
  setupFiles: ['<rootDir>/jest.polyfills.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@providers/(.*)$': '<rootDir>/src/providers/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@camera-store/ui$': '<rootDir>/../../libs/ui/src/index.ts',
    '^@camera-store/msw-handlers$': '<rootDir>/../../libs/msw-handlers/src/index.ts',
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/src/**/*(*.)@(spec|test).[jt]s?(x)',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(msw|@mswjs|@bundled-es-modules|@open-draft|until-async|strict-event-emitter|statuses|outvariant|is-node-process)/)',
  ],
};
