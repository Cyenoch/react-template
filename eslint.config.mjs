import antfu from '@antfu/eslint-config'
import oxlint from 'eslint-plugin-oxlint'

export default antfu({
  vue: false,
  react: true,
  ignores: [
    '.vscode/',
    '.vinxi/',
    'node_modules/',
    'public/',
    'app/routeTree.gen.ts',
    'app/types/',
  ],
}, oxlint.buildFromOxlintConfigFile('.oxlintrc.json'))
