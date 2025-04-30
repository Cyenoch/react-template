import type { Span, Tracer } from '@opentelemetry/api'
import process from 'node:process'
import { SpanStatusCode, trace } from '@opentelemetry/api'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { createMiddleware, serverOnly } from '@tanstack/react-start'
import { getWebRequest, isError } from '@tanstack/react-start/server'
import { getContext, setContext } from '../context'
import {
  ATTR_APP_PREFIX,
  ATTR_EXCEPTION_MESSAGE,
  ATTR_EXCEPTION_TYPE,
  ATTR_HTTP_REQUEST_METHOD,
  ATTR_URL_FULL,
} from '../telemetry/semantic-conventions'
import { getLogger } from './logger'

const traceExporter = Bun.env.OTEL_EXPORTER_OTLP_ENDPOINT
  ? new OTLPTraceExporter({
    url: Bun.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  })
  : undefined

const getSDK = serverOnly(() => {
  return new NodeSDK({
    serviceName: '[ReactTemplate]',
    // traceExporter: new ConsoleSpanExporter(),
    traceExporter,
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
let tracer: Tracer

function init() {
  if (started)
    return
  const logger = getLogger()
  const sdk = getSDK()
  if (Bun.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
    logger.info({ OTEL_EXPORTER_OTLP_ENDPOINT: Bun.env.OTEL_EXPORTER_OTLP_ENDPOINT }, 'OTLP exporter enabled.')
  }
  else {
    logger.info('OTLP exporter disabled.')
  }
  sdk.start()
  tracer = trace.getTracer('[ReactTemplate]')
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

export const openTelemetryMiddleware = createMiddleware()
  .server(async ({ next, functionId }) => {
    // const logger = getLogger()
    init()

    const request = getWebRequest()
    const url = new URL(request!.url)

    const result = await tracer.startActiveSpan(`[${request?.method}] ${url.pathname}`, async (span) => {
      setContext('tracer-span', span)
      span.setAttributes({
        [`${ATTR_APP_PREFIX}function.id`]: functionId,
        [`${ATTR_APP_PREFIX}request.id`]: getContext('requestId'),
        [ATTR_HTTP_REQUEST_METHOD]: request?.method,
        [ATTR_URL_FULL]: request?.url,
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
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: `${error}`,
        })
        if (isError(error) || error instanceof Error) {
          span.recordException(error)
          span.setAttributes({
            [ATTR_EXCEPTION_TYPE]: error.constructor.name,
            [ATTR_EXCEPTION_MESSAGE]: error.message,
          })
        }
        else {
          const errorMessage = `Unknown error: ${error}`
          span.recordException(errorMessage)
          span.setAttributes({
            [ATTR_EXCEPTION_TYPE]: 'UnknownError',
            [ATTR_EXCEPTION_MESSAGE]: errorMessage,
          })
        }
        throw error
      }
      finally {
        span.end()
        traceExporter?.forceFlush()
      }
    })

    return result
  })

export const getTracerSpan = serverOnly(() => {
  const span = getContext('tracer-span')
  if (!span)
    throw new Error('Tracer span not initialized. (Please use this function within the request context)')
  return span
})

export const getTracer = serverOnly(() => {
  return tracer
})

declare module '../context' {
  interface ContextMap {
    'tracer': ReturnType<typeof trace.getTracer>
    'tracer-span': Span
  }
}
