/*
 * @Author: zhangyu
 * @Date: 2021-04-15 22:02:16
 * @LastEditTime: 2022-04-06 13:03:19
 */

module.exports = (route) => {
    // [api/v1]分组
    route.group('/api/v1',(router) => {
        // 获取context树结构
        router.post('/get_tree','search/get_tree')
        // 获取cellType树结构
        router.post('/get_cell_type_tree','search/get_cell_type_tree')
        // 获取关系图数据
        router.post('/get_data_img','search/get_data_img')
        // 获取出现的次数
        router.post('/get_count','search/get_count')

        // 表格数据
        router.post('/get_data_table','search/get_data_table')

        // 自动部署(API接口)
        router.post('/webhooks1','search/webHooks1')
        // 自动部署(站点)
        router.post('/webhooks2','search/webHooks2')
    })
}