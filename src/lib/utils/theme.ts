import { createIsomorphicFn } from '@tanstack/react-start';
import { getCookie, setCookie } from '@tanstack/react-start/server';

export const getTheme = createIsomorphicFn()
  .server(() => {
    const themeValue = getCookie('theme');
    return themeValue;
  })
  .client(() => {
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith('theme='))
      ?.split('=')[1];
  });

export const setTheme = createIsomorphicFn()
  .server((themeValue: string) => {
    setCookie('theme', themeValue, { path: '/', maxAge: 60 * 60 * 24 * 365 });
  })
  .client((themeValue: string) => {
    cookieStore.set('theme', themeValue);
  });
