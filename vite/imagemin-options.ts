import imagemin from 'unplugin-imagemin/vite';

export const imageminOptions: Parameters<typeof imagemin>[0] = {
  conversion: [
    {
      from: 'png',
      to: 'webp',
    },
    {
      from: 'jpg',
      to: 'webp',
    },
    {
      from: 'jpeg',
      to: 'webp',
    },
  ],
};
