/*
 * @Author: zhangyu
 * @Date: 2021-04-15 21:18:51
 * @LastEditTime: 2021-10-11 13:52:26
 */
const Controller = require('think-js-lib').Controller

class DownloadController extends Controller{
  // 显示下载数量
  async show_count(ctx){
    let result = await this.Db('download').where('id',1).find()
    return this.showSuccess(result)
  }
  // 记录下载
  update_count(ctx){
    let params = this.getParams(ctx)
    this.Db('download').where('id',1).update({
      count: params.count + 1
    },true)
    return this.showSuccess()
  }
}

module.exports = DownloadController