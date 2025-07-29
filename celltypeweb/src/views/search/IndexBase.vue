<!--
 * @page: 页面-图表
 * @Author: Dragon
 * @Date: 2021-03-16 10:19:31
 * @LastEditors: Dragon
 * @LastEditTime: 2021-06-23 17:27:49
-->
<template>
  <div class="wrap-search">
    <NavBar current="search" />
    <div class="content">
      <el-tabs value="first">
        <el-tab-pane label="Context" name="first"><Context /></el-tab-pane>
        <el-tab-pane label="Cell Type" name="second"><CellType /> </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import NavBar from '@components/NavBar'
import Context from './Context.vue'
import CellType from './CellType.vue'
export default {
  components: {
    NavBar,
    CellType,
    Context
  }
}
</script>
<style lang="scss" scoped>
// ::-webkit-scrollbar{width: 0px;height: 0px;}
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

</style>

<style lang="scss">
.wrap-search{
  .flex{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .margin-b{
    margin-bottom: 20px;
  }

  .label{
    font-size: 1.25rem; /* 20px -> 1.25rem */
    font-weight: 500;
    margin-bottom: 10px;
  }

  .table_pagination {
    margin: 20px;
    margin-bottom: 40px;
    text-align: right;
  }

  .table-wrap{
    margin: 20px 0;
  }

  .block{
    display: block;
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

  .empty{
    height: 300px;
    text-align: center;
    font-size: 1.875rem; /* 30px -> 1.875rem */
    padding-top: 50px;
  }

  .select{
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    .select-list{
      border: 1px solid #DDD;
      padding: 10px;
      overflow: hidden;
      width: 100%;
      &.right{
        flex: 1;
        margin-left: 10px
      }
    }
  }

  .result-list{
    height: 300px;
    overflow-y: auto;
    padding: 10px;
  }
}

</style>
