import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import autoImport from 'unplugin-auto-import/vite';
import icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { autoImportOptions } from './vite/auto-import-options';
import { environments } from './vite/environments';
import { optimizeDeps } from './vite/optimize-deps';

export default defineConfig({
  plugins: [
    tsConfigPaths({ projects: ['./tsconfig.json'] }),

    icons({ compiler: 'jsx', jsx: 'react' }),

    tanstackStart({ router: { entry: 'router.ts' } }),

    react(),

    autoImport(autoImportOptions),

    tailwindcss(),
  ],

  environments,
  optimizeDeps,
  build: {
    sourcemap: true,
  },
  experimental: {
    enableNativePlugin: true,
  },
});
