import icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import autoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  optimizeDeps: {
    exclude: ['@hookform/resolvers/zod', 'better-auth/react'],
  },
  server: {
    warmup: {
      ssrFiles: ['src/server.ts'],
      clientFiles: ['src/client.tsx'],
    },
  },
  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),

    icons({ compiler: 'jsx', jsx: 'react' }),

    tanstackStart({
      target: 'bun',
      customViteReactPlugin: true,
    }),

    react(),

    autoImport({
      imports: [
        'react',
        {
          '@tanstack/react-router': ['Link', 'useRouter'],
        },
      ],
      dts: 'src/types/auto-imports.d.ts',
      dirs: ['src/hooks'],
      biomelintrc: { enabled: true },
      include: [/\.[jt]sx?$/, /tsr-split/],
    }),
  ],

  build: {
    target: 'es2020',
    sourcemap: true,
    rollupOptions: {
      external: ['bun'],
    },
  },
});
