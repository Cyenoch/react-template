import type { EnvironmentOptions } from 'vite';
import { advancedChunks } from './advanced-chunks';

export const environments: Record<string, EnvironmentOptions> = {
  client: {
    build: {
      target: 'es2020',
      chunkSizeWarningLimit: 1024 * 1024,
      rolldownOptions: {
        output: {
          advancedChunks,
        },
      },
    },
  },
};
