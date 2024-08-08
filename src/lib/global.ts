import ky from 'ky'

export const Env = {
  apiUrl: import.meta.env.VITE_PUBLIC_API_URL,
}

export const Global = {
  api: ky.extend({
    prefixUrl: Env.apiUrl,
  }),
}
