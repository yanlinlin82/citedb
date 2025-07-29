<!--
 * @Author: zhangyu
 * @Date: 2021-06-29 21:07:12
 * @LastEditTime: 2022-04-06 14:07:21
-->
<template>
  <div class="wrap-team">
    <NavBar current="help" />
    <div class="content">
      <div class="help-content">
        <h1>Help & Documentation</h1>
        <div class="section">
          <h2>About CITEdb</h2>
          <p>CITEdb (Cell-cell InTEraction database) is a manually curated database of cell-cell interactions at cell type level, which was derived from 509 published papers in PubMed before January 17, 2022 by 3 reviewers. 728 pairs of cell-cell interactions in human were collected and deposited in current version.</p>
        </div>
        
        <div class="section">
          <h2>How to Use</h2>
          <h3>Search Functionality</h3>
          <ul>
            <li><strong>Context Search:</strong> Use the left tree to search for interactions in specific biological contexts</li>
            <li><strong>Cell Type Search:</strong> Use the right tree to search for interactions involving specific cell types</li>
            <li><strong>Method Filter:</strong> Filter results by experimental or computational methods</li>
            <li><strong>Demo Buttons:</strong> Try the Demo1 and Demo2 buttons for quick examples</li>
          </ul>
          
          <h3>Download Data</h3>
          <p>You can download the complete CITEdb dataset in Excel format from the Download page.</p>
          
          <h3>Statistics</h3>
          <p>View comprehensive statistics and visualizations of the database on the Statistics page.</p>
        </div>
        
        <div class="section">
          <h2>Contact</h2>
          <p>For questions or suggestions, please contact our team through the Team page.</p>
        </div>
      </div>
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
      // 移除有问题的组件相关数据
    }
  },
  mounted () {
    console.log('Help page loaded successfully')
  },
  methods: {
    // 移除有问题的组件方法
  }
}
</script>
<style lang="scss" scoped>
.content{
  padding: 20px;
  padding-top: 100px;
  background: #FFFFFF;
  min-height: 80vh;
}

.help-content {
  max-width: 800px;
  margin: 0 auto;
  
  h1 {
    color: #333;
    margin-bottom: 30px;
    text-align: center;
  }
  
  .section {
    margin-bottom: 40px;
    
    h2 {
      color: #2c3e50;
      border-bottom: 2px solid #3498db;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    
    h3 {
      color: #34495e;
      margin-top: 25px;
      margin-bottom: 15px;
    }
    
    p {
      line-height: 1.6;
      color: #555;
      margin-bottom: 15px;
    }
    
    ul {
      margin-left: 20px;
      
      li {
        line-height: 1.6;
        color: #555;
        margin-bottom: 8px;
      }
    }
  }
}
</style>
