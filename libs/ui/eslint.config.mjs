import rootConfig from '../../eslint.config.mjs';

export default [
  {
    ignores: ['**/dist/**', '**/storybook-static/**'],
  },
  ...rootConfig,
];
