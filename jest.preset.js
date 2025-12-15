const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  transform: undefined,
  coverageReporters: ['html', 'text'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
};
