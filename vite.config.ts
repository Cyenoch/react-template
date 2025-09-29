import icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import autoImport from 'unplugin-auto-import/vite';
import imagemin from 'unplugin-imagemin/vite';

import { optimizeDeps } from './vite/optimize-deps';
import { environments } from './vite/environments';
import { imageminOptions } from './vite/imagemin-options';
import { autoImportOptions } from './vite/auto-import-options';

export default defineConfig({
  plugins: [
    tsConfigPaths({ projects: ['./tsconfig.json'] }),

    icons({ compiler: 'jsx', jsx: 'react' }),

    tanstackStart({ router: { entry: 'router.ts' } }),

    react(),

    autoImport(autoImportOptions),

    tailwindcss(),

    // imagemin(imageminOptions),
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
