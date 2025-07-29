const SQLite3Adapter = require('./lib/sqlite3-adapter.js')

// 数据库实例
const db = new SQLite3Adapter()

// 简单测试
async function testSimple() {
    try {
        console.log('开始简单测试...')
        
        // 测试基本查询
        const result = await db.Db('source')
            .limit(1)
            .select()
        
        console.log('✅ 基本查询成功:', result.length)
        
        // 测试条件查询
        const result2 = await db.Db('source')
            .where('organism', '=', 'human')
            .limit(1)
            .select()
        
        console.log('✅ 条件查询成功:', result2.length)
        
        // 测试计数查询
        const countResult = await db.Db('source').count('*')
        console.log('✅ 计数查询成功:', countResult[0]?.count)
        
        console.log('🎉 简单测试通过!')
        
    } catch (error) {
        console.error('❌ 测试失败:', error)
    }
}

// 启动测试
testSimple().then(() => {
    console.log('测试完成')
    process.exit(0)
}).catch(error => {
    console.error('测试出错:', error)
    process.exit(1)
})