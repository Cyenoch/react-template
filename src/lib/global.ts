import ky from 'ky'

export const Env = {
  apiUrl: import.meta.env.VITE_PUBLIC_API_URL,
  privyAppId: import.meta.env.VITE_PUBLIC_PRIVY_APP_ID,
}

export const Global = {
  api: ky.extend({
    prefixUrl: Env.apiUrl,
  }),
}
