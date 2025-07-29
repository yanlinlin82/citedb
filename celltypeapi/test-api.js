const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const SQLite3Adapter = require('./lib/sqlite3-adapter.js')

const app = new Koa()
app.use(bodyParser())

// 数据库实例
const db = new SQLite3Adapter()

// 测试API
async function testAPI() {
    try {
        console.log('开始API测试...')
        
        // 测试get_data_img接口
        const testData = {
            species: 'human',
            method: '',
            context: 'immune response',
            cell_type: '',
            check1: false,
            check2: false
        }
        
        // 构建查询条件
        let dbQuery = db.Db('source')
        
        if (testData.species && testData.species !== '') {
            dbQuery = dbQuery.where('organism', '=', testData.species)
        }
        
        if (testData.context && testData.context !== '') {
            dbQuery = dbQuery.where('context', 'LIKE', `%${testData.context}%`)
        }
        
        // 查询数据 - 只查询必要字段
        const result = await dbQuery
            .field('source_cell_type_class, source_cell_type, target_cell_type_class, target_cell_type, interaction_type, organism, method, context')
            .select()
        
        console.log('✅ get_data_img查询成功:', result.length)
        
        if (result.length > 0) {
            console.log('✅ 第一条数据:', Object.keys(result[0]))
        }
        
        // 测试get_data_table接口
        const tableResult = await dbQuery.count('*')
        console.log('✅ get_data_table计数成功:', tableResult[0]?.count)
        
        console.log('🎉 API测试通过!')
        
    } catch (error) {
        console.error('❌ API测试失败:', error)
    }
}

// 启动测试
testAPI().then(() => {
    console.log('测试完成')
    process.exit(0)
}).catch(error => {
    console.error('测试出错:', error)
    process.exit(1)
})