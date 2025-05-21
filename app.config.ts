import { defineConfig } from '@tanstack/react-start/config'
import Icons from 'unplugin-icons/vite'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  tsr: {
    appDirectory: 'src',
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
      }) as any,

      Icons({ compiler: 'jsx', jsx: 'react' }),
    ],
  },
})
