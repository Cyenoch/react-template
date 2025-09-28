import icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import autoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  environments: {
    client: {
      build: {
        target: 'es2020',
        chunkSizeWarningLimit: 1024 * 1024,
      },
    },
    ssr: {
      build: {
        target: 'esnext',
        minify: false,
      },
    },
  },

  experimental: {
    enableNativePlugin: true,
  },

  optimizeDeps: {
    exclude: ['bun', '@hookform/resolvers/zod', 'better-auth/react'],
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'lucide-react',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
    ],
  },

  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),

    icons({ compiler: 'jsx', jsx: 'react' }),

    tanstackStart({
      srcDirectory: 'src',
      server: { entry: './server.ts' },
      router: { entry: './start.tsx' },
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
    sourcemap: true,
  },
});
