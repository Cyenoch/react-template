import antfu from '@antfu/eslint-config'
import oxlint from 'eslint-plugin-oxlint'

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
    '.db',
    'node_modules/',
    'public/',
    'src/routeTree.gen.ts',
    'src/types/',
    'src/server/database/schema/better-auth.ts',
  ],
}, oxlint.buildFromOxlintConfigFile('.oxlintrc.json'), {
  rules: {
    'react-hooks-extra/no-direct-set-state-in-use-effect': 'off',
    'no-console': 'off',
    'react/no-array-index-key': 'off',
    // Bug: Maximum call stack size exceeded
    'prefer-const': 'off',
    'unused-imports/no-unused-imports': 'off',
  },
})
