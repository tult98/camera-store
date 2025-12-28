import rootConfig from '../../eslint.config.mjs';

export default [
  {
    ignores: ['**/.medusa/**', '**/dist/**'],
  },
  ...rootConfig,
];
