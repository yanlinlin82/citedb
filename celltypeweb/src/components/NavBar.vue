<!--
 * @page: 页面-导航栏
 * @Author: Dragon
 * @Date: 2021-03-16 10:21:14
 * @LastEditors: zhangyu
 * @LastEditTime: 2021-06-29 18:46:30
-->
<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
    <div class="container">
      <!-- Logo -->
      <a class="navbar-brand d-flex align-items-center" href="#" @click="goIndex">
        <img src="../assets/logo.svg" alt="CITEdb Logo" height="40" class="me-2">
        <div class="brand-text">
          <span class="fw-bold text-primary fs-4">CITEdb</span>
          <div class="full-name text-muted small">Cell-cell InTEraction DataBase</div>
        </div>
      </a>

      <!-- 移动端折叠按钮 -->
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav" 
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- 导航菜单 -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li 
            v-for="(item, index) in list" 
            :key="index" 
            class="nav-item"
            :class="{ 'dropdown': item.children }"
          >
            <!-- 有子菜单的项目 -->
            <a 
              v-if="item.children"
              class="nav-link dropdown-toggle nav-link-custom" 
              href="#" 
              role="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
              :class="{ 'active': current === item.value }"
            >
              <i :class="item.icon" class="me-1"></i>
              {{ item.name }}
            </a>
            <ul v-if="item.children" class="dropdown-menu">
              <li v-for="(child, childIndex) in item.children" :key="childIndex">
                <a 
                  class="dropdown-item" 
                  href="#"
                  @click="childChangePage(child)"
                  :class="{ 'active': current === child.value && child.query && ($route.query.type === child.query.type) }"
                >
                  <i :class="child.icon" class="me-2"></i>
                  {{ child.name }}
                </a>
              </li>
            </ul>

            <!-- 普通菜单项 -->
            <a 
              v-else
              class="nav-link nav-link-custom" 
              href="#"
              @click="changePage(item)"
              :class="{ 'active': current === item.value }"
            >
              <i :class="item.icon" class="me-1"></i>
              {{ item.name }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    current: {
      type: String,
      default: 'index'
    }
  },
  data () {
    return {
      list: [
        {
          url: '/',
          name: 'Home',
          value: 'index',
          icon: 'fas fa-home'
        },
        {
          url: '/search',
          name: 'Search',
          value: 'search',
          icon: 'fas fa-search'
        },
        {
          url: '/statistics',
          name: 'Statistics',
          value: 'statistics',
          icon: 'fas fa-chart-bar'
        },
        {
          url: '/download',
          name: 'Download',
          value: 'download',
          icon: 'fas fa-download'
        },
        {
          url: '/team',
          name: 'Team',
          value: 'team',
          icon: 'fas fa-users'
        },
        {
          url: '/help',
          name: 'Help',
          value: 'help',
          icon: 'fas fa-question-circle'
        }
      ]
    }
  },
  mounted () {},
  methods: {
    childChangePage (item) {
      if ((this.$route.path === item.url && item.query && this.$route.query.type === item.query.type) || item.children) {
        return
      }
      this.$router.push({
        path: item.url,
        query: {
          ...item.query
        }
      }).catch(err => {
        console.log('导航错误:', err)
      })
    },
    changePage (item) {
      if ((this.$route.path === item.url) || item.children) {
        return
      }
      this.$router.push({
        path: item.url
      }).catch(err => {
        console.log('导航错误:', err)
      })
    },
    goIndex () {
      if (this.$route.path === '/' || this.$route.path === '/index') {
        return
      }
      this.$router.push({
        path: '/'
      }).catch(err => {
        console.log('导航错误:', err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  box-shadow: $shadow-base;
  
  .navbar-brand {
    font-size: 2rem;
    font-weight: 700;
    transition: $transition-base;
    
    &:hover {
      transform: scale(1.05);
    }
    
    .brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
      
      .full-name {
        font-size: 0.6rem; /* 从0.4rem增大到0.6rem，提高可读性 */
        font-weight: 400;
        margin-top: -2px;
        opacity: 0.8;
      }
    }
  }
  
  /* 自定义导航链接样式 */
  .nav-link-custom {
    font-size: 1.35rem; /* 从0.9rem增大50% */
    font-weight: 500;
    padding: 0.75rem 1rem !important;
    transition: $transition-base;
    border-radius: 0.375rem;
    margin: 0 0.25rem;
    
    &:hover {
      background-color: rgba(0, 123, 255, 0.1);
      color: $primary !important;
    }
    
    &.active {
      background-color: $primary;
      color: white !important;
      
      &:hover {
        background-color: $primary-dark;
      }
    }
  }
  
  .dropdown-menu {
    border: none;
    box-shadow: $box-shadow-lg;
    border-radius: $border-radius-lg;
    
    .dropdown-item {
      padding: 0.75rem 1.5rem;
      transition: $transition-base;
      
      &:hover {
        background-color: $primary-light;
        color: $primary;
      }
      
      &.active {
        background-color: $primary;
        color: white;
      }
    }
  }
}

// 响应式调整
@media (max-width: 991.98px) {
  .navbar {
    .navbar-brand {
      font-size: 1.5rem;
      
      .brand-text .full-name {
        font-size: 0.5rem; /* 从0.35rem增大到0.5rem */
      }
    }
    .nav-link-custom {
      font-size: 1.2rem; /* 从0.8rem增大50% */
    }
  }
}

@media (max-width: 768px) {
  .navbar {
    .navbar-brand {
      font-size: 1.2rem;
      
      .brand-text .full-name {
        font-size: 0.45rem; /* 从0.3rem增大到0.45rem */
      }
    }
    .nav-link-custom {
      font-size: 1.05rem; /* 从0.7rem增大50% */
    }
  }
}
</style>
