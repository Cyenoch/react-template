import antfu from '@antfu/eslint-config'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import { fixupPluginRules } from '@eslint/compat'
import pluginQuery from '@tanstack/eslint-plugin-query'

const patchedReactHooksPlugin = fixupPluginRules(reactHooksPlugin)

/** @type {import("eslint").Linter.Config[]} */
const config = antfu({
  gitignore: true,
  react: false,
  jsx: true,
  vue: false,
  yaml: false,
  markdown: false,
  astro: false,
  solid: false,
  svelte: false,
  unocss: false,
  plugins: {
    react: reactPlugin,
  },
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
  ],
}, ...pluginQuery.configs['flat/recommended'], {
  name: 'Country: react hooks plugin',
  plugins: { 'react-hooks': patchedReactHooksPlugin },
  rules: {
    ...patchedReactHooksPlugin.configs.recommended.rules,
    'react-hooks/exhaustive-deps': ['error'],
  },
}, {
  rules: {
    'no-console': 'off',
    'ts/no-use-before-define': 'off',
    'node/prefer-global/process': 'off',
    'node/prefer-global/buffer': 'off',
    'unused-imports/no-unused-imports': 'warn',
    'react/jsx-boolean-value': 'error',
    'react/jsx-max-props-per-line': 'error',
    'react/jsx-sort-props': [
      'error',
      {
        callbacksLast: true,
        shorthandFirst: true,
        reservedFirst: true,
        multiline: 'last',
      },
    ],
  },
}, {
  files: ['tailwind.config.js', 'postcss.config.js'],
  rules: {
    'import/no-anonymous-default-export': 'off',
  },
})

export default config
