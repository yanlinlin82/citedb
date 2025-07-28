/*
 * @page: mixin-列表的各种操作方法
 * @Author: Dragon
 * @Date: 2021-04-01 10:15:56
 * @LastEditors: zhangyu
 * @LastEditTime: 2021-06-24 13:40:30
 */
import * as echarts from 'echarts'

// eslint-disable-next-line camelcase
import { export_json_to_excel } from '@/utils/Export2Excel'

export default {
  data () {
    return {
      options: [{
        value: 'human',
        label: 'human'
      }, {
        value: 'mouse',
        label: 'mouse'
      }],
      method: [{
        value: 'computational',
        label: 'computational'
      }, {
        value: 'experimental',
        label: 'experimental'
      }, {
        value: 'literature supported',
        label: 'literature supported'
      }],
      speciesValue: 'human',
      methodValue: '',
      other: '',
      current: 1, // 分页-页数
      size: 10, // 分页-每页数量
      total: 0, // 分页-总数
      tableList: [], // table 数据
      treeList: [], // tree数据
      keyword: '', // 搜索内容
      chartList: [], // 图表数据
      selectValue: '' // 选择的结果
    }
  },
  methods: {
    // 点击每页多少条
    handleSizeChange (val) {
      this.size = val
      this.current = 1
      this.getTableList()
    },
    // 点击页数
    handleCurrentChange (val) {
      this.current = val
      this.getTableList()
    },
    // table参数mesh_name调整
    go (url) {
      window.open(url)
    },
    filterName (row, index, item) {
      const name = `${row.mesh_name.split('|')[index]} (${item})`
      return name
    },
    speciesChange (value) {
      this.keyword = ''
      this.selectValue = ''
      this.treeList = []
      this.chartList = []
      this.tableList = []
      this.initData([])
      this.getTree()
    },
    demo () {
      this.selectValue = this.demoValue.join(',')
      this.$refs.tree.setCheckedKeys(this.treeKey)
      this.getAllList()
    },
    download () {
      // 列表标题
      const tHeader = [
        'Publication year',
        'Organism',
        'Mesh Id',
        'Mesh Name',
        'Context',
        'Phase',
        'Tissue',
        'Function',
        'Source Cell Type Class',
        'Source Cell type',
        'Target Cell type',
        'Target Cell Type Class',
        'Clear Direction',
        'Reciprocal Direction',
        'Interaction',
        'Method',
        'Method details',
        'Information',
        'Full PDF',
        'PMID',
        'Title'
      ]
      // 标题对应的对象属性
      const filterVal = [
        'publication_year',
        'organism',
        'mesh_id',
        'mesh_name',
        'context',
        'phase',
        'tissue',
        'function',
        'source_cell_type_lass',
        'source_cell_type',
        'target_cell_type',
        'target_cell_type_class',
        'clear_direction',
        'reciprocal_direction',
        'interaction',
        'method',
        'method_details',
        'information',
        'full_pdf',
        'pmid',
        'title'
      ]
      // 数据整理
      const data = this.chartList.map(v => filterVal.map(j => v[j]))
      // 导出
      export_json_to_excel(tHeader, data, 'Result')
    },
    reset () {
      this.keyword = ''
      this.selectValue = ''
      this.tableList = []
      this.chartList = []
      if (this.form) {
        this.form = {
          check1: false,
          check2: false
        }
      }
      this.initData([])
      this.getTree()
    },
    getAllList () {
      this.getList()
      this.getTableList()
    },
    getTree (value = '') {
      this.$axios.post(this.treeUrl, {
        species: this.speciesValue,
        word: value
      }).then((res) => {
        if (res.msg === 'ok') {
          this.treeList = res.data
          this.$refs.tree.setCheckedKeys([])
        }
      })
    },
    getList () {
      this.$axios.post(this.chartUrl, {
        species: this.speciesValue,
        word: this.selectValue,
        ...this.form
      }).then((res) => {
        if (res.msg === 'ok') {
          this.chartList = res.data
          this.$nextTick(() => {
            this.initData(res.data)
          })
        }
      })
    },
    getTableList () {
      this.$axios.post(this.tableUrl, {
        species: this.speciesValue,
        word: this.selectValue,
        current: this.current,
        size: this.size,
        ...this.form
      }).then((res) => {
        if (res.msg === 'ok') {
          this.tableList = res.data.list
          this.total = res.data.totalCount
        }
      })
    },
    initData (list) {
      const arr = []
      const lineArr = []
      const colorArr = []
      list.forEach(item => {
        item.source = item.source_cell_type_class
        item.target = item.target_cell_type_class
        arr.push(item.source_cell_type_class)
        arr.push(item.target_cell_type_class)
        if (item.source_cell_type_class === item.target_cell_type_class) {
          colorArr.push(item.source_cell_type_class)
        }
        item.lineId = `${item.source_cell_type_class}${item.target_cell_type_class}${item.clear_direction}${item.reciprocal_direction}`
        lineArr.push(`${item.source_cell_type_class}${item.target_cell_type_class}${item.clear_direction}${item.reciprocal_direction}`)
      })
      console.log(list)
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
      console.log(newObj)
      list.forEach(item => {
        if (!countList.includes(item.lineId)) {
          item.count = newObj[item.lineId]
          countList.push(item.lineId)
          newList.push(item)
        }
      })
      console.log(newList)
      const newArr = [...new Set(arr)]
      const data = []
      newArr.forEach(item => {
        data.push({
          name: item,
          color: colorArr.includes(item) ? '#ff001c' : '#3866b9'
        })
      })
      this.initLinks(newList, data)
    },
    initLinks (list, data) {
      const links = []
      console.log(list)
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
          }
        })
      })
      this.init1(data, links)
    },
    init1 (data, links) {
      const chart = this.$refs.chart1
      const cakeChart = echarts.init(chart)
      const option = {
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              show: true,
              excludeComponents: ['toolbox'],
              pixelRatio: 1
            }
          }
        },
        series: [
          {
            type: 'graph',
            layout: 'force', // circular force
            force: {
              // repulsion: 20,
              edgeLength: 150,
              repulsion: 50,
              gravity: 0.01
            },
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
            links,
            itemStyle: {
              color: params => {
                return params.data.color
              }
            }
          }
        ]
      }

      option && cakeChart.setOption(option)
    }
  }

}
