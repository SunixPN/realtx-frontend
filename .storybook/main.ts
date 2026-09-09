import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],

  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
  ],

  framework: '@storybook/nextjs-vite',

  staticDirs: ['../public'],

  docs: {
    autodocs: 'tag',
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
