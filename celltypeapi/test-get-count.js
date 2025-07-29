// 测试get_count API修复
const axios = require('axios')

async function testGetCount() {
  console.log('=== 测试get_count API修复 ===')
  
  const testCases = [
    { name: 'monocyte', check: false },
    { name: 'dendritic cell', check: false },
    { name: 'T cell', check: false },
    { name: 'lymphocyte', check: true },
    { name: 'antigen-presenting cell', check: true }
  ]
  
  for (const testCase of testCases) {
    try {
      console.log(`\n测试: ${JSON.stringify(testCase)}`)
      
      const response = await axios.post('http://localhost:7999/api/v1/get_count', testCase)
      
      console.log('✅ 成功:', response.data)
      
      if (response.data.msg === 'ok') {
        console.log(`   数量: ${response.data.data}`)
      } else {
        console.log(`   错误: ${response.data.msg}`)
      }
      
    } catch (error) {
      console.log('❌ 失败:', error.message)
      if (error.response) {
        console.log('   响应:', error.response.data)
      }
    }
  }
  
  console.log('\n=== 测试完成 ===')
}

// 运行测试
testGetCount().catch(console.error)