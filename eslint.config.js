import antfu from '@antfu/eslint-config'
import pluginRouter from '@tanstack/eslint-plugin-router'
import pluginQuery from '@tanstack/eslint-plugin-query'

/** @type {import("eslint").Linter.Config[]} */
const config = antfu({
  gitignore: true,
  react: true,
  jsx: true,
  vue: false,
  yaml: false,
  markdown: false,
  astro: false,
  solid: false,
  svelte: false,
  unocss: false,
}, {
  ignores: [
    'dist',
    'node_modules',
    '.vscode',
    'public',
    'src/assets',
    '.gitignore',
    'scripts',
    'README.md',
    'bun.lockb',
    'src/components/ui',
    'src/routeTree.gen.ts',
  ],
}, {
  rules: {
    'no-console': 'off',
    'ts/no-use-before-define': 'off',
    'node/prefer-global/process': 'off',
    'node/prefer-global/buffer': 'off',
    'unused-imports/no-unused-imports': 'warn',
  },
}, {
  files: ['tailwind.config.js', 'postcss.config.js'],
  rules: {
    'import/no-anonymous-default-export': 'off',
  },
},
  ...pluginRouter.configs['flat/recommended'],
  ...pluginQuery.configs['flat/recommended'],
)

export default config
