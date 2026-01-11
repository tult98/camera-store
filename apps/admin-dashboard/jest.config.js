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
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@providers/(.*)$': '<rootDir>/src/providers/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@camera-store/ui$': '<rootDir>/../../libs/ui/src/index.ts',
  },
  testMatch: [
    '**/__tests__/**/*.spec.ts',
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.spec.tsx',
    '**/__tests__/**/*.test.tsx',
  ],
};
