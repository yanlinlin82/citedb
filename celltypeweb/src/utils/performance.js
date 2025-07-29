// 性能监控工具
class PerformanceMonitor {
  constructor() {
    this.timers = new Map()
    this.metrics = new Map()
  }

  start(label) {
    this.timers.set(label, performance.now())
  }

  end(label) {
    const startTime = this.timers.get(label)
    if (startTime) {
      const duration = performance.now() - startTime
      this.metrics.set(label, duration)
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`)
      this.timers.delete(label)
    }
  }

  getMetrics() {
    return Object.fromEntries(this.metrics)
  }

  clear() {
    this.timers.clear()
    this.metrics.clear()
  }
}

// 异步处理工具
class AsyncProcessor {
  // 分片处理大数据
  static async processInChunks(items, chunkSize, processor) {
    const chunks = []
    for (let i = 0; i < items.length; i += chunkSize) {
      chunks.push(items.slice(i, i + chunkSize))
    }

    const results = []
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      const chunkResult = await processor(chunk, i)
      results.push(...chunkResult)

      // 让出控制权，避免阻塞UI
      if (i % 5 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0))
      }
    }

    return results
  }

  // 防抖函数
  static debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // 节流函数
  static throttle(func, limit) {
    let inThrottle
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  // 异步渲染优化
  static async renderOptimized(renderFunction) {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        const result = renderFunction()
        resolve(result)
      })
    })
  }

  // 批量DOM更新
  static batchDOMUpdates(updates) {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        updates.forEach(update => update())
        resolve()
      })
    })
  }
}

// 内存管理工具
class MemoryManager {
  static cleanup() {
    // 清理定时器
    const highestTimeoutId = setTimeout(";");
    for (let i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }

    // 清理间隔器
    const highestIntervalId = setInterval(";");
    for (let i = 0; i < highestIntervalId; i++) {
      clearInterval(i);
    }

    // 强制垃圾回收（如果支持）
    if (window.gc) {
      window.gc()
    }
  }

  static monitorMemoryUsage() {
    if (performance.memory) {
      const memory = performance.memory
      console.log(`🧠 内存使用: ${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB / ${(memory.totalJSHeapSize / 1048576).toFixed(2)}MB`)
    }
  }
}

export const performanceMonitor = new PerformanceMonitor()
export const asyncProcessor = AsyncProcessor
export const memoryManager = MemoryManager