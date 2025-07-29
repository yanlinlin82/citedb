<!--
 * @page: 页面-团队
 * @Author: Dragon
 * @Date: 2021-03-16 10:19:31
 * @LastEditors: zhangyu
 * @LastEditTime: 2021-07-06 14:08:01
-->
<template>
  <div class="wrap-team">
    <NavBar current="team" />
    <div class="content">
      <div class="title">If you have any questions or concerns about CITEdb, contact us！</div>
      <div class="title" style="margin-top: 20px">Corresponding Author</div>
      <el-table
        :data="list2"
        border
        stripe
        :header-cell-style="{background:'#EFF0FF', color: '#161616'}"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="Name"
          width="210">
        </el-table-column>
        <el-table-column label="Contribution">
          <template #default="scope">
            <div class="email"><el-icon class="icon"><Message /></el-icon>{{ scope.row.contribution}}</div>
          </template>
        </el-table-column>
        <el-table-column label="Contact">
          <template #default="scope">
            <div class="email"><el-icon class="icon"><Message /></el-icon>{{ scope.row.contact}}</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="title" style="margin-top: 20px">Contributor Lists</div>
      <el-table
        :data="list"
        border
        stripe
        :header-cell-style="{background:'#EFF0FF', color: '#161616'}"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="Name"
          width="210">
        </el-table-column>
        <el-table-column label="Contribution">
          <template #default="scope">
            <div class="email"><el-icon class="icon"><Message /></el-icon>{{ scope.row.contribution}}</div>
          </template>
        </el-table-column>
        <el-table-column label="Contact">
          <template #default="scope">
            <div class="email"><el-icon class="icon"><Message /></el-icon>{{ scope.row.contact}}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Footer/>
  </div>
</template>

<script>
import NavBar from '@components/NavBar'
import Footer from '@components/Footer'
export default {
  components: {
    NavBar,
    Footer
  },
  data () {
    return {
      list: [{
        name: 'Nayang Shan',
        contribution: 'Data collection',
        contact: 'shanny01@foxmail.com',
        type: 'data'
      }, {
        name: 'Dongyu Li',
        contribution: 'Data collection',
        contact: 'lidongyu16@mails.tsinghua.edu.cn',
        type: 'data'
      }, {
        name: 'Yao Lu',
        contribution: 'Data collection',
        contact: 'luytsinghua@126.com',
        type: 'data'
      }, {
        name: 'Linlin Yan',
        contribution: 'Data collection',
        contact: 'yanlinlin82@gmail.com',
        type: 'data'
      }, {
        name: 'Hailong Shen',
        contribution: 'Website developer',
        contact: 'hailong.shen@simceredx.com',
        type: 'developer'
      }, {
        name: 'Jiudong Gao',
        contribution: 'Website developer',
        contact: 'jiudong.gao@simceredx.com',
        type: 'developer'
      }, {
        name: 'Yu Zhang',
        contribution: 'Website developer',
        contact: 'yu.zhang@simceredx.com',
        type: 'developer'
      }],
      list2: [{
        name: 'Lin Hou',
        contribution: 'Data collection',
        contact: 'houl@tsinghua.edu.cn',
        type: 'data'
      }, {
        name: 'Hao Guo',
        contribution: 'Website developer',
        contact: 'hao.guo@simceredx.com',
        type: 'developer'
      }]
    }
  },
  mounted () {

  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.content{
  padding: 20px;
  padding-top: 100px;
  background: #FFFFFF;
  height: 100vh;
}
.title{
  font-size: 30px;
  margin-bottom: 20px;
}
.email{
  display: flex;
  align-items: center;
  .icon{
    margin-right: 10px;
    color: #409EFF;
    font-size: 18px;
  }
  .el-icon-coin{
    color: #323AC3;
  }
}
</style>
