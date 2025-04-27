import process from 'node:process'
import { SpanStatusCode, trace } from '@opentelemetry/api'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
// import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { ConsoleMetricExporter, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node'
import { createMiddleware, serverOnly } from '@tanstack/react-start'
import { getWebRequest } from '@tanstack/react-start/server'
import { getContext, setContext } from '../context'

const getSDK = serverOnly(() => {
  return new NodeSDK({
    serviceName: '[ReactTemplate]',
    traceExporter: new ConsoleSpanExporter(),
    // traceExporter: new OTLPTraceExporter({
    //   url: 'http://localhost:4318/v1/traces',
    // }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new ConsoleMetricExporter(),
    }),
    instrumentations: [
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-http': {
          enabled: true,
        },
      }),
    ],
  })
})

let started = false

export const openTelemetryMiddleware = createMiddleware()
  .server(async ({ next, functionId }) => {
    if (!started) {
      const sdk = getSDK()
      sdk.start()
      process.on('beforeExit', () => {
        sdk.shutdown()
      })
      started = true
    }

    const tracer = trace.getTracer('Server')
    const request = getWebRequest()
    const url = new URL(request!.url)

    setContext('tracer', tracer)

    return await tracer.startActiveSpan(`[${request?.method}] ${url.pathname}`, async (span) => {
      span.setAttributes({
        'function.id': functionId,
        'http.method': request?.method,
        'http.url': request?.url,
      })
      try {
        const _ = await next({
          context: {
            tracer,
          },
        })
        span.setStatus({
          code: SpanStatusCode.OK,
        })
        return _
      }
      catch (error) {
      // span.recordException(error)
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: `${error}`,
        })
        throw error
      }
      finally {
        span.end()
      }
    })
  })

export const getTracer = serverOnly(() => {
  const tracer = getContext('tracer')
  if (!tracer)
    throw new Error('Tracer not initialized. (Please use this function within the request context)')
  return tracer
})

declare module '../context' {
  interface ContextMap {
    tracer: ReturnType<typeof trace.getTracer>
  }
}
