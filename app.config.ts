import { defineConfig } from '@tanstack/start/config'
import autoImport from 'unplugin-auto-import/vite'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  tsr: {
    appDirectory: 'app',
  },
  server: {
    preset: 'bun',
  },
  vite: {
    optimizeDeps: {
      include: [
        '@tanstack/react-start',
        'react-dom/client',
        '@tanstack/react-router',
        '@tanstack/react-router-with-query',
        '@tanstack/react-query',
        '@radix-ui/react-slot',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
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
