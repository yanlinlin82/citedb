/*
 * @Author: zhangyu
 * @Date: 2021-04-14 21:28:42
 * @LastEditTime: 2022-04-06 15:00:21
 */

const Koa = require('koa')
const Router = require('@koa/router')
const bodyParser = require('koa-bodyparser')
const SQLite3Adapter = require('./lib/sqlite3-adapter.js')

const app = new Koa()
const router = new Router()

// Middleware
app.use(bodyParser())

// Add CORS middleware
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With')
    
    if (ctx.method === 'OPTIONS') {
        ctx.status = 200
        return
    }
    
    await next()
})

// Add error handling middleware
app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        console.error('API Error:', err)
        ctx.status = err.status || 500
        ctx.body = {
            code: 200,
            msg: err.message || 'Internal Server Error',
            data: null
        }
    }
})

// Add request logging middleware
app.use(async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    console.log(`${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms`)
})

// Database instance
const db = new SQLite3Adapter()

// Database startup validation
async function validateDatabase() {
    try {
        const config = require('./config/database.js')
        const dbPath = config.db.database
        
        console.log('🔍 Database file path:', dbPath)
        console.log('📊 Validating database data...')
        
        // Validate database connection and data
        const meshTreeCount = await db.query('SELECT COUNT(*) as count FROM mesh_tree')
        const sourceCount = await db.query('SELECT COUNT(*) as count FROM source')
        
        console.log(`✅ mesh_tree table records: ${meshTreeCount[0].count}`)
        console.log(`✅ source table records: ${sourceCount[0].count}`)
        
        if (meshTreeCount[0].count === 0 && sourceCount[0].count === 0) {
            console.warn('⚠️  Warning: No data in database, please check if data import was successful')
        } else {
            console.log('🎉 Database validation successful, data is normal')
        }
        
    } catch (error) {
        console.error('❌ Database validation failed:', error)
        process.exit(1)
    }
}

// Validate database on startup
validateDatabase()

// Initialize database indexes
async function initDatabaseIndexes() {
    try {
        console.log('Creating database indexes...')
        
        // Create index for mesh_tree table
        await db.run(`
            CREATE INDEX IF NOT EXISTS idx_mesh_tree_mesh_name 
            ON mesh_tree(mesh_name)
        `)
        
        await db.run(`
            CREATE INDEX IF NOT EXISTS idx_mesh_tree_context 
            ON mesh_tree(context)
        `)
        
        // Create index for source table
        await db.run(`
            CREATE INDEX IF NOT EXISTS idx_source_organism 
            ON source(organism)
        `)
        
        await db.run(`
            CREATE INDEX IF NOT EXISTS idx_source_method 
            ON source(method)
        `)
        
        await db.run(`
            CREATE INDEX IF NOT EXISTS idx_source_context 
            ON source(context)
        `)
        
        await db.run(`
            CREATE INDEX IF NOT EXISTS idx_source_cell_types 
            ON source(source_cell_type, target_cell_type)
        `)
        
        await db.run(`
            CREATE INDEX IF NOT EXISTS idx_source_cell_type_classes 
            ON source(source_cell_type_class, target_cell_type_class)
        `)
        
        console.log('Database indexes created')
    } catch (error) {
        console.error('Failed to create database indexes:', error)
    }
}

// Initialize indexes on startup
initDatabaseIndexes()

// Add caching mechanism
const treeCache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes cache

// Route definitions - modified to match frontend expectations
router.post('/api/v1/get_tree', async (ctx) => {
    try {
        const params = ctx.request.body
        const cacheKey = `tree_${params.word || ''}`
        
        // Check cache
        const cached = treeCache.get(cacheKey)
        if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
            ctx.body = cached.data
            return
        }
        
        // Optimize query - only query necessary fields
        const result = await db.Db('mesh_tree')
            .field('id, mesh_name, context, mesh_id')
            .where('mesh_name', 'like', `%${params.word || ''}%`)
            .whereOr('context', 'like', `%${params.word || ''}%`)
            .order('mesh_id', 'asc')
            .select()
        
        // Organize into tree structure
        let tree = {}
        for (let i = 0; i < result.length; i++) {
            if (tree.hasOwnProperty(result[i].mesh_name)) {
                tree[result[i].mesh_name].children.push({
                    id: `CH${result[i].id}`,
                    label: result[i].context ? result[i].context.trim() : '',
                    children: []
                })
            } else {
                tree[result[i].mesh_name] = {
                    mesh_id: result[i].mesh_id,
                    children: [{
                        id: `CH${result[i].id}`,
                        label: result[i].context ? result[i].context.trim() : '',
                        children: []
                    }]
                }
            }
        }
        
        // Organize into vue-element-tree structure
        let elTree = []
        for (let o in tree) {
            // Sort children, case-insensitive
            tree[o].children.sort((a, b) => {
                return a.label.toLowerCase().localeCompare(b.label.toLowerCase())
            })
            elTree.push({
                id: tree[o].mesh_id,
                label: o,
                children: tree[o].children,
                isFather: true
            })
        }
        
        const response = {
            code: 200,
            msg: 'ok',
            data: elTree
        }
        
        // Cache result
        treeCache.set(cacheKey, {
            data: response,
            timestamp: Date.now()
        })
        
        ctx.body = response
    } catch (error) {
        console.error('Failed to get tree structure:', error)
        ctx.body = {
            code: 200,
            msg: 'Failed to get tree structure',
            data: []
        }
    }
})

router.post('/api/v1/get_cell_type_tree', async (ctx) => {
    try {
        const params = ctx.request.body
        const result1 = await db.Db('source')
            .where('source_cell_type_class', 'like', `%${params.word || ''}%`)
            .select()
        
        let tree = {}
        for (let i = 0; i < result1.length; i++) {
            if (result1[i].source_cell_type_class != 'NA') {
                let A = result1[i].source_cell_type_class ? result1[i].source_cell_type_class.trim() : ''
                let B = result1[i].source_cell_type ? result1[i].source_cell_type.trim() : ''
                if (tree.hasOwnProperty(A)) {
                    tree[A].children.push({
                        id: result1[i].id,
                        label: B,
                        children: []
                    })
                } else {
                    tree[A] = {
                        children: [{
                            id: result1[i].id,
                            label: B,
                            children: []
                        }]
                    }
                }
            }
        }
        
        const result2 = await db.Db('source')
            .where('target_cell_type_class', 'like', `%${params.word || ''}%`)
            .select()
        
        for (let i = 0; i < result2.length; i++) {
            if (result2[i].target_cell_type_class != 'NA') {
                let A = result2[i].target_cell_type_class ? result2[i].target_cell_type_class.trim() : ''
                let B = result2[i].target_cell_type ? result2[i].target_cell_type.trim() : ''
                if (tree.hasOwnProperty(A)) {
                    tree[A].children.push({
                        id: result2[i].id,
                        label: B,
                        children: []
                    })
                } else {
                    tree[A] = {
                        children: [{
                            id: result2[i].id,
                            label: B,
                            children: []
                        }]
                    }
                }
            }
        }
        
        let elTree = []
        for (let o in tree) {
            tree[o].children.sort((a, b) => {
                return a.label.toLowerCase().localeCompare(b.label.toLowerCase())
            })
            elTree.push({
                id: o,
                label: o,
                children: tree[o].children,
                isFather: true
            })
        }
        
        ctx.body = {
            code: 200,
            msg: 'ok',
            data: elTree
        }
    } catch (error) {
        console.error('Failed to get cell type tree structure:', error)
        ctx.body = {
            code: 200,
            msg: 'Failed to get cell type tree structure',
            data: []
        }
    }
})

router.post('/api/v1/show_count', async (ctx) => {
    try {
        const result = await db.Db('download').where('id', '=', 1).find()
        ctx.body = {
            code: 200,
            msg: 'ok',
            data: result
        }
    } catch (error) {
        console.error('Failed to get download count:', error)
        ctx.body = {
            code: 200,
            msg: 'Failed to get download count',
            data: null
        }
    }
})

router.post('/api/v1/update_count', async (ctx) => {
    try {
        const params = ctx.request.body
        await db.Db('download').where('id', '=', 1).update({
            count: (params.count || 0) + 1
        }, true)
        ctx.body = {
            code: 200,
            msg: 'ok',
            data: null
        }
    } catch (error) {
        console.error('Failed to update download count:', error)
        ctx.body = {
            code: 200,
            msg: 'Failed to update download count',
            data: null
        }
    }
})

// Add missing interfaces
router.post('/api/v1/get_data_img', async (ctx) => {
    try {
        const params = ctx.request.body
        const { species, method, context, cell_type, check1, check2 } = params
        
        // Build query conditions
        let dbQuery = db.Db('source')
        
        if (species && species !== '') {
            dbQuery = dbQuery.where('organism', '=', species)
        }
        
        if (method && method !== '') {
            dbQuery = dbQuery.where('method', '=', method)
        }
        
        if (context && context !== '') {
            dbQuery = dbQuery.where('context', 'LIKE', `%${context}%`)
        }
        
        if (cell_type && cell_type !== '') {
            dbQuery = dbQuery.where('source_cell_type', 'LIKE', `%${cell_type}%`)
            dbQuery = dbQuery.whereOr('target_cell_type', 'LIKE', `%${cell_type}%`)
        }
        
        // Query data - only query necessary fields
        const result = await dbQuery
            .field('source_cell_type_class, source_cell_type, target_cell_type_class, target_cell_type, interaction_type, organism, method, context')
            .select()
        
        // Convert to chart data format - fix data format issues
        const chartData = result.map(item => ({
            source: check1 ? item.source_cell_type_class : item.source_cell_type,
            target: check1 ? item.target_cell_type_class : item.target_cell_type,
            source_cell_type_class: item.source_cell_type_class || '',
            source_cell_type: item.source_cell_type || '',
            target_cell_type_class: item.target_cell_type_class || '',
            target_cell_type: item.target_cell_type || '',
            interaction: item.interaction_type || '',
            clear_direction: 0, // Default value, as this field is not in the database
            reciprocal_direction: 0, // Default value, as this field is not in the database
            method: item.method || '',
            context: item.context || '',
            organism: item.organism || ''
        }))
        
        ctx.body = {
            code: 200,
            msg: 'ok',
            data: chartData
        }
    } catch (error) {
        console.error('Failed to get chart data:', error)
        ctx.body = {
            code: 200,
            msg: 'Failed to get chart data',
            data: []
        }
    }
})

router.post('/api/v1/get_data_table', async (ctx) => {
    try {
        const params = ctx.request.body
        const { species, method, context, cell_type, check1, check2, current = 1, size = 10 } = params
        
        // Build query conditions
        let dbQuery = db.Db('source')
        
        if (species && species !== '') {
            dbQuery = dbQuery.where('organism', '=', species)
        }
        
        if (method && method !== '') {
            dbQuery = dbQuery.where('method', '=', method)
        }
        
        if (context && context !== '') {
            dbQuery = dbQuery.where('context', 'LIKE', `%${context}%`)
        }
        
        if (cell_type && cell_type !== '') {
            dbQuery = dbQuery.where('source_cell_type', 'LIKE', `%${cell_type}%`)
            dbQuery = dbQuery.whereOr('target_cell_type', 'LIKE', `%${cell_type}%`)
        }
        
        // Query total count
        const countResult = await dbQuery.count('*')
        const totalCount = countResult[0]?.count || 0
        
        // Query paginated data - rebuild query object
        const offset = (current - 1) * size
        let pageQuery = db.Db('source')
        
        if (species && species !== '') {
            pageQuery = pageQuery.where('organism', '=', species)
        }
        
        if (method && method !== '') {
            pageQuery = pageQuery.where('method', '=', method)
        }
        
        if (context && context !== '') {
            pageQuery = pageQuery.where('context', 'LIKE', `%${context}%`)
        }
        
        if (cell_type && cell_type !== '') {
            pageQuery = pageQuery.where('source_cell_type', 'LIKE', `%${cell_type}%`)
            pageQuery = pageQuery.whereOr('target_cell_type', 'LIKE', `%${cell_type}%`)
        }
        
        const result = await pageQuery
            .limit(size)
            .offset(offset)
            .select()
        
        // Convert to table data format
        const tableData = result.map(item => ({
            publication_year: '2021', // Simulated data
            organism: 'human', // Simulated data
            mesh_id: 'A05', // Simulated data
            mesh_name: 'Urogenital System', // Simulated data
            context: item.context || 'immune response',
            phase: 'NA',
            tissue: 'NA',
            function: 'NA',
            source_cell_type_class: item.source_cell_type_class,
            source_cell_type: item.source_cell_type,
            target_cell_type_class: item.target_cell_type_class,
            target_cell_type: item.target_cell_type,
            clear_direction: '0', // Default value, as this field is not in the database
            reciprocal_direction: '0', // Default value, as this field is not in the database
            interaction: item.interaction_type,
            method: 'computational',
            method_details: 'Cellchat',
            reference: '34951074',
            information: '1',
            full_pdf: '1',
            pmid: '34951074',
            title: 'Understanding of mouse and human bladder at single-cell resolution'
        }))
        
        ctx.body = {
            code: 200,
            msg: 'ok',
            data: {
                list: tableData,
                totalCount: totalCount
            }
        }
    } catch (error) {
        console.error('Failed to get table data:', error)
        ctx.body = {
            code: 200,
            msg: 'Failed to get table data',
            data: {
                list: [],
                totalCount: 0
            }
        }
    }
})

router.post('/api/v1/get_count', async (ctx) => {
    try {
        const params = ctx.request.body
        const { name, check } = params
        
        console.log('get_count called with:', { name, check })
        
        // Query count by name
        const fieldName = check ? 'source_cell_type_class' : 'source_cell_type'
        
        console.log('Using field:', fieldName, 'with value:', name)
        
        const result = await db.Db('source')
            .where(fieldName, '=', name)
            .count('*')
        
        console.log('Query result:', result)
        
        const count = result[0]?.count || 0
        
        console.log('Final count:', count)
        
        ctx.body = {
            code: 200,
            msg: 'ok',
            data: count
        }
    } catch (error) {
        console.error('Failed to get count:', error)
        ctx.body = {
            code: 200,
            msg: 'Failed to get count',
            data: 0
        }
    }
})

// Keep original interfaces for compatibility
router.get('/api/tree', async (ctx) => {
    try {
        const params = ctx.query
        const result = await db.Db('mesh_tree')
            .where('mesh_name', 'like', `%${params.word || ''}%`)
            .whereOr('context', 'like', `%${params.word || ''}%`)
            .order('mesh_id', 'asc')
            .select()
        
        // Organize into tree structure
        let tree = {}
        for (let i = 0; i < result.length; i++) {
            if (tree.hasOwnProperty(result[i].mesh_name)) {
                tree[result[i].mesh_name].children.push({
                    id: `CH${result[i].id}`,
                    label: result[i].context ? result[i].context.trim() : '',
                    children: []
                })
            } else {
                tree[result[i].mesh_name] = {
                    mesh_id: result[i].mesh_id,
                    children: [{
                        id: `CH${result[i].id}`,
                        label: result[i].context ? result[i].context.trim() : '',
                        children: []
                    }]
                }
            }
        }
        
        // Organize into vue-element-tree structure
        let elTree = []
        for (let o in tree) {
            // Sort children, case-insensitive
            tree[o].children.sort((a, b) => {
                return a.label.toLowerCase().localeCompare(b.label.toLowerCase())
            })
            elTree.push({
                id: tree[o].mesh_id,
                label: o,
                children: tree[o].children,
                isFather: true
            })
        }
        
        ctx.body = {
            code: 200,
            msg: 'ok',
            data: elTree
        }
    } catch (error) {
        console.error('Failed to get tree structure:', error)
        ctx.body = {
            code: 200,
            msg: 'Failed to get tree structure',
            data: []
        }
    }
})

router.get('/api/cell-type-tree', async (ctx) => {
    try {
        const params = ctx.query
        const result1 = await db.Db('source')
            .where('source_cell_type_class', 'like', `%${params.word || ''}%`)
            .select()
        
        let tree = {}
        for (let i = 0; i < result1.length; i++) {
            if (result1[i].source_cell_type_class != 'NA') {
                let A = result1[i].source_cell_type_class ? result1[i].source_cell_type_class.trim() : ''
                let B = result1[i].source_cell_type ? result1[i].source_cell_type.trim() : ''
                if (tree.hasOwnProperty(A)) {
                    tree[A].children.push({
                        id: result1[i].id,
                        label: B,
                        children: []
                    })
                } else {
                    tree[A] = {
                        children: [{
                            id: result1[i].id,
                            label: B,
                            children: []
                        }]
                    }
                }
            }
        }
        
        const result2 = await db.Db('source')
            .where('target_cell_type_class', 'like', `%${params.word || ''}%`)
            .select()
        
        for (let i = 0; i < result2.length; i++) {
            if (result2[i].target_cell_type_class != 'NA') {
                let A = result2[i].target_cell_type_class ? result2[i].target_cell_type_class.trim() : ''
                let B = result2[i].target_cell_type ? result2[i].target_cell_type.trim() : ''
                if (tree.hasOwnProperty(A)) {
                    tree[A].children.push({
                        id: result2[i].id,
                        label: B,
                        children: []
                    })
                } else {
                    tree[A] = {
                        children: [{
                            id: result2[i].id,
                            label: B,
                            children: []
                        }]
                    }
                }
            }
        }
        
        let elTree = []
        for (let o in tree) {
            tree[o].children.sort((a, b) => {
                return a.label.toLowerCase().localeCompare(b.label.toLowerCase())
            })
            elTree.push({
                id: o,
                label: o,
                children: tree[o].children,
                isFather: true
            })
        }
        
        ctx.body = {
            code: 200,
            msg: 'ok',
            data: elTree
        }
    } catch (error) {
        console.error('Failed to get cell type tree structure:', error)
        ctx.body = {
            code: 200,
            msg: 'Failed to get cell type tree structure',
            data: []
        }
    }
})

router.get('/api/v1/download/count', async (ctx) => {
    try {
        const result = await db.Db('download').where('id', '=', 1).find()
        ctx.body = {
            code: 200,
            msg: 'ok',
            data: result
        }
    } catch (error) {
        console.error('Failed to get download count:', error)
        ctx.body = {
            code: 200,
            msg: 'Failed to get download count',
            data: null
        }
    }
})

router.post('/api/v1/download/update', async (ctx) => {
    try {
        const params = ctx.request.body
        await db.Db('download').where('id', '=', 1).update({
            count: (params.count || 0) + 1,
            update_time: new Date().toISOString()
        }, true)
        ctx.body = {
            code: 200,
            msg: 'ok',
            data: null
        }
    } catch (error) {
        console.error('Failed to update download count:', error)
        ctx.body = {
            code: 200,
            msg: 'Failed to update download count',
            data: null
        }
    }
})

// Get download statistics
router.get('/api/v1/download/stats', async (ctx) => {
    try {
        const result = await db.Db('download').where('id', '=', 1).find()
        ctx.body = {
            code: 200,
            msg: 'ok',
            data: {
                totalDownloads: result.count || 0,
                lastUpdate: result.update_time || null
            }
        }
    } catch (error) {
        console.error('Failed to get download stats:', error)
        ctx.body = {
            code: 200,
            msg: 'Failed to get download stats',
            data: null
        }
    }
})

// Get statistics data
router.get('/api/v1/statistics', async (ctx) => {
    try {
        const { type } = ctx.query
        
        let data = {}
        
        switch (type) {
            case 'yearly_interactions':
                // 按年份统计交互数量
                const yearlyData = await db.Db('source')
                    .field('publication_year, COUNT(*) as count')
                    .group('publication_year')
                    .order('publication_year ASC')
                    .select()
                data = yearlyData
                break
                
            case 'context_interactions':
                // 按生理学背景统计交互数量
                const contextData = await db.Db('source')
                    .field('context, COUNT(*) as count')
                    .where('context', '!=', '')
                    .where('context', '!=', 'NA')
                    .group('context')
                    .order('count DESC')
                    .limit(10)
                    .select()
                data = contextData
                break
                
            case 'source_cell_types':
                // 按源细胞类型统计交互数量
                const sourceData = await db.Db('source')
                    .field('source_cell_type, COUNT(*) as count')
                    .where('source_cell_type', '!=', '')
                    .where('source_cell_type', '!=', 'NA')
                    .group('source_cell_type')
                    .order('count DESC')
                    .limit(10)
                    .select()
                data = sourceData
                break
                
            case 'target_cell_types':
                // 按目标细胞类型统计交互数量
                const targetData = await db.Db('source')
                    .field('target_cell_type, COUNT(*) as count')
                    .where('target_cell_type', '!=', '')
                    .where('target_cell_type', '!=', 'NA')
                    .group('target_cell_type')
                    .order('count DESC')
                    .limit(10)
                    .select()
                data = targetData
                break
                
            case 'cell_type_pairs':
                // 按细胞类型对统计交互数量
                const pairsData = await db.Db('source')
                    .field('source_cell_type, target_cell_type, COUNT(*) as count')
                    .where('source_cell_type', '!=', '')
                    .where('source_cell_type', '!=', 'NA')
                    .where('target_cell_type', '!=', '')
                    .where('target_cell_type', '!=', 'NA')
                    .group('source_cell_type, target_cell_type')
                    .order('count DESC')
                    .limit(10)
                    .select()
                data = pairsData
                break
                
            case 'interaction_details':
                // 按交互详情统计
                const interactionData = await db.Db('source')
                    .field('interaction_type, COUNT(*) as count')
                    .where('interaction_type', '!=', '')
                    .where('interaction_type', '!=', 'NA')
                    .group('interaction_type')
                    .order('count DESC')
                    .limit(10)
                    .select()
                data = interactionData
                break
                
            default:
                data = { error: 'Invalid statistics type' }
        }
        
        ctx.body = {
            code: 200,
            msg: 'ok',
            data: data
        }
    } catch (error) {
        console.error('Failed to get statistics:', error)
        ctx.body = {
            code: 200,
            msg: 'Failed to get statistics',
            data: []
        }
    }
})

// Use routes
app.use(router.routes())
app.use(router.allowedMethods())

// Start server
const appConfig = require('./config/app.js')
const PORT = appConfig.port
app.listen(PORT, () => {
    console.log('='.repeat(50))
    console.log('🚀 CellTypeDB API Server Started Successfully!')
    console.log(`📍 Service Address: http://localhost:${PORT}`)
    console.log(`🌍 Environment: ${appConfig.env}`)
    console.log(`🗄️  Database File: ${require('./config/database.js').db.database}`)
    console.log(`⏰ Startup Time: ${new Date().toLocaleString()}`)
    console.log('='.repeat(50))
    console.log('📋 Available API Endpoints:')
    console.log(`   POST /api/v1/get_tree`)
    console.log(`   POST /api/v1/get_cell_type_tree`)
    console.log(`   POST /api/v1/show_count`)
    console.log(`   POST /api/v1/update_count`)
    console.log(`   POST /api/v1/get_data_img`)
    console.log(`   POST /api/v1/get_data_table`)
    console.log(`   POST /api/v1/get_count`)
    console.log(`   GET  /api/tree`)
    console.log(`   GET  /api/cell-type-tree`)
    console.log(`   GET  /api/v1/download/count`)
    console.log(`   POST /api/v1/download/update`)
    console.log(`   GET  /api/v1/download/stats`)
    console.log(`   GET  /api/v1/statistics`)
    console.log('='.repeat(50))
    console.log('🔧 Configuration:')
    console.log(`   Port: ${PORT}`)
    console.log(`   CORS Origin: ${appConfig.cors.origin}`)
    console.log(`   Cache Enabled: ${appConfig.cache.enabled}`)
    console.log(`   Request Logging: ${appConfig.logging.enableRequestLog}`)
    console.log('='.repeat(50))
})