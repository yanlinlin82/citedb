// 性能监控工具
export class PerformanceMonitor {
  constructor() {
    this.metrics = {}
  }

  // 开始计时
  start(label) {
    this.metrics[label] = {
      startTime: performance.now(),
      endTime: null,
      duration: null
    }
  }

  // 结束计时
  end(label) {
    if (this.metrics[label]) {
      this.metrics[label].endTime = performance.now()
      this.metrics[label].duration = this.metrics[label].endTime - this.metrics[label].startTime
      console.log(`⏱️ ${label}: ${this.metrics[label].duration.toFixed(2)}ms`)
    }
  }

  // 获取性能指标
  getMetrics() {
    return this.metrics
  }

  // 清除指标
  clear() {
    this.metrics = {}
  }
}

// 全局性能监控实例
export const performanceMonitor = new PerformanceMonitor()

// 性能装饰器
export function measure(label) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value

    descriptor.value = function(...args) {
      performanceMonitor.start(label)
      const result = originalMethod.apply(this, args)
      performanceMonitor.end(label)
      return result
    }

    return descriptor
  }
}