<!--
 * @page: 基础布局组件
 * @Author: Dragon
 * @Date: 2024-01-01
 * @Description: 统一所有页面的基础布局
-->
<template>
  <div class="base-layout">
    <NavBar :current="current" />
    
    <main class="main-content">
      <div class="container py-4">
        <slot></slot>
      </div>
    </main>
    
    <Footer/>
  </div>
</template>

<script>
import NavBar from './NavBar.vue'
import Footer from './Footer.vue'

export default {
  name: 'BaseLayout',
  components: {
    NavBar,
    Footer
  },
  props: {
    current: {
      type: String,
      default: 'index'
    }
  }
}
</script>

<style lang="scss" scoped>
.base-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 76px; // 为固定导航栏留出空间
  background-color: $bg-primary;
}
</style>