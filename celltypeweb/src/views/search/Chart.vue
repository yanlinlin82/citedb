<!--
 * @page: 页面-
 * @Author: Dragon
 * @Date: 2021-06-25 14:20:14
 * @LastEditors: Dragon
 * @LastEditTime: 2022-04-06 17:03:58
-->
<template>
  <div>
    <div v-show="chartList && chartList.length" class="tip">
      <div class="cricle"></div>self -> self
    </div>
    <div class="plusOreduce" v-show="chartList && chartList.length">
      <div class="btnItem" @click="throttledPlus">
        <img src="/plus.png" alt="Zoom In" class="icon-img">
        <div class="txt">Zoom In</div>
      </div>
      <div class="btnItem" @click="throttledReduce">
        <img src="/reduce.png" alt="Zoom Out" class="icon-img">
        <div class="txt">Zoom Out</div>
      </div>
    </div>
    <div v-show="chartList && chartList.length > 0" style="height:700px;width:1130px;margin-top: 30px" ref="echarts"></div>
    <div class="no-records" v-show="!chartList || chartList.length <= 0">
      <h1>No Records</h1>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { performanceMonitor, asyncProcessor } from '@/utils/performance.js'
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
  created() {
    // 使用节流函数优化缩放操作
    this.throttledPlus = asyncProcessor.throttle(this.plus, 100)
    this.throttledReduce = asyncProcessor.throttle(this.reduce, 100)
  },
  beforeUnmount() {
    // 清理ECharts实例
    if (this.cakeChart) {
      this.cakeChart.dispose()
      this.cakeChart = null
    }
    
    // 清理内存
    agg = {}
    
    // 清理定时器
    if (this.throttledPlus) {
      this.throttledPlus = null
    }
    if (this.throttledReduce) {
      this.throttledReduce = null
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
        // 使用requestAnimationFrame异步更新图表
        requestAnimationFrame(() => {
          this.cakeChart.setOption({
            series: [{ ...this.series, zoom: this.series.zoom }]
          })
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
        // 使用requestAnimationFrame异步更新图表
        requestAnimationFrame(() => {
          this.cakeChart.setOption({
            series: [{ ...this.series, zoom: this.series.zoom }]
          })
        })
        console.log('zoom decreased to:', this.series.zoom)
      } else {
        console.warn('reduce: series or chart not available')
      }
    },
    // 修复防抖函数中的this上下文
    initData(list) {
      // 使用新的防抖函数
      const debouncedInitData = asyncProcessor.debounce((data) => {
        performanceMonitor.start('Chart.initData')
        
        if (this.isInitializing) return
        this.isInitializing = true
        
        // 使用异步方式处理大数据，避免阻塞UI
        this.processDataAsync(data)
      }, 300)
      
      // 调用防抖函数
      debouncedInitData(list)
    },
    
    // 异步处理数据
    async processDataAsync(data) {
      try {
        // 如果数据量很大，使用分片处理
        if (data && data.length > 1000) {
          await this.processDataInChunks(data)
        } else {
          await this.processData(data)
        }
      } catch (error) {
        console.error('图表数据处理失败:', error)
      } finally {
        this.isInitializing = false
        performanceMonitor.end('Chart.initData')
      }
    },
    
    // 分片处理大数据
    async processDataInChunks(data) {
      const chunkSize = 500
      const chunks = []
      
      for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize))
      }
      
      const arr = []
      const lineArr = []
      const colorArr = []
      const class_array = {}
      agg = {}
      
      // 分批处理数据
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]
        await this.processChunk(chunk, arr, lineArr, colorArr, class_array)
        
        // 让出控制权，避免阻塞UI
        if (i % 5 === 0) {
          await new Promise(resolve => setTimeout(resolve, 0))
        }
      }
      
      // 处理结果数据
      await this.processResults(data, arr, lineArr, colorArr, class_array)
    },
    
    // 处理单个数据块
    async processChunk(chunk, arr, lineArr, colorArr, class_array) {
      chunk.forEach(item => {
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
    },
    
    // 处理小数据量
    async processData(data) {
      const arr = []
      const lineArr = []
      const colorArr = []
      const class_array = {}
      agg = {}
      
      if (!data || data.length === 0) {
        return
      }
      
      await this.processChunk(data, arr, lineArr, colorArr, class_array)
      await this.processResults(data, arr, lineArr, colorArr, class_array)
    },
    
    // 处理结果数据
    async processResults(data, arr, lineArr, colorArr, class_array) {
      const newLineArr = [...new Set(lineArr)]
      const newObj = {}
      const newList = []
      const countList = []
      
      // 异步处理连线数据
      await this.processLinksAsync(newLineArr, data, newObj, newList, countList)
      
      const newArr = [...new Set(arr)]
      const chartData = []
      newArr.forEach(item => {
        chartData.push({
          name: item,
          color: colorArr.includes(item) ? '#ff001c' : '#3866b9',
          type_class: class_array[item] || item
        })
      })
      
      console.log('Chart data built:', chartData)

      // 异步渲染图表
      this.$nextTick(() => {
        requestAnimationFrame(() => {
          this.initLinks(newList, chartData)
        })
      })
    },
    
    // 异步处理连线数据
    async processLinksAsync(newLineArr, data, newObj, newList, countList) {
      const chunkSize = 100
      const chunks = []
      
      for (let i = 0; i < newLineArr.length; i += chunkSize) {
        chunks.push(newLineArr.slice(i, i + chunkSize))
      }
      
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]
        chunk.forEach(item => {
          let count = 1
          data.forEach(ele => {
            if (ele.lineId === item) {
              count += 2
            }
          })
          newObj[item] = count
        })
        
        // 让出控制权
        if (i % 3 === 0) {
          await new Promise(resolve => setTimeout(resolve, 0))
        }
      }
      
      data.forEach(item => {
        if (!countList.includes(item.lineId)) {
          item.count = newObj[item.lineId]
          countList.push(item.lineId)
          newList.push(item)
        }
      })
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
        requestAnimationFrame(() => {
          if (this.cakeChart) {
            this.cakeChart.setOption(option)
          }
        })
        
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

.plusOreduce {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  .btnItem {
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid #ddd;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    &:hover {
      background: rgba(255, 255, 255, 1);
      border-color: #007bff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .icon-img {
      width: 24px;
      height: 24px;
      object-fit: contain;
      margin-bottom: 4px;
    }
    
    .txt {
      font-size: 0.7rem;
      font-weight: 600;
      color: #333;
      text-align: center;
      line-height: 1;
    }
  }
}
</style>
