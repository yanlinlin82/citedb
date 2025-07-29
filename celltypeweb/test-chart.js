// 测试Chart组件的防抖函数
function debounce(func, wait) {
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

// 模拟Chart组件
class MockChart {
  constructor() {
    this.isInitializing = false
    this.check = false
  }
  
  initData(list) {
    // 使用箭头函数保持this上下文
    const debouncedInitData = debounce((data) => {
      console.log('✅ 防抖函数执行，数据长度:', data.length)
      console.log('✅ this.isInitializing:', this.isInitializing)
      console.log('✅ this.check:', this.check)
      
      if (this.isInitializing) {
        console.log('⚠️ 正在初始化，跳过')
        return
      }
      
      this.isInitializing = true
      console.log('✅ 开始处理数据...')
      
      // 模拟数据处理
      setTimeout(() => {
        this.isInitializing = false
        console.log('✅ 数据处理完成')
      }, 100)
      
    }, 300)
    
    // 调用防抖函数
    debouncedInitData(list)
  }
}

// 测试
const chart = new MockChart()
console.log('开始测试Chart组件...')

// 测试1: 正常调用
chart.initData([{test: 'data'}])

// 测试2: 快速连续调用
setTimeout(() => {
  chart.initData([{test: 'data2'}])
}, 100)

setTimeout(() => {
  chart.initData([{test: 'data3'}])
}, 200)

console.log('测试完成')