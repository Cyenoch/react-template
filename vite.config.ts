import icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import autoImport from 'unplugin-auto-import/vite';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import pino from 'pino';
import { serverEnv } from './src/lib/env/server-env';

export const VITE_ENVIRONMENT_NAMES = {
  // 'ssr' is chosen as the name for the server environment to ensure backwards compatibility
  // with vite plugins that are not compatible with the new vite environment API (e.g. tailwindcss)
  server: 'ssr',
  client: 'client',
} as const;

const logger = pino({
  level: 'info',
});

const sentryPluginEnabled =
  serverEnv.SENTRY_ORG &&
  serverEnv.SENTRY_PROJECT &&
  serverEnv.SENTRY_AUTH_TOKEN;

logger.debug(
  sentryPluginEnabled
    ? 'Sentry plugin is enabled'
    : 'Sentry plugin is disabled',
);

logger.debug(serverEnv, 'Server Env:');

invariant(serverEnv.DATABASE_URL, 'DATABASE_URL is required');

if (sentryPluginEnabled) {
  invariant(serverEnv.VITE_APP_VERSION, 'VITE_APP_VERSION is required');
}

export default defineConfig({
  environments: {
    [VITE_ENVIRONMENT_NAMES.client]: {
      build: {
        target: 'es2020',
        chunkSizeWarningLimit: 1024 * 1024,
      },
    },
    [VITE_ENVIRONMENT_NAMES.server]: {
      build: {
        target: 'esnext',
        minify: false,
      },
    },
  },

  optimizeDeps: {
    exclude: ['@hookform/resolvers/zod', 'better-auth/react'],
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

  server: {
    warmup: {
      ssrFiles: ['src/server.ts', 'src/router.tsx'],
      clientFiles: ['src/client.tsx', 'src/router.tsx'],
    },
  },

  plugins: [
    sentryVitePlugin({
      org: Bun.env.SENTRY_ORG,
      project: Bun.env.SENTRY_PROJECT,
      authToken: Bun.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        filesToDeleteAfterUpload: ['[.output|dist]/**/*.d.ts'],
      },
      release: {
        // Make sure to update the release name in the sentry.ts file as well
        name: `${serverEnv.VITE_APP_VERSION ?? 'unpublished'}`,
      },
    }),

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
    sourcemap: true,
    rollupOptions: {
      external: ['bun'],
    },
  },

  ssr: {
    external: ['bun'],
  }
});

function invariant(condition: any, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
