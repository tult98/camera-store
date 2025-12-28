import rootConfig from '../../eslint.config.mjs';

export default [
  {
    ignores: ['**/.next/**', '**/out/**'],
  },
  ...rootConfig,
];
