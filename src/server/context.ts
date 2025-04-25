import { getEvent } from '@tanstack/react-start/server'

export interface ContextMap {
}

export function setContext(key: keyof ContextMap, value: ContextMap[keyof ContextMap]) {
  const event = getEvent()
  event.context[key] = value
}

export function getContext<K extends keyof ContextMap>(key: K): ContextMap[K] {
  const event = getEvent()
  return event.context[key]
}
