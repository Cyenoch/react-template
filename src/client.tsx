/* eslint-disable perfectionist/sort-imports */
// Core-js polyfills for better browser compatibility
import 'core-js/stable'

import { StartClient } from '@tanstack/react-start'
import { hydrateRoot } from 'react-dom/client'
import { createRouter } from './router'

import type { StartSsrGlobal } from '@tanstack/react-start'

declare global {
  interface Window {
    __TSR_SSR__?: StartSsrGlobal
  }
}

// In the Bun environment, random "Invariant Failed" errors may occur. This should be fixed by:
;(async () => {
  let times = 0
  while (true) {
    if (window.__TSR_SSR__ && 'dehydrated' in window.__TSR_SSR__) {
      const router = createRouter()
      hydrateRoot(document!, <StartClient router={router} />)
      break
    }
    else {
      times++
      console.warn('(window as any)?.__TSR_SSR__?.dehydrated is undefined', times)
      if (times > 1000) {
        window.location.href = '/'
      }
    }
    await new Promise(resolve => setTimeout(resolve, 50))
  }
})()
