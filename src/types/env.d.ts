declare module 'bun' {
  interface Env {
    DATABASE_URL: string
    AUTH_SECRET: string
    OTEL_EXPORTER_OTLP_ENDPOINT?: string
  }
}

export {}
