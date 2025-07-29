<!--
 * @page: 页面-主应用
 * @Author: Dragon
 * @Date: 2021-03-16 09:19:57
 * @LastEditors: Dragon
 * @LastEditTime: 2021-03-16 10:16:54
-->
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
/* 全局样式 */
* {
  box-sizing: border-box;
}

html {
  font-size: 20px; /* 设置根字体大小为20px，便于rem计算 */
}

body {
  font-size: 1rem; /* 基础字体大小，相对于html的20px */
  line-height: 1.6;
  color: $text-primary;
  background-color: $bg-primary;
  margin: 0;
  padding: 0;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  font-size: 1rem; /* 继承body的字体大小 */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 链接样式 - 复用Bootstrap，只调整颜色 */
a {
  color: $primary;
  text-decoration: none;
  transition: $transition-base;
  
  &:hover {
    color: darken($primary, 10%);
    text-decoration: underline;
  }
}

/* 按钮样式 - 复用Bootstrap，只调整字体大小 */
.btn {
  font-size: 1.1rem;
  font-weight: 500;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: $shadow-hover;
  }
}

/* 卡片样式 - 复用Bootstrap，只调整字体大小 */
.card {
  box-shadow: $shadow-base;
  transition: $transition-base;
  
  &:hover {
    box-shadow: $shadow-hover;
  }
  
  .card-title {
    font-size: 1.4rem;
    font-weight: 600;
  }
  
  .card-text {
    font-size: 1.1rem;
  }
}

/* 表单样式 - 复用Bootstrap，只调整字体大小 */
.form-control {
  font-size: 1.1rem;
  
  &:focus {
    border-color: $primary;
    box-shadow: 0 0 0 0.2rem rgba($primary, 0.25);
  }
}

.form-label {
  font-size: 1.1rem;
  font-weight: 500;
}

/* 表格样式 - 复用Bootstrap，只调整字体大小 */
.table {
  font-size: 1.1rem;
  
  th {
    font-size: 1.2rem;
    font-weight: 600;
  }
  
  td {
    font-size: 1.1rem;
  }
}

/* 分页样式 - 复用Bootstrap，只调整字体大小 */
.pagination {
  font-size: 1.1rem;
  
  .page-link {
    &:hover {
      background-color: $primary;
      color: white;
    }
  }
}

/* 模态框样式 - 复用Bootstrap，只调整字体大小 */
.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
}

.modal-body {
  font-size: 1.1rem;
}

/* 警告框样式 - 复用Bootstrap，只调整字体大小 */
.alert {
  font-size: 1.1rem;
}

/* 导航栏样式 - 复用Bootstrap，只调整字体大小 */
.navbar-brand {
  font-size: 1.6rem;
  font-weight: 700;
}

.nav-link {
  font-size: 1.2rem;
  font-weight: 500;
  
  &:hover {
    color: $primary !important;
  }
  
  &.active {
    color: $primary !important;
    font-weight: 600;
  }
}

/* 页脚样式 - 复用Bootstrap，只调整字体大小 */
.footer {
  font-size: 1.1rem;
  background-color: $dark;
  color: $light;
  
  h6 {
    font-size: 1.3rem;
    font-weight: 600;
  }
  
  small {
    font-size: 0.95rem;
  }
}

/* 标题样式 - 复用Bootstrap，只调整字体大小 */
h1 {
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 1.2;
}

h2 {
  font-size: 2.4rem;
  font-weight: 600;
  line-height: 1.3;
}

h3 {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.4;
}

h4 {
  font-size: 1.7rem;
  font-weight: 600;
  line-height: 1.4;
}

h5 {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
}

h6 {
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1.4;
}

/* 段落样式 - 复用Bootstrap，只调整字体大小 */
p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.lead {
  font-size: 1.3rem;
  font-weight: 400;
  line-height: 1.6;
}

/* 徽章样式 - 复用Bootstrap，只调整字体大小 */
.badge {
  font-size: 0.9rem;
}

/* 响应式字体大小调整 */
@media (max-width: 768px) {
  html {
    font-size: 18px;
  }
  
  body, #app {
    font-size: 1rem;
  }
  
  h1 { font-size: 2.4rem; }
  h2 { font-size: 2rem; }
  h3 { font-size: 1.7rem; }
  .lead { font-size: 1.2rem; }
}

@media (max-width: 576px) {
  html {
    font-size: 16px;
  }
  
  body, #app {
    font-size: 1rem;
  }
  
  h1 { font-size: 2.2rem; }
  h2 { font-size: 1.8rem; }
  h3 { font-size: 1.5rem; }
  .lead { font-size: 1.1rem; }
}
</style>
