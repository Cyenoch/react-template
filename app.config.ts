import { defineConfig } from '@tanstack/react-start/config'
import autoImport from 'unplugin-auto-import/vite'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  vite: {
    optimizeDeps: {
      include: [
        '@tanstack/react-start',
        'react-dom/client',
        '@tanstack/react-router',
        '@tanstack/react-router-with-query',
        '@tanstack/react-query',
      ],
    },
    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),

      autoImport({
        imports: [
          'react',
        ],
        dts: 'app/types/auto-imports.d.ts',
      }),
    ],
  },
})
