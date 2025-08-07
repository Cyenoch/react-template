// Web Vitals tracking
export interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
  navigationType: string;
}

export function trackWebVitals(onMetric: (metric: WebVitalsMetric) => void) {
  if (typeof window === 'undefined') return;

  // Track Core Web Vitals
  Promise.all([
    import('web-vitals').then(({ onCLS }) => onCLS(onMetric)),
    import('web-vitals').then(({ onINP }) => onINP(onMetric)),
    import('web-vitals').then(({ onFCP }) => onFCP(onMetric)),
    import('web-vitals').then(({ onLCP }) => onLCP(onMetric)),
    import('web-vitals').then(({ onTTFB }) => onTTFB(onMetric)),
  ]).catch((error) => {
    console.warn('Failed to load web-vitals:', error);
  });
}

// Custom performance tracking
export class PerformanceTracker {
  private static instance: PerformanceTracker;
  private marks: Map<string, number> = new Map();
  private measures: Map<string, number> = new Map();

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  // Mark the start of an operation
  mark(name: string): void {
    if (typeof performance === 'undefined') return;

    const timestamp = performance.now();
    this.marks.set(name, timestamp);
    performance.mark(`${name}_start`);
  }

  // Measure the duration of an operation
  measure(name: string): number | null {
    if (typeof performance === 'undefined') return null;

    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`No mark found for "${name}"`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    this.measures.set(name, duration);
    performance.mark(`${name}_end`);
    performance.measure(name, `${name}_start`, `${name}_end`);

    // Clean up marks
    this.marks.delete(name);

    return duration;
  }

  // Get all measures
  getMeasures(): Map<string, number> {
    return new Map(this.measures);
  }

  // Clear all measures
  clearMeasures(): void {
    this.measures.clear();
  }

  // Track component render time
  trackComponentRender(componentName: string, renderFn: () => void): void {
    this.mark(`component_${componentName}`);
    renderFn();
    const duration = this.measure(`component_${componentName}`);

    if (duration && duration > 16) {
      // More than one frame (60fps)
      console.warn(
        `Slow component render: ${componentName} took ${duration.toFixed(2)}ms`,
      );
    }
  }

  // Track API call performance
  async trackApiCall<T>(name: string, apiCall: () => Promise<T>): Promise<T> {
    this.mark(`api_${name}`);

    try {
      const result = await apiCall();
      const duration = this.measure(`api_${name}`);

      console.log(`API call "${name}" completed in ${duration?.toFixed(2)}ms`);
      return result;
    } catch (error) {
      this.measure(`api_${name}`); // Still measure even on error
      throw error;
    }
  }
}

// Hook for tracking component performance
export function usePerformanceTracker() {
  const tracker = PerformanceTracker.getInstance();

  return {
    mark: tracker.mark.bind(tracker),
    measure: tracker.measure.bind(tracker),
    trackApiCall: tracker.trackApiCall.bind(tracker),
    getMeasures: tracker.getMeasures.bind(tracker),
  };
}

// Resource timing tracking
export function trackResourceTiming() {
  if (typeof window === 'undefined' || !('performance' in window)) return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'resource') {
        const resourceEntry = entry as PerformanceResourceTiming;

        // Track slow resources
        if (resourceEntry.duration > 1000) {
          // More than 1 second
          console.warn(
            `Slow resource: ${resourceEntry.name} took ${resourceEntry.duration.toFixed(2)}ms`,
          );
        }
      }
    }
  });

  observer.observe({ type: 'resource', buffered: true });
}

// Memory usage tracking
export function trackMemoryUsage() {
  if (
    typeof window === 'undefined' ||
    !('performance' in window) ||
    !('memory' in performance)
  ) {
    return null;
  }

  const memory = (performance as any).memory;
  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
  };
}

// Initialize performance monitoring
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  // Track Web Vitals and send to analytics
  trackWebVitals((metric) => {
    console.log(`${metric.name}: ${metric.value}`);

    // Send to analytics service (implement based on your needs)
    // analytics.track('web_vital', metric);
  });

  // Track resource timing
  trackResourceTiming();

  // Track memory usage periodically in development
  if (import.meta.env.DEV) {
    setInterval(() => {
      const memoryInfo = trackMemoryUsage();
      if (memoryInfo && memoryInfo.usagePercentage > 80) {
        console.warn(
          `High memory usage: ${memoryInfo.usagePercentage.toFixed(1)}%`,
        );
      }
    }, 30000); // Check every 30 seconds
  }
}
