
<template>
  <div class="wrap-search">
    <NavBar current="search" />
    <div class="content">
      <div class="tree-box">
        <div class="tree-box-item" style="margin-right:5px">
          <div class="tree-box-header">
            <h2>Context</h2>
            <el-checkbox @change="openOrCloseTree1" v-model="contextFold">fold tree</el-checkbox>
          </div>
          <!-- <el-input style="margin-top:20px" v-model="context_input" placeholder="please input the content" clearable @input="getContextTree"></el-input> -->
          <el-input style="margin-top:20px" v-model="context_input" placeholder="please input the content" clearable></el-input>
          <div class="tree">
            <el-tree
              ref="tree1"
              :data="treeList1"
              show-checkbox
              node-key="id"
              empty-text="No Data"
              :default-expand-all="true"
              :filter-node-method="filterTree1"
              @check="handleCheckChange1">
            </el-tree>
          </div>
        </div>
        <div class="tree-box-item" style="margin-left:5px">
          <div class="tree-box-header">
            <h2>Cell Type</h2>
            <el-checkbox v-model="cellTypeFold" @change="openOrCloseTree2">fold tree</el-checkbox>
          </div>
          <!-- <el-input style="margin-top:20px" v-model="cell_type_input" placeholder="please input the content" clearable @input="getCellTypeTree"></el-input> -->
          <el-input style="margin-top:20px" v-model="cell_type_input" placeholder="please input the content" clearable></el-input>
          <div class="tree">
            <el-tree
              ref="tree2"
              :data="treeList2"
              show-checkbox
              node-key="id"
              empty-text="No Data"
              :default-expand-all="true"
              :filter-node-method="filterTree2"
              @check="handleCheckChange2">
            </el-tree>
          </div>
        </div>
      </div>
      <div class="top">
        <div class="top-item-box">
          <!-- <div class="top-item">
            <h2>Species</h2>
            <el-select v-model="speciesValue">
              <el-option
                v-for="item in species"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div> -->
          <div class="top-item">
            <h2>Method</h2>
            <el-select
              v-model="methodValue"
              @change="getAllList"
              placeholder="please select"
              multiple
              filterable
              allow-create
              default-first-option>
              <el-option
                v-for="item in method"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <!-- <el-select v-model="methodValue" @change="getAllList">
              <el-option
                v-for="item in method"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
          </div>
          <!-- <div class="top-item">
            <h2>Interaction details</h2>
            <el-input style="width:300px" v-model="other" placeholder="please input the interaction details" clearable></el-input>
          </div> -->
        </div>
        <div class="top-item-box">
          <el-button @click="demo1Click" type="success">Demo1</el-button>
          <el-button @click="demo2Click" type="success">Demo2</el-button>
          <el-button @click="resetClick" type="danger">Reset</el-button>
          <!-- <el-button @click="getAllList" type="primary">Search</el-button> -->
        </div>
      </div>
      <div class="top-check">
        <el-checkbox @change="getAllList" v-model="form.check1">Show cell-cell interactions at the class level</el-checkbox>
        <el-checkbox @change="getAllList" v-model="form.check2">Show cell-cell interactions involving cell types of interest</el-checkbox>
      </div>

      <Chart
        :check="form.check1"
        ref="chart"
       :chartList="chartList"
      />
      <Table
      id="table"
        :total="total"
        :size="size"
        :tableList="tableList.slice((current-1) * size,current * size)"
        :chartList="chartList"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      />
    </div>
    <Footer/>
  </div>
</template>

<script>
import NavBar from '@components/NavBar'
import Footer from '@components/Footer'
import Table from './Table.vue'
import Chart from './Chart.vue'
export default {
  components: {
    NavBar,
    Table,
    Chart,
    Footer
  },
  data () {
    return {
      contextFold: false, // 默认全部展开
      cellTypeFold: false, // 默认全部展开
      // 两个选择框
      form: {
        check1: false,
        check2: false
      },
      species: [{
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
      }],
      speciesValue: 'human',
      methodValue: '',
      other: '',
      context_input: '',
      cell_type_input: '',
      treeList1: [],
      treeList2: [],
      contextVal: '',
      cellTypeVal: '',
      chartList: [],
      tableList: [],
      current: 1, // 分页-页数
      size: 10, // 分页-每页数量
      total: 0 // 分页-总数
    }
  },
  created () {
    this.getContextTree()
    this.getCellTypeTree()
  },
  beforeUnmount() {
    // 清理组件状态
    this.chartList = []
    this.tableList = []
  },
  watch: {
    context_input (val) {
      this.$refs.tree1.filter(val)
    },
    cell_type_input (val) {
      this.$refs.tree2.filter(val)
    }
  },
  methods: {
    // 过滤树1
    filterTree1 (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 过滤树2
    filterTree2 (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 展开或关闭节点
    openOrCloseTree1 () {
      if (this.$refs.tree1 && this.$refs.tree1.store && this.$refs.tree1.store.nodesMap) {
        var nodes = this.$refs.tree1.store.nodesMap
        for (var i in nodes) {
          nodes[i].expanded = !this.contextFold
        }
      }
    },
    openOrCloseTree2 () {
      if (this.$refs.tree2 && this.$refs.tree2.store && this.$refs.tree2.store.nodesMap) {
        var nodes = this.$refs.tree2.store.nodesMap
        for (var i in nodes) {
          nodes[i].expanded = !this.cellTypeFold
        }
      }
    },
    getContextTree () {
      this.$axios.post('get_tree', {
        word: this.context_input
      }).then((res) => {
        if (res.msg === 'ok') {
          this.treeList1 = res.data
          if (this.$refs.tree1) {
            this.$refs.tree1.setCheckedKeys([])
          }
        }
      }).catch(err => {
        console.log('获取Context树失败:', err)
      })
    },
    getCellTypeTree () {
      this.$axios.post('get_cell_type_tree', {
        word: this.cell_type_input
      }).then((res) => {
        if (res.msg === 'ok') {
          this.treeList2 = res.data
          if (this.$refs.tree2) {
            this.$refs.tree2.setCheckedKeys([])
          }
        }
      }).catch(err => {
        console.log('获取Cell Type树失败:', err)
      })
    },
    handleCheckChange1 (data, checked) {
      const arr = []
      checked.checkedNodes.forEach(item => {
        if (!item.isFather) {
          arr.push(item.label)
        }
      })
      this.contextVal = arr.join(',')
      this.getAllList()
    },
    handleCheckChange2 (data, checked) {
      const arr = []
      checked.checkedNodes.forEach(item => {
        if (!item.isFather) {
          arr.push(item.label)
        }
      })
      this.cellTypeVal = arr.join(',')
      this.getAllList()
    },
    getAllList () {
      // 添加加载状态
      this.$loading({
        lock: true,
        text: '正在加载数据...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      
      Promise.all([
        this.getImgList(),
        this.getTableList()
      ]).finally(() => {
        this.$loading().close()
        // 网页滚动
        this.$nextTick(() => {
          setTimeout(() => {
            window.scrollTo(0, 600)
          }, 500)
        })
      })
    },
    getImgList () {
      return this.$axios.post('get_data_img', {
        species: this.speciesValue,
        method: this.methodValue,
        context: this.contextVal,
        cell_type: this.cellTypeVal,
        check1: this.form.check1,
        check2: this.form.check2
      }).then((res) => {
        if (res.msg === 'ok') {
          this.chartList = res.data
          if (this.chartList.length > 0) {
            this.$nextTick(() => {
              if (this.$refs.chart) {
                this.$refs.chart.initData(res.data)
              }
            })
          }
        }
      }).catch(err => {
        console.log('获取图表数据失败:', err)
        this.$message.error('获取图表数据失败')
      })
    },
    getTableList () {
      return this.$axios.post('get_data_table', {
        species: this.speciesValue,
        method: this.methodValue,
        context: this.contextVal,
        cell_type: this.cellTypeVal,
        check1: this.form.check1,
        check2: this.form.check2,
        current: this.current,
        size: this.size
      }).then((res) => {
        if (res.msg === 'ok') {
          this.tableList = res.data.list
          this.total = res.data.totalCount
        }
      }).catch(err => {
        console.log('获取表格数据失败:', err)
        this.$message.error('获取表格数据失败')
      })
    },
    // 点击每页多少条
    handleSizeChange (val) {
      this.size = val
      // this.getTableList()
    },
    // 点击页数
    handleCurrentChange (val) {
      this.current = val
      // this.getTableList()
    },
    demo1Click () {
      this.contextVal = ['immune response'].join(',')
      if (this.$refs.tree1) {
        this.$refs.tree1.setCheckedKeys(['CH311'])
      }
      this.cellTypeVal = ''
      if (this.$refs.tree2) {
        this.$refs.tree2.setCheckedKeys([])
      }
      this.getAllList()
    },
    demo2Click () {
      if (this.$refs.tree2) {
        this.$refs.tree2.setCheckedKeys(['B cell', 'endothelial cell', 'fibroblast', 'macrophage', 'natural killer cell', 'T cell'])
        const tree2 = this.$refs.tree2.getCheckedNodes()
        const arr = []
        tree2.forEach(item => {
          if (!item.isFather) {
            arr.push(item.label)
          }
        })
        this.cellTypeVal = arr.join(',')
      }
      this.contextVal = ''
      if (this.$refs.tree1) {
        this.$refs.tree1.setCheckedKeys([])
      }
      this.form.check1 = true
      this.getAllList()
    },
    resetClick () {
      this.methodValue = ''
      this.other = ''
      this.form.check1 = false
      this.form.check2 = false
      this.context_input = ''
      this.cell_type_input = ''
      this.chartList = []
      this.tableList = []
      if (this.$refs.chart) {
        this.$refs.chart.initData([])
      }
      this.getContextTree()
      this.getCellTypeTree()
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap-search{
  background: #FFF;
  overflow: hidden;
}
.content{
  padding: 20px;
  padding-top: 100px;
  background: #FFFFFF;
  height: 100%;
  overflow-y: auto;
}
.top{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
}
.top-item-box{
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  .top-item{
    display: flex;
    flex-direction: column;
    margin-right: 15px;
    h2{
      margin-bottom: 10px;
    }
  }
}
.top-check{
  padding: 30px 0;
}
.tree-box{
  display: flex;
  flex-direction: row;
  .tree-box-item{
    flex: 1;
    border: 1px solid #ddd;
    padding: 10px;
    display: flex;
    flex-direction: column;
    .tree{
      height: 250px;
      overflow-y: auto;
      margin-top: 20px;
    }
    .tree-box-header{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }
}

</style>
