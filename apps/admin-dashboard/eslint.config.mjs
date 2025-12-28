import rootConfig from '../../eslint.config.mjs';

export default [
  {
    ignores: ['**/dist/**', '**/.react-router/**'],
  },
  ...rootConfig,
];
