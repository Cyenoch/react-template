import autoImport from 'unplugin-auto-import/vite';

export const autoImportOptions: Parameters<typeof autoImport>[0] = {
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
};
