// 测试节点信息的数据流
console.log('=== 节点信息测试 ===')

// 模拟Chart组件的数据处理
function simulateChartDataProcessing() {
  const mockData = [
    {
      source_cell_type: 'T cell',
      target_cell_type: 'dendritic cell',
      source_cell_type_class: 'lymphocyte',
      target_cell_type_class: 'antigen-presenting cell',
      interaction: 'activation',
      clear_direction: 0,
      reciprocal_direction: 0
    },
    {
      source_cell_type: 'B cell',
      target_cell_type: 'macrophage',
      source_cell_type_class: 'lymphocyte',
      target_cell_type_class: 'phagocyte',
      interaction: 'signaling',
      clear_direction: 0,
      reciprocal_direction: 0
    }
  ]
  
  console.log('原始数据:', mockData)
  
  // 模拟this.check = false的情况
  const check = false
  const arr = []
  const class_array = {}
  const colorArr = []
  
  mockData.forEach(item => {
    if (check) {
      // class level
      arr.push(item.source_cell_type_class)
      arr.push(item.target_cell_type_class)
      class_array[item.source_cell_type_class] = item.source_cell_type_class
      class_array[item.target_cell_type_class] = item.target_cell_type_class
    } else {
      // cell type level
      arr.push(item.source_cell_type)
      arr.push(item.target_cell_type)
      class_array[item.source_cell_type] = item.source_cell_type_class
      class_array[item.target_cell_type] = item.target_cell_type_class
    }
  })
  
  console.log('处理后的arr:', arr)
  console.log('class_array映射:', class_array)
  
  const newArr = [...new Set(arr)]
  const chartData = []
  
  newArr.forEach(item => {
    chartData.push({
      name: item,
      color: colorArr.includes(item) ? '#ff001c' : '#3866b9',
      type_class: class_array[item] || item
    })
  })
  
  console.log('最终的chartData:', chartData)
  
  return chartData
}

// 模拟API调用
function simulateGetCount(name, check) {
  console.log(`模拟API调用: name=${name}, check=${check}`)
  
  // 模拟数据库查询条件
  const whereCondition = check ? 'source_cell_type_class = ?' : 'source_cell_type = ?'
  console.log(`查询条件: ${whereCondition} = ${name}`)
  
  // 模拟返回结果
  const mockCount = Math.floor(Math.random() * 10) + 1
  console.log(`模拟返回数量: ${mockCount}`)
  
  return {
    code: 200,
    msg: 'ok',
    data: mockCount
  }
}

// 运行测试
const chartData = simulateChartDataProcessing()

console.log('\n=== 测试节点点击 ===')
chartData.forEach(node => {
  console.log(`\n点击节点: ${node.name}`)
  console.log(`type_class: ${node.type_class}`)
  
  // 模拟API调用
  const result = simulateGetCount(node.type_class, false)
  console.log(`API返回:`, result)
  
  // 模拟tooltip内容
  const tooltipContent = `节点: ${node.name}<br/>类型: ${node.type_class}<br/>数量: ${result.data}`
  console.log(`Tooltip内容: ${tooltipContent}`)
})

console.log('\n=== 测试完成 ===')