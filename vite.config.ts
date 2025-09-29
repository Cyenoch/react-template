import icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import autoImport from 'unplugin-auto-import/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  environments: {
    client: {
      build: {
        target: 'es2020',
        chunkSizeWarningLimit: 1024 * 1024,
        rolldownOptions: {
          output: {
            advancedChunks: {
              groups: [
                {
                  test: /node_modules[\\/]react/,
                  name: 'react',
                  priority: 20,
                },
                {
                  test: /node_modules[\\/]react-dom/,
                  name: 'react-dom',
                  priority: 20,
                },
                {
                  test: /node_modules[\\/]@heroui[\\/]/,
                  name(module) {
                    const libName = module?.split('@heroui/')[1]?.split('/')[0];
                    if (!libName) return 'heroui-components';
                    return `heroui-${libName}`;
                  },
                  priority: 15,
                },
                {
                  test: /node_modules[\\/]@heroui[\\/]react/,
                  name: 'heroui-core',
                  priority: 14,
                },
                {
                  test: /node_modules[\\/]@tanstack[\\/]react-query/,
                  name: 'query',
                  priority: 15,
                },
                {
                  test: /node_modules[\\/]@tanstack[\\/]react-router/,
                  name: 'router',
                  priority: 15,
                },
                {
                  test: /node_modules[\\/]framer-motion/,
                  name: 'animation',
                  priority: 10,
                },
                {
                  test: /node_modules[\\/](zod|superjson)/,
                  name: 'validation',
                  priority: 10,
                },
                {
                  test: /node_modules[\\/](date-fns|uuid)/,
                  name: 'utils',
                  priority: 5,
                },
              ],
            },
          },
        },
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
      router: { entry: 'router.ts' },
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

    tailwindcss(),
  ],

  build: {
    sourcemap: true,
  },
});
