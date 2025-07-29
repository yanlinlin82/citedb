<!--
 * @page: 页面-图表
 * @Author: Dragon
 * @Date: 2021-03-16 10:19:31
 * @LastEditors: Dragon
 * @LastEditTime: 2021-06-16 13:52:56
-->
<template>
  <div class="wrap-statistics">
    <NavBar current="search" />
    <div class="content">
      <div class="card">
        <div class="label">Species </div>
        <div class="flex">
          <el-select v-model="speciesValue" @change="speciesChange" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button @click="reset" type="danger">Reset</el-button>
        </div>
        <div class="select">
          <div class="select-list">
            <div class="flex">
              <div class="label">Context </div>
            </div>
            <div class="result"><el-icon><Bell /></el-icon> {{contextResult}}</div>
            <el-input placeholder="请输入内容" v-model="contextValue" @input="contextChange" clearable class="input-with-select">
            </el-input>
            <div class="result-list">
              <div @click="selectContext(item.context)" v-for="item in contextList" :key="item.context" :class="{'active': item.context == contextResult}" class="res-item">
                {{item.context}}
              </div>
            </div>
          </div>
          <div class="select-list right">
            <div class="flex">
              <div class="label">Cell type </div>
            </div>
            <div class="result">
              <el-icon class="icon-cell-type"><Bell /></el-icon>
              <div @click="deleteTag(index)" v-for="(item, index) in tagList" :key="item" class="tag">
                {{item}}
                <el-icon><CircleClose /></el-icon>
              </div>
            </div>
            <el-input placeholder="请输入内容" v-model="sourceValue" @input="sourceChange"  clearable class="input-with-select">
            </el-input>
            <div class="result-list">
              <div @click="selectSource(item)" v-for="item in sourceList" :key="item" :class="{'disabled': hasTag(item)}" class="res-item">
                {{item}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div ref="chart1" style="height:700px;width:100%;margin-top: 30px" />
      <div class="table-wrap">
        <div class="label">Result</div>
        <el-table
          :data="tableList"
          border
          empty-text="No data"
          style="width: 100%">
          <el-table-column
            prop="publication_year"
            label="Publication year">
          </el-table-column>
          <el-table-column
            prop="organism"
            label="Organism">
          </el-table-column>
          <el-table-column
            prop="context"
            label="Context">
          </el-table-column>
          <el-table-column
            prop="source_cell_type"
            label="Source Cell type">
          </el-table-column>
          <el-table-column
            prop="target_cell_type"
            label="Target Cell type">
          </el-table-column>
          <el-table-column
            prop="clear_direction"
            label="clear direction">
          </el-table-column>
          <el-table-column
            prop="interaction"
            label="Interaction">
          </el-table-column>
          <el-table-column
            prop="method"
            label="Method">
          </el-table-column>
          <el-table-column
            prop="method_details"
            label="Method details">
          </el-table-column>
          <el-table-column
            prop="information"
            label="Information">
          </el-table-column>
          <el-table-column
            prop="full_pdf"
            label="Full PDF">
          </el-table-column>
          <el-table-column
            prop="pmid"
            label="PMID">
          </el-table-column>
          <el-table-column
            prop="reciprocal_direction"
            label="reciprocal direction">
          </el-table-column>
          <el-table-column
            prop="title"
            label="Title"
            width="200">
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import NavBar from '@components/NavBar'
export default {
  components: {
    NavBar
  },
  data () {
    return {
      options: [{
        value: 'human',
        label: 'human'
      }, {
        value: 'human/mouse',
        label: 'human/mouse'
      }, {
        value: 'human/rabbit',
        label: 'human/rabbit'
      }, {
        value: 'human/rat',
        label: 'human/rat'
      }, {
        value: 'NA',
        label: 'NA'
      }],
      speciesValue: '',
      contextValue: '',
      contextList: [],
      contextResult: '',
      sourceValue: '',
      sourceList: [],
      sourceResult: '',
      tableList: [],
      tagList: []
    }
  },
  mounted () {},
  methods: {
    speciesChange (value) {
      this.contextResult = value
      this.contextValue = ''
      this.sourceValue = ''
      this.sourceList = []
      this.sourceResult = ''
      this.tableList = []
      this.tagList = []
      this.initData([])
      this.contextChange()
    },
    contextChange (value) {
      this.$axios.post('get_context', {
        species: this.speciesValue,
        context: value
      }).then((res) => {
        if (res.msg === 'ok') {
          this.contextList = res.data
        }
      })
    },
    sourceChange (value = '') {
      this.$axios.post('get_cell_type', {
        species: this.speciesValue,
        context: this.contextResult,
        cell_type: value
      }).then((res) => {
        if (res.msg === 'ok') {
          this.sourceList = res.data
        }
      })
    },
    selectContext (value) {
      this.contextResult = value
      this.sourceValue = ''
      this.sourceList = []
      this.sourceResult = ''
      this.tableList = []
      this.tagList = []
      this.initData([])
      this.sourceChange()
    },
    selectSource (value) {
      if (!this.tagList.includes(value)) {
        this.tagList.push(value)
        this.getList()
      }
    },
    deleteTag (index) {
      this.tagList.splice(index, 1)
      this.getList()
    },
    hasTag (item) {
      return this.tagList.includes(item) || this.tagList.includes(item)
    },
    getList () {
      this.$axios.post('get_table', {
        species: this.speciesValue,
        context: this.contextResult,
        cell_type: this.tagList.join(','),
        current: 1,
        size: 10
      }).then((res) => {
        if (res.msg === 'ok') {
          this.tableList = res.data.list
          this.initData(res.data.list)
        }
      })
    },
    reset () {
      this.contextValue = ''
      this.contextList = []
      this.contextResult = ''
      this.sourceValue = ''
      this.sourceList = []
      this.sourceResult = ''
      this.targetValue = ''
      this.tableList = []
      this.tagList = []
      this.initData([])
    },
    initData (list) {
      const arr = []
      list.forEach(item => {
        item.source = item.source_cell_type
        item.target = item.target_cell_type
        arr.push(item.source_cell_type)
        arr.push(item.target_cell_type)
      })
      const newArr = [...new Set(arr)]
      const data = []
      newArr.forEach(item => {
        data.push({
          name: item
        })
      })
      this.initLinks(list, data)
      // console.log(links)
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
            count += 1
          }
        })
        links.push({
          source: item.source,
          target: item.target,
          symbol: [(item.reciprocalDirection === 1 || item.source === item.target) ? 'arrow' : 'none', 'arrow'],
          ignoreForceLayout: true,
          lineStyle: {
            width: 2,
            curveness: count * 0.1,
            // color: 'source',
            type: item.clear_direction ? 'solid' : 'dashed'
          }
        })
      })
      this.init1(data, links)
      // console.log(links)
    },
    init1 (data, links) {
      const chart = this.$refs.chart1
      const cakeChart = echarts.init(chart)
      const option = {
        title: {
          text: 'Diagram'
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            type: 'graph',
            layout: 'circular',
            symbolSize: 50,
            roam: true,
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
            links
          }
        ]
      }

      option && cakeChart.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
// ::-webkit-scrollbar{width: 0px;height: 0px;}
.wrap-statistics{
  background: #FFF;
}
.content{
  padding-bottom: 50px
}

.form{
  margin: 0 auto;
}

.label{
  font-size: 1.25rem; /* 20px -> 1.25rem */
  font-weight: 500;
  margin-bottom: 10px;
}

.table-wrap{
  margin: 20px 0;
}

.flex{
  display: flex;
  width: 100%;
}

.icon-cell-type{
  margin-right: 10px;
}
</style>
<style lang="scss" scoped>
.content{
  padding: 20px;
  padding-top: 100px;
  background: #FFFFFF;
  height: 100vh;
  overflow-y: auto;
}

.table-wrap{
  margin: 20px 0;
}

.label{
    font-size: 1.25rem; /* 20px -> 1.25rem */
    font-weight: 500;
    margin-bottom: 10px;
  }

.flex{
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.result{
  font-size: 1rem; /* 16px -> 1rem */
  // color: #409EFF;
  margin: 10px 0;
  display: flex;
  align-items: center;
  overflow-y: auto;
  height: 50px;
}

.select{
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}
.select-list{
  border: 1px solid #DDD;
  padding: 10px;
  overflow: hidden;
  width: 30%;
  &.right{
    flex: 1;
    margin-left: 10px
  }
}
.result-list{
  height: 300px;
  overflow-y: auto;
  padding: 10px;
  .res-item{
    line-height: 25px;
    font-size: 1rem; /* 16px -> 1rem */
    width: 100%;
    cursor: pointer;
    &.active{
      color: #409EFF;
    }
    &.disabled{
      color: #bcbec2;
      cursor: not-allowed;
    }
  }
}

.tag{
  border: 1px solid #ddd;
  padding: 5px 25px;
  border-radius: 6px;
  position: relative;
  margin-right: 10px;
  white-space: nowrap;
  .el-icon-circle-close{
    position: absolute;
    right: 5px;
    top: 5px;
    cursor: pointer;
  }
}
</style>
