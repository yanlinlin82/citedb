/*
 * @Author: zhangyu
 * @Date: 2021-04-15 21:18:51
 * @LastEditTime: 2022-04-06 14:56:23
 */
const BaseController = require('./base.js')
const exec = require('child_process').execSync

class SearchController extends BaseController{
    // 获取context树结构
    async get_tree(ctx){
        let params = this.getParams(ctx)
        let result = await this.Db('mesh_tree')
        .where('mesh_name','like',`%${params.word ? params.word : ''}%`)
        .whereOr('context','like',`%${params.word ? params.word : ''}%`)
        .order('mesh_id','asc').select()
        // 初步整理成树
        let tree = {}
        for(let i = 0;i < result.length;i++){
            if(tree.hasOwnProperty(result[i].mesh_name)){
                tree[result[i].mesh_name].children.push({
                    id: `CH${result[i].id}`,
                    label: this.trim(result[i].context),
                    children: []
                })
            }else{
                tree[result[i].mesh_name] = {
                    mesh_id: result[i].mesh_id,
                    children: [{
                        id: `CH${result[i].id}`,
                        label: this.trim(result[i].context),
                        children: []
                    }]
                }
            }
        }
        // 整理成vue-element-tree结构
        let elTree = []
        for(let o in tree){
            // 子节点排序,不区分大小写
            tree[o].children.sort((a,b) => {
                return a.label.toLowerCase().localeCompare(b.label.toLowerCase())
            })
            elTree.push({
                id: tree[o].mesh_id,
                label: o,
                children: tree[o].children,
                isFather: true
            })
        }
        return this.showSuccess(elTree)
    }
    // 获取cellType树结构
    async get_cell_type_tree(ctx){
        let params = this.getParams(ctx)
        // let result1 = await this.Db('source')
        // .field('source_cell_type_class')
        // .distinct(true)
        // .where('source_cell_type_class','like',`%${params.word ? params.word : ''}%`)
        // .select()
        // for(let i = 0;i<result1.length;i++){
        //     let res = await this.Db('source').where('source_cell_type_class')
        // }
        let result1 = await this.Db('source')
        .where('source_cell_type_class','like',`%${params.word ? params.word : ''}%`)
        .select()
        let tree = {}
        for(let i = 0;i<result1.length;i++){
            if(result1[i].source_cell_type_class != 'NA'){
                let A = this.trim(result1[i].source_cell_type_class)
                let B = this.trim(result1[i].source_cell_type)
                if(tree.hasOwnProperty(A)){
                    tree[A].children.push({
                        id: result1[i].id,
                        label: B,
                        children: []
                    })
                }else{
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
        let result2 = await this.Db('source')
        .where('target_cell_type_class','like',`%${params.word ? params.word : ''}%`)
        .select()
        for(let i = 0;i<result2.length;i++){
            if(result2[i].target_cell_type_class != 'NA'){
                let A = this.trim(result2[i].target_cell_type_class)
                let B = this.trim(result2[i].target_cell_type)
                if(tree.hasOwnProperty(A)){
                    tree[A].children.push({
                        id: result2[i].id,
                        label: B,
                        children: []
                    })
                }else{
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
        // 整理成vue-element-tree结构
        let elTree = []
        for(let o in tree){
            let children = this.duplicate(tree[o].children)
            // 排序，不区分大小写
            children.sort((a,b) => {
                return a.label.toLowerCase().localeCompare(b.label.toLowerCase())
            })
            elTree.push({
                id: o,
                label: o,
                children: children,
                isFather: true
            })
        }
        // 排序，不区分大小写
        elTree.sort((a,b) => {
            return a.label.toLowerCase().localeCompare(b.label.toLowerCase())
        })
        return this.showSuccess(elTree)
    }
    // 获取关系图数据
    async get_data_img(ctx){
        let params = this.getParams(ctx)
        let model = this.Db('source')//.where('organism',params.species)
        // if(params.method){
        //     model = model.where('method',params.method)
        // }
        if(params.context){
            model = model.where('context','in',params.context)
        }
        if(params.cell_type){
            if(params.check2){
                model = model
                .where('source_cell_type','in',params.cell_type)
                .whereOr('target_cell_type','in',params.cell_type)
            }else{
                model = model
                .where('source_cell_type','in',params.cell_type)
                .where('target_cell_type','in',params.cell_type)
            }
        }
        let result = []
        if(params.context == '' && params.cell_type == ''){
            result = []
        }else{
            result = await model.select()
            if(params.method.length > 0){
                result = result.filter(v => {
                    if(params.method.indexOf(this.trim(v.method)) > -1){
                        return true
                    }else{
                        return false
                    }
                })
            }
            result = result.map(v => {
                return {
                    publication_year: this.trim(v.publication_year),
                    organism: this.trim(v.organism),
                    context: this.trim(v.context),
                    mesh_id: this.trim(v.mesh_id),
                    mesh_name: this.trim(v.mesh_name),
                    phase: this.trim(v.phase),
                    tissue: this.trim(v.tissue),
                    function: this.trim(v.function),
                    source_cell_type_class: this.trim(v.source_cell_type_class),
                    source_cell_type: this.trim(v.source_cell_type),
                    target_cell_type_class: this.trim(v.target_cell_type_class),
                    target_cell_type: this.trim(v.target_cell_type),
                    clear_direction: this.trim(v.clear_direction),
                    reciprocal_direction: this.trim(v.reciprocal_direction),
                    interaction: this.trim(v.interaction),
                    method: this.trim(v.method),
                    method_details: this.trim(v.method_details),
                    information: this.trim(v.information),
                    full_pdf: this.trim(v.full_pdf),
                    pmid: this.trim(v.pmid),
                    title: this.trim(v.title)
                }
            })
        }
        return this.showSuccess(result.filter(v => v.organism == params.species))
    }
    // 获取表格数据
    async get_data_table(ctx){
        let params = this.getParams(ctx)
        let model = this.Db('source')//.where('organism',params.species)
        // if(params.method){
        //     model = model.where('method',params.method)
        // }
        if(params.context){
            model = model.where('context','in',params.context)
        }
        if(params.cell_type){
            if(params.check2){
                model = model
                .where('source_cell_type','in',params.cell_type)
                .whereOr('target_cell_type','in',params.cell_type)
            }else{
                model = model
                .where('source_cell_type','in',params.cell_type)
                .where('target_cell_type','in',params.cell_type)
            }
        }
        let result = []
        let totalCount = 0
        if(params.context == '' && params.cell_type == ''){
            result = []
        }else{
            result = await model
            //.page(params.current,params.size)
            .select()
            if(params.method.length > 0){
                result = result.filter(v => {
                    if(params.method.indexOf(this.trim(v.method)) > -1){
                        return true
                    }else{
                        return false
                    }
                })
            }
            //totalCount = await model.select()
            // if(params.method){
            //     totalCount = totalCount.filter(v => this.trim(v.method) == params.method).length
            // }else{
            //     totalCount = totalCount.length
            // }
            for(let i = 0;i < result.length;i++){
                let mesh_id_array = result[i].mesh_id ? result[i].mesh_id.split('|') : []
                let urlArray = []
                for(let j = 0;j<mesh_id_array.length;j++){
                    let mesh = await this.Db('mesh').where('mesh_id','=',mesh_id_array[j]).find()
                    urlArray.push(`https://meshb.nlm.nih.gov/record/ui?ui=${mesh.uniqueid}&id=${mesh.mesh_id}`) 
                }
                result[i].url = urlArray
                result[i].publication_year = this.trim(result[i].publication_year)
                result[i].organism = this.trim(result[i].organism)
                result[i].context = this.trim(result[i].context)
                result[i].mesh_id = this.trim(result[i].mesh_id)
                result[i].mesh_name = this.trim(result[i].mesh_name)
                result[i].phase = this.trim(result[i].phase)
                result[i].tissue = this.trim(result[i].tissue)
                result[i].function = this.trim(result[i].function)
                result[i].source_cell_type_class = this.trim(result[i].source_cell_type_class)
                result[i].source_cell_type = this.trim(result[i].source_cell_type)
                result[i].target_cell_type_class = this.trim(result[i].target_cell_type_class)
                result[i].target_cell_type = this.trim(result[i].target_cell_type)
                result[i].clear_direction = this.trim(result[i].clear_direction)
                result[i].reciprocal_direction = this.trim(result[i].reciprocal_direction)
                result[i].interaction = this.trim(result[i].interaction)
                result[i].method = this.trim(result[i].method)
                result[i].method_details = this.trim(result[i].method_details)
                result[i].information = this.trim(result[i].information)
                result[i].full_pdf = this.trim(result[i].full_pdf)
                result[i].pmid = this.trim(result[i].pmid)
                result[i].title = this.trim(result[i].title)
            }    
        }
        return this.showSuccess({
            list: result.filter(v => v.organism == params.species),
            totalCount: result.filter(v => v.organism == params.species).length
        })
    }

    // 获取出现的次数
    async get_count(ctx) {
        let params = this.getParams(ctx)
        let name = params.name
        let check = params.check
        let field1 = check ? 'source_cell_type_class' : 'source_cell_type'
        let field2 = check ? 'target_cell_type_class' : 'target_cell_type'
        const res1 = await this.Db('source').where(field1,'=',name).count()
        const res2 = await this.Db('source').where(field2,'=',name).count()
        return this.showSuccess(res1 + res2)
    }
    // 二维数组去重
    duplicate(array){
        let arr = []
        let newArray = []
        for(let i = 0;i < array.length;i++){
            if(arr.indexOf(array[i].label) == -1){
                arr.push(array[i].label)
                newArray.push(array[i])
            }
        }
        return newArray
    }
    // 去空格
    trim(str){
        if(typeof str === 'string'){
            return str.replace(/(^\s*)|(\s*$)/g, "")
        }else{
            return str
        }
    }


    // 自动部署(API接口)
    webHooks1(ctx){
        // 验证TOKEN
        if(ctx.headers['x-gitlab-token'] == '76cbaef81ebd70810f324bbab4d1869e'){
            try {
                exec('/cellTypeDB/celltypeapi/run1.sh')
                return this.showSuccess(true)
            } catch (e) {
                return this.ApiException('脚本运行错误')
            }
        }else{
            return this.ApiException('密码错误')
        }
    }

    // 自动部署(站点)
    webHooks2(ctx){
        // 验证TOKEN
        if(ctx.headers['x-gitlab-token'] == '76cbaef81ebd70810f324bbab4d1869e'){
            try {
                exec('/cellTypeDB/celltypeapi/run2.sh')
                return this.showSuccess(true)
            } catch (e) {
                return this.ApiException('脚本运行错误')
            }
        }else{
            return this.ApiException('密码错误')
        }
    }
}

module.exports = SearchController