import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";

export const ThemeSchema = z.enum(["system", "light", "dark"]).catch("system");
export const THEME_COOKIE_NAME = "theme";
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
export const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export type Theme = z.output<typeof ThemeSchema>;
export type ResolvedTheme = Exclude<Theme, "system">;

export const resolveTheme = (themeValue: Theme, systemPrefersDark: boolean): ResolvedTheme => {
  if (themeValue === "system") {
    return systemPrefersDark ? "dark" : "light";
  }

  return themeValue;
};

export const getSystemTheme = () => {
  return window.matchMedia(THEME_MEDIA_QUERY).matches ? "dark" : "light";
};

export const applyTheme = (themeValue: Theme) => {
  const root = document.documentElement;
  const resolvedTheme = resolveTheme(themeValue, getSystemTheme() === "dark");

  root.classList.toggle("dark", resolvedTheme === "dark");
  root.dataset.theme = themeValue;
  root.dataset.resolvedTheme = resolvedTheme;
  root.style.colorScheme = resolvedTheme;

  return resolvedTheme;
};

export const subscribeToSystemTheme = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(THEME_MEDIA_QUERY);
  const handleChange = () => {
    onChange();
  };

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }

  mediaQuery.onchange = handleChange;

  return () => {
    if (mediaQuery.onchange === handleChange) {
      mediaQuery.onchange = null;
    }
  };
};

export const getThemeInitScript = (themeValue: Theme) => {
  return `(() => {
    const theme = ${JSON.stringify(themeValue)};
    const root = document.documentElement;
    const resolved = theme === "system"
      ? (window.matchMedia(${JSON.stringify(THEME_MEDIA_QUERY)}).matches ? "dark" : "light")
      : theme;

    root.classList.toggle("dark", resolved === "dark");
    root.dataset.theme = theme;
    root.dataset.resolvedTheme = resolved;
    root.style.colorScheme = resolved;
  })();`;
};

export const getTheme = createIsomorphicFn()
  .server(() => {
    const themeValue = getCookie(THEME_COOKIE_NAME);
    return ThemeSchema.parse(themeValue);
  })
  .client(() => {
    const value = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${THEME_COOKIE_NAME}=`))
      ?.split("=")[1];
    return ThemeSchema.parse(value);
  });

export const setTheme = createIsomorphicFn()
  .server((themeValue: Theme) => {
    setCookie(THEME_COOKIE_NAME, themeValue, { path: "/", maxAge: THEME_COOKIE_MAX_AGE });
  })
  .client((themeValue: Theme) => {
    document.cookie = `${THEME_COOKIE_NAME}=${themeValue}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
  });
