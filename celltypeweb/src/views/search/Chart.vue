<!--
 * @page: 页面-
 * @Author: Dragon
 * @Date: 2021-06-25 14:20:14
 * @LastEditors: Dragon
 * @LastEditTime: 2022-04-06 17:03:58
-->
<template>
  <div>
    <div v-show="chartList.length" class="tip">
      <div class="cricle"></div>self -> self
    </div>
    <div class="plusOreduce" v-show="chartList.length">
      <div class="btnItem" @click="plus">
        <span class="icon">+</span>
        <div class="txt">plus</div>
      </div>
      <div class="btnItem" @click="reduce">
        <span class="icon">−</span>
        <div class="txt">reduce</div>
      </div>
    </div>
    <div v-show="chartList.length > 0" style="height:700px;width:1130px;margin-top: 30px" ref="echarts"></div>
    <div class="no-records" v-show="chartList.length <= 0">
      <h1>No Records</h1>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { performanceMonitor } from '@/utils/performance.js'
let agg = {}

// 添加防抖函数
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export default {
  props: ['chartList', 'check'],
  data() {
    return {
      cakeChart: null,
      isInitializing: false
    }
  },
  beforeUnmount() {
    // 清理ECharts实例
    if (this.cakeChart) {
      this.cakeChart.dispose()
      this.cakeChart = null
    }
  },
  methods: {
    async getCount () {
      const res = await this.$axios.post('get_tree', {
        word: this.context_input
      })
      if (res.msg === 'ok') {
        return res
      }
    },
    plus () {
      console.log('plus clicked, series:', this.series, 'chart:', this.cakeChart)
      if (this.series && this.cakeChart) {
        this.series.zoom += 0.3
        this.cakeChart.setOption({
          series: [{ ...this.series, zoom: this.series.zoom }]
        })
        console.log('zoom increased to:', this.series.zoom)
      } else {
        console.warn('plus: series or chart not available')
      }
    },
    reduce () {
      console.log('reduce clicked, series:', this.series, 'chart:', this.cakeChart)
      if (this.series && this.cakeChart) {
        this.series.zoom -= 0.3
        this.cakeChart.setOption({
          series: [{ ...this.series, zoom: this.series.zoom }]
        })
        console.log('zoom decreased to:', this.series.zoom)
      } else {
        console.warn('reduce: series or chart not available')
      }
    },
    // 修复防抖函数中的this上下文
    initData(list) {
      // 使用箭头函数保持this上下文
      const debouncedInitData = debounce((data) => {
        performanceMonitor.start('Chart.initData')
        
        if (this.isInitializing) return
        this.isInitializing = true
        
        try {
          const arr = []
          const lineArr = []
          const colorArr = []
          const class_array = {}
          agg = {}
          
          if (!data || data.length === 0) {
            this.isInitializing = false
            performanceMonitor.end('Chart.initData')
            return
          }
          
          data.forEach(item => {
            if (this.check) {
              item.source = item.source_cell_type_class
              item.target = item.target_cell_type_class
              const key = item.source + '@' + item.target
              if (agg[key]) {
                agg[key].push(item.interaction)
              } else {
                agg[key] = []
                agg[key].push(item.interaction)
              }
              arr.push(item.source_cell_type_class)
              arr.push(item.target_cell_type_class)
              class_array[item.source_cell_type_class] = item.source_cell_type_class
              class_array[item.target_cell_type_class] = item.target_cell_type_class
              if (item.source_cell_type_class === item.target_cell_type_class) {
                colorArr.push(item.source_cell_type_class)
              }
              item.lineId = `${item.source_cell_type_class}${item.target_cell_type_class}${item.clear_direction}${item.reciprocal_direction}`
              lineArr.push(`${item.source_cell_type_class}${item.target_cell_type_class}${item.clear_direction}${item.reciprocal_direction}`)
            } else {
              item.source = item.source_cell_type
              item.target = item.target_cell_type
              const key = item.source + '@' + item.target
              if (agg[key]) {
                agg[key].push(item.interaction)
              } else {
                agg[key] = []
                agg[key].push(item.interaction)
              }
              arr.push(item.source_cell_type)
              arr.push(item.target_cell_type)
              class_array[item.source_cell_type] = item.source_cell_type_class
              class_array[item.target_cell_type] = item.target_cell_type_class
              if (item.source_cell_type === item.target_cell_type) {
                colorArr.push(item.source_cell_type)
              }
              item.lineId = `${item.source_cell_type}${item.target_cell_type}${item.clear_direction}${item.reciprocal_direction}`
              lineArr.push(`${item.source_cell_type}${item.target_cell_type}${item.clear_direction}${item.reciprocal_direction}`)
            }
          })

          const newLineArr = [...new Set(lineArr)]
          const newObj = {}
          const newList = []
          const countList = []
          newLineArr.forEach(item => {
            let count = 1
            data.forEach(ele => {
              if (ele.lineId === item) {
                count += 2
              }
            })
            newObj[item] = count
          })

          data.forEach(item => {
            if (!countList.includes(item.lineId)) {
              item.count = newObj[item.lineId]
              countList.push(item.lineId)
              newList.push(item)
            }
          })
          const newArr = [...new Set(arr)]
          const chartData = []
          newArr.forEach(item => {
            chartData.push({
              name: item,
              color: colorArr.includes(item) ? '#ff001c' : '#3866b9',
              type_class: class_array[item] || item // 确保有默认值
            })
          })
          
          console.log('Chart data built:', chartData)

          // 异步渲染图表
          this.$nextTick(() => {
            this.initLinks(newList, chartData)
            this.isInitializing = false
            performanceMonitor.end('Chart.initData')
          })
        } catch (error) {
          console.error('图表数据处理失败:', error)
          this.isInitializing = false
          performanceMonitor.end('Chart.initData')
        }
      }, 300)
      
      // 调用防抖函数
      debouncedInitData(list)
    },
    initLinks (list, data) {
      const links = []
      list.forEach((item, index) => {
        let count = 0
        const arr = [item.source, item.target]
        links.forEach(linkItem => {
          if (arr.includes(linkItem.source) && arr.includes(linkItem.target)) {
            count++
          }
          if (item.source === item.target) {
            // count += 1
          }
        })
        links.push({
          source: item.source,
          target: item.target,
          symbol: [(item.reciprocalDirection === 1 || item.source === item.target) ? 'arrow' : 'none', 'arrow'],
          ignoreForceLayout: true,
          lineStyle: {
            width: item.count,
            curveness: count * 0.1,
            // color: '#337ab7',
            type: item.clear_direction ? 'solid' : 'dashed'
          },
          interaction: agg[item.source + '@' + item.target]
        })
      })
      this.init1(data, links)
    },
    init1 (data, links) {
      try {
        const chart = this.$refs.echarts
        if (!chart) {
          console.warn('图表容器不存在')
          return
        }
        
        const that = this
        
        // 清理旧的图表实例
        if (this.cakeChart) {
          this.cakeChart.dispose()
        }
        
        this.cakeChart = echarts.init(chart)
        this.series = {
          type: 'graph',
          layout: 'force', // circular force
          force: {
            // repulsion: 20,
            edgeLength: 150,
            repulsion: 50,
            gravity: 0.01
          },
          symbolSize: 50,
          roam: true, // 启用拖拽和缩放
          zoom: 1,
          label: {
            show: true,
            position: 'bottom'
          },
          edgeSymbolSize: [10, 10],
          edgeLabel: {
            fontSize: 10
            // show: true
          },
          data,
          links,
          itemStyle: {
            color: params => {
              return params.data.color
            }
          }
        }
        const option = {
          animationDurationUpdate: 1500,
          animationEasingUpdate: 'quinticInOut',
          tooltip: {
            triggerOn: 'click',
            enterable: true,
            formatter: function (params, ticket, callback) {
              if (params.dataType === 'node') {
                console.log('Node clicked:', params.data)
                
                // 检查必要的数据
                if (!params.data || !params.data.name) {
                  console.warn('Node data missing:', params.data)
                  callback(ticket, '节点信息不完整')
                  return ' '
                }
                
                // 获取type_class，如果没有则使用name
                const typeClass = params.data.type_class || params.data.name
                console.log('Using type_class:', typeClass)
                
                that.$axios.post('get_count', {
                  name: typeClass,
                  check: that.check
                }).then((res) => {
                  console.log('get_count response:', res)
                  if (res.msg === 'ok' && res.data) {
                    const content = `节点: ${params.data.name}<br/>类型: ${typeClass}<br/>数量: ${res.data}`
                    callback(ticket, content)
                  } else {
                    console.warn('get_count failed:', res)
                    const content = `节点: ${params.data.name}<br/>类型: ${typeClass}<br/>数量: 未知`
                    callback(ticket, content)
                  }
                }).catch((error) => {
                  console.error('get_count error:', error)
                  const content = `节点: ${params.data.name}<br/>类型: ${typeClass}<br/>数量: 获取失败`
                  callback(ticket, content)
                })
                
                return '加载中...'
              }
              if (params.dataType === 'edge') {
                console.log('Edge clicked:', params.data)
                let html = ''
                if (params.data.interaction && params.data.interaction.length > 0) {
                  html += '<div style="font-weight: bold; margin-bottom: 5px;">交互详情:</div>'
                  for (let i = 0; i < params.data.interaction.length; i++) {
                    html += '<div style="margin: 2px 0;">' + params.data.interaction[i] + '</div>'
                  }
                } else {
                  html = '<div>暂无交互信息</div>'
                }
                return html
              }
            }
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {
                show: true,
                excludeComponents: ['toolbox'],
                pixelRatio: 5,
                name: 'Result',
                title: 'saveAsImage'
              }
            }
          },
          series: this.series
        }
        
        // 异步设置选项以避免阻塞
        setTimeout(() => {
          if (this.cakeChart) {
            this.cakeChart.setOption(option)
          }
        }, 0)
        
      } catch (error) {
        console.error('图表初始化失败:', error)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.no-records{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.tip{
  margin: 20px 0;
  display: flex;
  align-items: center;
  font-size: 1.25rem; /* 20px -> 1.25rem */
  justify-content: flex-end;
  .cricle{
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #ff001c;
    margin-right: 10px;
  }
}

.plusOreduce{
  padding-top: 20px;
  display: flex;
  justify-content: flex-end;
  .btnItem{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 5px;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: background-color 0.2s;
    
    .icon{
      font-size: 1.125rem; /* 18px -> 1.125rem */
      font-weight: bold;
      color: #333;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .txt{
      margin-top: 3px;
      font-size: 0.75rem; /* 12px -> 0.75rem */
      color: #666;
    }
  }
  .btnItem:hover{
    background-color: #f5f5f5;
    .txt{
      color: #5597B7;
    }
    .icon{
      color: #5597B7;
    }
  }
}
</style>
