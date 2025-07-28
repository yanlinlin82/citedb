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
        <img src="https://www.citedb.cn/plus.png"/>
        <div class="txt">plus</div>
      </div>
      <div class="btnItem" @click="reduce">
        <img src="https://www.citedb.cn/reduce.png"/>
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
let agg = {}
export default {
  props: ['chartList', 'check'],
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
      this.series.zoom += 0.3
      this.cakeChart.setOption({
        series: [{ ...this.series, zoom: this.series.zoom }]
      })
    },
    reduce () {
      this.series.zoom -= 0.3
      this.cakeChart.setOption({
        series: [{ ...this.series, zoom: this.series.zoom }]
      })
    },
    initData (list) {
      const arr = []
      const lineArr = []
      const colorArr = []
      const class_array = {}
      agg = {}
      list.forEach(item => {
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
        list.forEach(ele => {
          if (ele.lineId === item) {
            count += 2
          }
        })
        newObj[item] = count
      })

      list.forEach(item => {
        if (!countList.includes(item.lineId)) {
          item.count = newObj[item.lineId]
          countList.push(item.lineId)
          newList.push(item)
        }
      })
      const newArr = [...new Set(arr)]
      const data = []
      newArr.forEach(item => {
        data.push({
          name: item,
          color: colorArr.includes(item) ? '#ff001c' : '#3866b9',
          type_class: class_array[item]
        })
      })
      this.initLinks(newList, data)
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
      const chart = this.$refs.echarts
      const that = this
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
        roam: false,
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
              that.$axios.post('get_count', {
                name: params.data.type_class,
                check: that.check
              }).then((res) => {
                if (res.msg === 'ok') {
                  const content = `   ${res.data}   `
                  callback(ticket, content)
                }
              })
              return ' '
            }
            if (params.dataType === 'edge') {
              let html = ''
              for (let i = 0; i < params.data.interaction.length; i++) {
                html += '<div>' + params.data.interaction[i] + '</div>'
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
      option && this.cakeChart.setOption(option)
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
  font-size: 20px;
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
    img{
      width: 15px;
      height: 15px;
    }
    .txt{
      margin-top: 3px;
    }
  }
  .btnItem:hover{
    cursor:pointer;
    .txt{
      color: #5597B7;
    }
  }
}
</style>
