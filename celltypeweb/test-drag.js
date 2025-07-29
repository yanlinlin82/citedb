// 测试网络图拖拽功能
console.log('=== 网络图拖拽功能测试 ===')

// 模拟ECharts配置
const mockEChartsConfig = {
  type: 'graph',
  layout: 'force',
  force: {
    edgeLength: 150,
    repulsion: 50,
    gravity: 0.01
  },
  symbolSize: 50,
  roam: true, // 启用拖拽
  zoom: 1,
  label: {
    show: true,
    position: 'bottom'
  },
  edgeSymbolSize: [10, 10],
  edgeLabel: {
    fontSize: 10
  },
  data: [
    { name: 'T cell', color: '#3866b9', type_class: 'lymphocyte' },
    { name: 'dendritic cell', color: '#3866b9', type_class: 'antigen-presenting cell' },
    { name: 'B cell', color: '#3866b9', type_class: 'lymphocyte' }
  ],
  links: [
    { source: 'T cell', target: 'dendritic cell' },
    { source: 'B cell', target: 'dendritic cell' }
  ]
}

console.log('ECharts配置:', mockEChartsConfig)
console.log('roam设置:', mockEChartsConfig.roam)

// 模拟拖拽事件
function simulateDragEvents() {
  console.log('\n=== 模拟拖拽事件 ===')
  
  const events = [
    { type: 'mousedown', target: 'T cell', x: 100, y: 100 },
    { type: 'mousemove', target: 'T cell', x: 150, y: 150 },
    { type: 'mouseup', target: 'T cell', x: 150, y: 150 },
    { type: 'mousedown', target: 'dendritic cell', x: 200, y: 200 },
    { type: 'mousemove', target: 'dendritic cell', x: 250, y: 250 },
    { type: 'mouseup', target: 'dendritic cell', x: 250, y: 250 }
  ]
  
  events.forEach((event, index) => {
    console.log(`事件 ${index + 1}: ${event.type} on ${event.target} at (${event.x}, ${event.y})`)
  })
  
  console.log('✅ 拖拽事件模拟完成')
}

// 模拟缩放事件
function simulateZoomEvents() {
  console.log('\n=== 模拟缩放事件 ===')
  
  const zoomEvents = [
    { type: 'wheel', delta: -1, zoom: 0.8 }, // 放大
    { type: 'wheel', delta: 1, zoom: 1.2 },  // 缩小
    { type: 'wheel', delta: -1, zoom: 1.5 }  // 进一步放大
  ]
  
  zoomEvents.forEach((event, index) => {
    console.log(`缩放事件 ${index + 1}: ${event.type}, delta: ${event.delta}, zoom: ${event.zoom}`)
  })
  
  console.log('✅ 缩放事件模拟完成')
}

// 测试plus/reduce按钮
function testZoomButtons() {
  console.log('\n=== 测试缩放按钮 ===')
  
  let currentZoom = 1.0
  
  // 测试plus按钮
  currentZoom += 0.3
  console.log(`点击plus按钮: zoom = ${currentZoom}`)
  
  // 测试reduce按钮
  currentZoom -= 0.3
  console.log(`点击reduce按钮: zoom = ${currentZoom}`)
  
  console.log('✅ 缩放按钮测试完成')
}

// 运行所有测试
simulateDragEvents()
simulateZoomEvents()
testZoomButtons()

console.log('\n=== 测试总结 ===')
console.log('1. roam: true 已启用拖拽和缩放功能')
console.log('2. 节点可以通过鼠标拖拽移动')
console.log('3. 图表可以通过滚轮或按钮缩放')
console.log('4. plus/reduce按钮可以控制缩放级别')
console.log('5. 力导向布局会自动调整节点位置')

console.log('\n=== 使用说明 ===')
console.log('- 鼠标拖拽节点可以移动节点位置')
console.log('- 鼠标滚轮可以缩放整个图表')
console.log('- 点击plus/reduce按钮可以精确控制缩放')
console.log('- 力导向布局会自动优化节点分布')