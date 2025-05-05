import { serverOnly } from '@tanstack/react-start'
import { getEvent } from '@tanstack/react-start/server'

export interface ContextMap {
}

export const setContext = serverOnly((key: keyof ContextMap, value: ContextMap[keyof ContextMap]) => {
  const event = getEvent()
  event.context[key] = value
})

export const getContext = serverOnly(<K extends keyof ContextMap>(key: K): ContextMap[K] => {
  const event = getEvent()
  return event.context[key]
})
