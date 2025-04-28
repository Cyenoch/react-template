import type { Span } from '@opentelemetry/api'
import process from 'node:process'
import { SpanStatusCode, trace } from '@opentelemetry/api'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
// import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { createMiddleware, serverOnly } from '@tanstack/react-start'
import { getWebRequest, isError } from '@tanstack/react-start/server'
import { getContext, setContext } from '../context'
import { getLogger } from './logger'

const getSDK = serverOnly(() => {
  return new NodeSDK({
    serviceName: '[ReactTemplate]',
    // traceExporter: new ConsoleSpanExporter(),
    // traceExporter: new OTLPTraceExporter({
    //   url: 'http://localhost:4318/v1/traces',
    // }),
    // metricReader: new PeriodicExportingMetricReader({
    // exporter: new ConsoleMetricExporter(),
    // }),
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
    const logger = getLogger()
    if (!started) {
      const sdk = getSDK()
      sdk.start()
      process.on('SIGTERM', () => {
        logger.info('Shutting down OpenTelemetry SDK... (SIGTERM)')
        sdk.shutdown()
      })
      process.on('SIGINT', () => {
        logger.info('Shutting down OpenTelemetry SDK... (SIGINT)')
        sdk.shutdown()
      })
      started = true
    }

    const tracer = trace.getTracer('Server')
    const request = getWebRequest()
    const url = new URL(request!.url)

    setContext('tracer', tracer)

    return await tracer.startActiveSpan(`[${request?.method}] ${url.pathname}`, async (span) => {
      setContext('tracer-span', span)
      span.setAttributes({
        'function.id': functionId,
        'request.id': getContext('requestId'),
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
        if (isError(error)) {
          span.recordException(error)
        }
        else if (error instanceof Error) {
          span.recordException(error)
        }
        else if (typeof error === 'string') {
          span.recordException(new Error(error))
        }
        else {
          span.recordException(`Unknown error: ${error}`)
        }

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

export const getTracerSpan = serverOnly(() => {
  const span = getContext('tracer-span')
  if (!span)
    throw new Error('Tracer span not initialized. (Please use this function within the request context)')
  return span
})

declare module '../context' {
  interface ContextMap {
    'tracer': ReturnType<typeof trace.getTracer>
    'tracer-span': Span
  }
}
