import antfu from '@antfu/eslint-config'
import pluginQuery from '@tanstack/eslint-plugin-query'

export default antfu({
  vue: false,
  yaml: false,
  markdown: false,
  react: true,
  javascript: false,
  unocss: false,
  ignores: [
    'dist',
  ],
}, {
  rules: {
    'no-console': 'off',
    'ts/no-use-before-define': 'off',
    'node/prefer-global/process': 'off',
    'node/prefer-global/buffer': 'off',
    'unused-imports/no-unused-imports': 'warn',
  },
}).prepend(
  ...pluginQuery,
)
