/*
 * @page: 页面-
 * @Author: Dragon
 * @Date: 2021-03-17 16:48:36
 * @LastEditors: Dragon
 * @LastEditTime: 2021-03-17 16:48:54
 */

/**
 * 把Echarts X轴字数过多折行显示
 * @param  {number} num    每行能显示的字的个数
 * @return {string}        格式化后的数据
 */
export function xAxisValue (params, num) {
  var newParamsName = '' // 最终拼接成的字符串
  var paramsNameNumber = params.length // 实际标签的个数
  var provideNumber = num // 每行能显示的字的个数
  var rowNumber = Math.ceil(paramsNameNumber / provideNumber) // 换行的话，需要显示几行，向上取整
  /**
     * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
     */
  // 条件等同于rowNumber>1
  if (paramsNameNumber > provideNumber) {
    /** 循环每一行,p表示行 */
    for (var p = 0; p < rowNumber; p++) {
      var tempStr = ''// 表示每一次截取的字符串
      var start = p * provideNumber // 开始截取的位置
      var end = start + provideNumber // 结束截取的位置
      // 此处特殊处理最后一行的索引值
      if (p === rowNumber - 1) {
        // 最后一次不换行
        tempStr = params.substring(start, paramsNameNumber)
      } else {
        // 每一次拼接字符串并换行
        tempStr = params.substring(start, end) + '\n'
      }
      newParamsName += tempStr // 最终拼成的字符串
    }
  } else {
    // 将旧标签的值赋给新标签
    newParamsName = params
  }
  return newParamsName
}
