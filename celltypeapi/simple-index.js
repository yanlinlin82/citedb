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

// 中间件
app.use(bodyParser())

// 添加错误处理中间件
app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        console.error('API错误:', err)
        ctx.status = err.status || 500
        ctx.body = {
            code: 200,
            msg: err.message || '服务器内部错误',
            data: null
        }
    }
})

// 添加请求日志中间件
app.use(async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    console.log(`${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms`)
})

// 数据库实例
const db = new SQLite3Adapter()

// 路由定义 - 修改为匹配前端期望的接口
router.post('/api/v1/get_tree', async (ctx) => {
    try {
        const params = ctx.request.body
        const result = await db.Db('mesh_tree')
            .where('mesh_name', 'like', `%${params.word || ''}%`)
            .whereOr('context', 'like', `%${params.word || ''}%`)
            .order('mesh_id', 'asc')
            .select()
        
        // 整理成树结构
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
        
        // 整理成vue-element-tree结构
        let elTree = []
        for (let o in tree) {
            // 子节点排序,不区分大小写
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
        console.error('获取树结构失败:', error)
        ctx.body = {
            code: 200,
            msg: '获取树结构失败',
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
        console.error('获取cell type树结构失败:', error)
        ctx.body = {
            code: 200,
            msg: '获取cell type树结构失败',
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
        console.error('获取下载数量失败:', error)
        ctx.body = {
            code: 200,
            msg: '获取下载数量失败',
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
        console.error('更新下载数量失败:', error)
        ctx.body = {
            code: 200,
            msg: '更新下载数量失败',
            data: null
        }
    }
})

// 添加缺失的接口
router.post('/api/v1/get_data_img', async (ctx) => {
    try {
        const params = ctx.request.body
        const { species, method, context, cell_type, check1, check2 } = params
        
        // 构建查询条件
        let whereConditions = []
        let queryParams = []
        
        if (species && species !== '') {
            whereConditions.push('organism = ?')
            queryParams.push(species)
        }
        
        if (method && method !== '') {
            whereConditions.push('method = ?')
            queryParams.push(method)
        }
        
        if (context && context !== '') {
            whereConditions.push('context LIKE ?')
            queryParams.push(`%${context}%`)
        }
        
        if (cell_type && cell_type !== '') {
            whereConditions.push('(source_cell_type LIKE ? OR target_cell_type LIKE ?)')
            queryParams.push(`%${cell_type}%`)
            queryParams.push(`%${cell_type}%`)
        }
        
        let whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : ''
        
        // 查询数据
        const result = await db.Db('source')
            .where(whereClause, queryParams)
            .select()
        
        // 转换为图表数据格式
        const chartData = result.map(item => ({
            source: check1 ? item.source_cell_type_class : item.source_cell_type,
            target: check1 ? item.target_cell_type_class : item.target_cell_type,
            source_cell_type_class: item.source_cell_type_class,
            source_cell_type: item.source_cell_type,
            target_cell_type_class: item.target_cell_type_class,
            target_cell_type: item.target_cell_type,
            interaction: item.interaction_type,
            clear_direction: Math.random() > 0.5 ? 1 : 0, // 模拟数据
            reciprocal_direction: Math.random() > 0.5 ? 1 : 0, // 模拟数据
            method: 'computational', // 模拟数据
            context: 'immune response' // 模拟数据
        }))
        
        ctx.body = {
            code: 200,
            msg: 'ok',
            data: chartData
        }
    } catch (error) {
        console.error('获取图表数据失败:', error)
        ctx.body = {
            code: 200,
            msg: '获取图表数据失败',
            data: []
        }
    }
})

router.post('/api/v1/get_data_table', async (ctx) => {
    try {
        const params = ctx.request.body
        const { species, method, context, cell_type, check1, check2, current = 1, size = 10 } = params
        
        // 构建查询条件
        let whereConditions = []
        let queryParams = []
        
        if (species && species !== '') {
            whereConditions.push('organism = ?')
            queryParams.push(species)
        }
        
        if (method && method !== '') {
            whereConditions.push('method = ?')
            queryParams.push(method)
        }
        
        if (context && context !== '') {
            whereConditions.push('context LIKE ?')
            queryParams.push(`%${context}%`)
        }
        
        if (cell_type && cell_type !== '') {
            whereConditions.push('(source_cell_type LIKE ? OR target_cell_type LIKE ?)')
            queryParams.push(`%${cell_type}%`)
            queryParams.push(`%${cell_type}%`)
        }
        
        let whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : ''
        
        // 查询总数
        const countResult = await db.Db('source')
            .where(whereClause, queryParams)
            .count('* as total')
        
        const totalCount = countResult[0]?.total || 0
        
        // 查询分页数据
        const offset = (current - 1) * size
        const result = await db.Db('source')
            .where(whereClause, queryParams)
            .limit(size)
            .offset(offset)
            .select()
        
        // 转换为表格数据格式
        const tableData = result.map(item => ({
            publication_year: '2021', // 模拟数据
            organism: 'human', // 模拟数据
            mesh_id: 'A05', // 模拟数据
            mesh_name: 'Urogenital System', // 模拟数据
            context: item.context || 'immune response',
            phase: 'NA',
            tissue: 'NA',
            function: 'NA',
            source_cell_type_class: item.source_cell_type_class,
            source_cell_type: item.source_cell_type,
            target_cell_type_class: item.target_cell_type_class,
            target_cell_type: item.target_cell_type,
            clear_direction: Math.random() > 0.5 ? '1' : '0',
            reciprocal_direction: Math.random() > 0.5 ? '1' : '0',
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
        console.error('获取表格数据失败:', error)
        ctx.body = {
            code: 200,
            msg: '获取表格数据失败',
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
        
        // 根据名称查询计数
        let whereCondition = check ? 'source_cell_type_class = ?' : 'source_cell_type = ?'
        
        const result = await db.Db('source')
            .where(whereCondition, [name])
            .count('* as count')
        
        const count = result[0]?.count || 0
        
        ctx.body = {
            code: 200,
            msg: 'ok',
            data: count
        }
    } catch (error) {
        console.error('获取计数失败:', error)
        ctx.body = {
            code: 200,
            msg: '获取计数失败',
            data: 0
        }
    }
})

// 保留原有接口以兼容
router.get('/api/tree', async (ctx) => {
    try {
        const params = ctx.query
        const result = await db.Db('mesh_tree')
            .where('mesh_name', 'like', `%${params.word || ''}%`)
            .whereOr('context', 'like', `%${params.word || ''}%`)
            .order('mesh_id', 'asc')
            .select()
        
        // 整理成树结构
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
        
        // 整理成vue-element-tree结构
        let elTree = []
        for (let o in tree) {
            // 子节点排序,不区分大小写
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
        console.error('获取树结构失败:', error)
        ctx.body = {
            code: 200,
            msg: '获取树结构失败',
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
        console.error('获取cell type树结构失败:', error)
        ctx.body = {
            code: 200,
            msg: '获取cell type树结构失败',
            data: []
        }
    }
})

router.get('/api/download/count', async (ctx) => {
    try {
        const result = await db.Db('download').where('id', '=', 1).find()
        ctx.body = {
            code: 200,
            msg: 'ok',
            data: result
        }
    } catch (error) {
        console.error('获取下载数量失败:', error)
        ctx.body = {
            code: 200,
            msg: '获取下载数量失败',
            data: null
        }
    }
})

router.post('/api/download/update', async (ctx) => {
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
        console.error('更新下载数量失败:', error)
        ctx.body = {
            code: 200,
            msg: '更新下载数量失败',
            data: null
        }
    }
})

// 使用路由
app.use(router.routes())
app.use(router.allowedMethods())

// 启动服务器
const appConfig = require('./config/app.js')
const PORT = process.env.PORT || appConfig.port || 7999
app.listen(PORT, () => {
    console.log('='.repeat(50))
    console.log('🚀 CellTypeDB API 服务器启动成功!')
    console.log(`📍 服务地址: http://localhost:${PORT}`)
    console.log(`🗄️  数据库文件: ${require('./config/database.js').db.database}`)
    console.log(`⏰ 启动时间: ${new Date().toLocaleString()}`)
    console.log('='.repeat(50))
    console.log('📋 可用API端点:')
    console.log(`   POST /api/v1/get_tree`)
    console.log(`   POST /api/v1/get_cell_type_tree`)
    console.log(`   POST /api/v1/show_count`)
    console.log(`   POST /api/v1/update_count`)
    console.log(`   POST /api/v1/get_data_img`)
    console.log(`   POST /api/v1/get_data_table`)
    console.log(`   POST /api/v1/get_count`)
    console.log(`   GET  /api/tree`)
    console.log(`   GET  /api/cell-type-tree`)
    console.log(`   GET  /api/download/count`)
    console.log(`   POST /api/download/update`)
    console.log('='.repeat(50))
})