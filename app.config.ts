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
        'clsx',
        'react',
        'react-dom',
        'tailwind-merge',
        'core-js/stable',
        'react-dom/client',
        '@radix-ui/react-slot',
        '@tanstack/react-query',
        '@tanstack/react-start',
        '@tanstack/react-router',
        'class-variance-authority',
        'regenerator-runtime/runtime',
        '@tanstack/react-router-with-query',
        '@tanstack/react-start/server-functions-client',
      ],
    },
    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }) as any,

      Icons({ compiler: 'jsx', jsx: 'react' }),
    ],

    build: {
      target: 'ES2020',
      sourcemap: true,
    },
  },
})
