/*
 * @Author: zhangyu
 * @Date: 2021-04-15 22:02:16
 * @LastEditTime: 2021-09-30 16:50:03
 */

module.exports = (route) => {
  // [api/v1]分组
  route.group('/api/v1',(router) => {
      // 显示下载数量
      router.post('/show_count','download/show_count')
      // 记录下载
      router.post('/update_count','download/update_count')
  })
}