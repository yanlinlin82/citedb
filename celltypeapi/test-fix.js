const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const SQLite3Adapter = require('./lib/sqlite3-adapter.js')

const app = new Koa()
app.use(bodyParser())

// 数据库实例
const db = new SQLite3Adapter()

// 测试SQL查询
async function testQueries() {
    try {
        console.log('开始测试SQL查询...')
        
        // 测试基本查询
        const result1 = await db.Db('source').limit(1).select()
        console.log('✅ 基本查询成功:', result1.length)
        
        // 测试条件查询
        const result2 = await db.Db('source')
            .where('organism', '=', 'human')
            .limit(1)
            .select()
        console.log('✅ 条件查询成功:', result2.length)
        
        // 测试计数查询
        const countResult = await db.Db('source').count('*')
        console.log('✅ 计数查询成功:', countResult[0]?.count)
        
        // 测试复杂条件查询
        const result3 = await db.Db('source')
            .where('organism', '=', 'human')
            .where('method', 'LIKE', '%computational%')
            .limit(1)
            .select()
        console.log('✅ 复杂条件查询成功:', result3.length)
        
        console.log('🎉 所有测试通过!')
        
    } catch (error) {
        console.error('❌ 测试失败:', error)
    }
}

// 启动测试
testQueries().then(() => {
    console.log('测试完成')
    process.exit(0)
}).catch(error => {
    console.error('测试出错:', error)
    process.exit(1)
})