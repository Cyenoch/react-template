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
    '.vinxi/',
    '.output/',
    'node_modules/',
    'public/',
    'app/routeTree.gen.ts',
    'app/types/',
  ],
}, oxlint.buildFromOxlintConfigFile('.oxlintrc.json'), {
  rules: {
    'react-hooks-extra/no-direct-set-state-in-use-effect': 'off',
  },
})
