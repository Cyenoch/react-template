import antfu from '@antfu/eslint-config'

export default antfu({
  vue: false,
  react: true,
  formatters: {
    css: true,
  },
  ignores: [
    '.vscode/',
    '.output/',
    '.vinxi/',
    'node_modules/',
    'public/',
    'src/components/ui/',
    'src/routeTree.gen.ts',
  ],
  rules: {
    'react-hooks-extra/no-direct-set-state-in-use-effect': 'off',
    'no-console': 'off',
    'react/no-array-index-key': 'off',
    // Bug: Maximum call stack size exceeded
    'prefer-const': 'off',
    'unused-imports/no-unused-imports': 'off',
    'no-debugger': 'off',
  },
})
