<!--
 * @page: 页面-search
 * @Author: Dragon
 * @Date: 2021-03-16 10:19:31
 * @LastEditors: Dragon
 * @LastEditTime: 2021-06-23 21:49:04
-->
<template>
    <div class="search-context">
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
          <div>
            <el-button @click="demo" type="success">Demo</el-button>
            <el-button @click="reset" type="danger">Reset</el-button>
          </div>
        </div>
        <div class="check-box">
          <el-checkbox @change="getAllList" v-model="form.check1">Show cell type - cell type interactions in the class level</el-checkbox>
          <el-checkbox @change="getAllList" v-model="form.check2">Show cell type - cell type interactions involving cell types of interest</el-checkbox>
        </div>
        <div class="select">
          <div class="select-list right">
            <div class="flex">
              <div class="label">Cell type </div>
            </div>
            <el-input placeholder="Please input the content" v-model="keyword" @input="getTree"  clearable class="input-with-select">
            </el-input>
            <div class="result-list">
              <el-tree
                ref="tree"
                :data="treeList"
                show-checkbox
                node-key="id"
                empty-text="No Data"
                @check="handleCheckChange">
              </el-tree>
            </div>
          </div>
        </div>
      </div>
      <div v-show="chartList.length" class="tip">
        <div class="cricle"></div>self -> self
      </div>
      <div v-show="chartList.length" ref="chart1" style="height:700px;width:1130px;margin-top: 30px" />
      <div v-show="chartList.length === 0" class="empty">No Records</div>
      <div class="table-wrap">
        <div class="flex margin-b">
          <div class="label">Result</div>
          <el-button :disabled="chartList.length === 0" @click="download" type="primary">Download</el-button>
        </div>
        <el-table
          :data="tableList"
          border
          empty-text="No Data"
          style="width: 100%">
          <el-table-column
            width="130"
            align="center"
            prop="publication_year"
            label="Publication year">
          </el-table-column>
          <el-table-column
            width="90"
            align="center"
            prop="organism"
            label="Organism">
          </el-table-column>
          <!-- <el-table-column
            width="100"
            align="center"
            prop="mesh_id"
            label="Mesh Id">
            <template #default="scope">
              <el-link class="block" v-for="(item, index) in scope.row.mesh_id.split('|')" :key="item" @click="go(scope.row.url[index])" type="primary">{{item}}</el-link>
            </template>
          </el-table-column> -->
          <el-table-column
            width="200"
            align="center"
            prop="mesh_name"
            :show-overflow-tooltip="true"
            label="Mesh Term">
            <template #default="scope">
              <el-link class="block" v-for="(item, index) in scope.row.mesh_id.split('|')" :key="item" @click="go(scope.row.url[index])" type="primary">{{filterName(scope.row, index, item)}}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            width="180"
            align="center"
            prop="context"
            label="Context">
          </el-table-column>
          <el-table-column
            width="80"
            align="center"
            prop="phase"
            label="Phase">
          </el-table-column>
          <el-table-column
            width="80"
            align="center"
            prop="tissue"
            label="Tissue">
          </el-table-column>
          <el-table-column
            width="150"
            align="center"
            prop="function"
            :show-overflow-tooltip="true"
            label="Function">
          </el-table-column>
          <el-table-column
            width="180"
            align="center"
            prop="source_cell_type_class"
            label="Source Cell Type Class">
          </el-table-column>
          <el-table-column
            width="140"
            align="center"
            prop="source_cell_type"
            label="Source Cell type">
          </el-table-column>
          <el-table-column
            width="180"
            align="center"
            prop="target_cell_type_class"
            label="Target Cell Type Class">
          </el-table-column>
          <el-table-column
            width="130"
            align="center"
            prop="target_cell_type"
            label="Target Cell type">
          </el-table-column>
          <el-table-column
            width="130"
            align="center"
            prop="clear_direction"
            label="Clear Direction">
          </el-table-column>
          <el-table-column
            width="170"
            align="center"
            prop="reciprocal_direction"
            label="Reciprocal Direction">
          </el-table-column>
          <el-table-column
            width="100"
            align="center"
            prop="interaction"
            label="Interaction">
          </el-table-column>
          <el-table-column
            width="150"
            align="center"
            prop="method"
            label="Method">
          </el-table-column>
          <el-table-column
            width="160"
            align="center"
            prop="method_details"
            label="Method details">
          </el-table-column>
          <el-table-column
            width="100"
            align="center"
            prop="information"
            label="Information">
          </el-table-column>
          <el-table-column
            width="100"
            align="center"
            prop="full_pdf"
            label="Full PDF">
          </el-table-column>
          <el-table-column
            width="100"
            align="center"
            prop="pmid"
            label="PMID">
          </el-table-column>
          <el-table-column
          :show-overflow-tooltip="true"
            width="150"
            align="center"
            prop="title"
            label="Title">
          </el-table-column>
        </el-table>
        <el-pagination
        class="table_pagination"
          background
          :page-size="size"
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :total="total">
        </el-pagination>
      </div>
    </div>
</template>

<script>
import searchMixin from '@mixin/search'
export default {
  mixins: [searchMixin],
  data () {
    return {
      treeUrl: 'get_cell_type_tree',
      chartUrl: 'get_data_img_by_cell_type',
      tableUrl: 'get_data_page_by_cell_type',
      demoValue: ['B cell', 'endothelial cell', 'fibroblast', 'macrophage', 'natural killer cell', 'and T cell'], // demo的默认数据
      treeKey: ['B cell', 'endothelial cell', 'fibroblast', 'macrophage', 'natural killer cell', 'and T cell'],
      form: {
        check1: false,
        check2: false
      }
    }
  },
  mounted () {
    this.getTree()
  },
  methods: {
    handleCheckChange (data, checked) {
      const arr = []
      checked.checkedNodes.forEach(item => {
        if (this.form.check1) {
          arr.push(item.label)
        } else {
          if (!item.isFather) {
            arr.push(item.label)
          }
        }
      })
      this.selectValue = arr.join(',')
      this.getAllList()
    }
  }
}
</script>
<style lang="scss" scoped>

.check-box{
  margin: 20px 0;
}

</style>
