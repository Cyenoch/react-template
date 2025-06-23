import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';

export default defineConfig({
  // server: {
  //   preset: 'bun',
  // },
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
    }),

    Icons({ compiler: 'jsx', jsx: 'react' }),

    tanstackStart({
      target: 'bun',
    }),
  ],

  build: {
    target: 'ES2020',
    sourcemap: true,
  },
});
