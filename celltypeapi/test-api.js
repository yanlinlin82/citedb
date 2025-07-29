const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const SQLite3Adapter = require('./lib/sqlite3-adapter.js')

const app = new Koa()
app.use(bodyParser())

// Database instance
const db = new SQLite3Adapter()

// Test API
async function testAPI() {
    try {
        console.log('Starting API test...')
        
        // Test get_data_img interface
        const params = {
            species: 'human',
            method: 'computational',
            context: 'immune response',
            cell_type: 'T cell',
            check1: false,
            check2: false
        }
        
        // Build query conditions
        let dbQuery = db.Db('source')
        if (params.species && params.species !== 'all') {
            dbQuery = dbQuery.where('organism', '=', params.species)
        }
        if (params.method && params.method !== 'all') {
            dbQuery = dbQuery.where('method', '=', params.method)
        }
        if (params.context && params.context !== 'all') {
            dbQuery = dbQuery.where('context', 'LIKE', `%${params.context}%`)
        }
        if (params.cell_type && params.cell_type !== 'all') {
            dbQuery = dbQuery.where('source_cell_type', 'LIKE', `%${params.cell_type}%`)
        }
        
        // Query data - only query necessary fields
        const result = await dbQuery
            .field('source_cell_type_class, source_cell_type, target_cell_type_class, target_cell_type, interaction_type, organism, method, context')
            .select()
        
        console.log('✅ get_data_img query successful:', result.length)
        if (result.length > 0) {
            console.log('✅ First data:', Object.keys(result[0]))
        }
        
        // Test get_data_table interface
        const tableResult = await dbQuery.count('*')
        console.log('✅ get_data_table count successful:', tableResult[0]?.count)
        
        console.log('🎉 API test passed!')
        
    } catch (error) {
        console.error('❌ API test failed:', error)
    }
}

// Start test
testAPI().then(() => {
    console.log('Test completed')
    process.exit(0)
}).catch(error => {
    console.error('Test error:', error)
    process.exit(1)
})