<!--
 * @page: 页面-首页
 * @Author: Dragon
 * @Date: 2021-03-16 10:19:31
 * @LastEditors: Dragon
 * @LastEditTime: 2022-04-06 08:58:17
-->
<template>
  <div class="index-page">
    <NavBar current="index" />
    
    <!-- 主要内容区域 -->
    <main class="main-content">
      <!-- Hero Section -->
      <section class="hero-section py-5">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-8 mx-auto text-center">
              <h1 class="display-4 fw-bold text-primary mb-4">
                <i class="fas fa-dna me-3"></i>
                Welcome to CITEdb!
              </h1>
              <p class="lead text-secondary mb-5">
                Cell-cell InTEraction database - A comprehensive resource for cell-cell interactions at cell type level
              </p>
              <div class="hero-stats row g-4 mb-5">
                <div class="col-md-4">
                  <div class="stat-card text-center p-3">
                    <i class="fas fa-microscope fa-2x text-primary mb-2 icon-large-hero"></i>
                    <h3 class="fw-bold text-primary">509</h3>
                    <p class="text-muted mb-0">Published Papers</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="stat-card text-center p-3">
                    <i class="fas fa-handshake fa-2x text-success mb-2 icon-large-hero"></i>
                    <h3 class="fw-bold text-success">728</h3>
                    <p class="text-muted mb-0">Cell-Cell Interactions</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="stat-card text-center p-3">
                    <i class="fas fa-users fa-2x text-info mb-2 icon-large-hero"></i>
                    <h3 class="fw-bold text-info">5</h3>
                    <p class="text-muted mb-0">Expert Reviewers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section class="about-section py-5 bg-light">
        <div class="container">
          <div class="row">
            <div class="col-lg-10 mx-auto">
              <div class="card border-0 shadow-sm">
                <div class="card-body p-5">
                  <h2 class="card-title text-primary mb-4">
                    <i class="fas fa-info-circle me-2"></i>
                    About CITEdb
                  </h2>
                  <p class="card-text fs-5 lh-base">
                    <strong class="text-primary">CITEdb</strong> (Cell-cell InTEraction database) is a manually curated database of cell-cell interactions at cell type level, which was derived from 509 published papers in PubMed before January 17, 2022 by 3 reviewers. 728 pairs of cell-cell interactions in human were collected and deposited in current version.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section py-5">
        <div class="container">
          <div class="row">
            <div class="col-lg-10 mx-auto">
              <h2 class="text-center text-primary mb-5">
                <i class="fas fa-star me-2"></i>
                What can users do in <strong>CITEdb</strong>
              </h2>
              <div class="row g-4">
                <div class="col-md-6 col-lg-4">
                  <div class="feature-card card h-100 border-0 shadow-sm">
                    <div class="card-body text-center p-4">
                      <div class="feature-icon mb-3">
                        <i class="fas fa-search fa-2x text-primary icon-large"></i>
                      </div>
                      <h5 class="card-title">Context Search</h5>
                      <p class="card-text text-muted">
                        Search for cell-cell interactions in specific biological contexts using the hierarchical tree structure
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-4">
                  <div class="feature-card card h-100 border-0 shadow-sm">
                    <div class="card-body text-center p-4">
                      <div class="feature-icon mb-3">
                        <i class="fas fa-microscope fa-2x text-success icon-large"></i>
                      </div>
                      <h5 class="card-title">Cell Type Search</h5>
                      <p class="card-text text-muted">
                        Explore interactions involving specific cell types of interest with filtering options
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-4">
                  <div class="feature-card card h-100 border-0 shadow-sm">
                    <div class="card-body text-center p-4">
                      <div class="feature-icon mb-3">
                        <i class="fas fa-filter fa-2x text-info icon-large"></i>
                      </div>
                      <h5 class="card-title">Method Filtering</h5>
                      <p class="card-text text-muted">
                        Filter results by experimental or computational methods used to identify interactions
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-4">
                  <div class="feature-card card h-100 border-0 shadow-sm">
                    <div class="card-body text-center p-4">
                      <div class="feature-icon mb-3">
                        <i class="fas fa-chart-bar fa-2x text-warning icon-large"></i>
                      </div>
                      <h5 class="card-title">View Statistics</h5>
                      <p class="card-text text-muted">
                        Access comprehensive statistics and visualizations of the database content and distributions
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-4">
                  <div class="feature-card card h-100 border-0 shadow-sm">
                    <div class="card-body text-center p-4">
                      <div class="feature-icon mb-3">
                        <i class="fas fa-download fa-2x text-danger icon-large"></i>
                      </div>
                      <h5 class="card-title">Download Data</h5>
                      <p class="card-text text-muted">
                        Download the complete dataset containing 728 cell-cell interactions from 509 published papers
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-4">
                  <div class="feature-card card h-100 border-0 shadow-sm">
                    <div class="card-body text-center p-4">
                      <div class="feature-icon mb-3">
                        <i class="fas fa-info-circle fa-2x text-secondary icon-large"></i>
                      </div>
                      <h5 class="card-title">Access Documentation</h5>
                      <p class="card-text text-muted">
                        Find help documentation and contact information for questions about the database
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Citation Section -->
      <section class="citation-section py-5 bg-light">
        <div class="container">
          <div class="row">
            <div class="col-lg-10 mx-auto">
              <div class="card border-0 shadow-sm">
                <div class="card-body p-5">
                  <h2 class="card-title text-primary mb-4">
                    <i class="fas fa-quote-left me-2"></i>
                    Citation
                  </h2>
                  <p class="card-text fs-5 mb-4">
                    If you use <strong class="text-primary">CITEdb</strong>, please cite:
                  </p>
                  
                  <div class="citation-content bg-white p-4 rounded border-start border-primary border-4">
                    <h5 class="fw-bold mb-2">CITEdb: a manually curated database of cell-cell interactions in human</h5>
                    <p class="text-muted mb-2">
                      <em>Nayang Shan, Yao Lu, Hao Guo, Dongyu Li, Jitong Jiang, Linlin Yan, Jiudong Gao, Yong Ren, Xingming Zhao, Lin Hou</em>
                    </p>
                    <p class="mb-2">
                      <strong>Bioinformatics</strong>, 2022 Nov 15;38(22):5144-5148.
                    </p>
                    <div class="citation-links">
                      <a href="https://doi.org/10.1093/bioinformatics/btac654" target="_blank" class="btn btn-outline-primary btn-sm me-2">
                        <i class="fas fa-external-link-alt me-1"></i>
                        DOI: 10.1093/bioinformatics/btac654
                      </a>
                      <a href="https://pubmed.ncbi.nlm.nih.gov/36179089/" target="_blank" class="btn btn-outline-secondary btn-sm">
                        <i class="fas fa-external-link-alt me-1"></i>
                        PMID: 36179089
                      </a>
                    </div>
                  </div>

                  <div class="bibtex-section mt-4">
                    <h6 class="fw-bold mb-3">
                      <i class="fas fa-code me-2"></i>
                      BibTeX:
                    </h6>
                    <div class="bg-dark text-light p-3 rounded">
                      <pre class="mb-0"><code>@article{shan2022citedb,
  title={CITEdb: a manually curated database of cell-cell interactions in human},
  author={Shan, Nayang and Lu, Yao and Guo, Hao and Li, Dongyu and Jiang, Jitong and Yan, Linlin and Gao, Jiudong and Ren, Yong and Zhao, Xingming and Hou, Lin},
  journal={Bioinformatics},
  volume={38},
  number={22},
  pages={5144--5148},
  year={2022},
  publisher={Oxford University Press},
  doi={10.1093/bioinformatics/btac654}
}</code></pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

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
      currentTime: new Date().toLocaleString()
    }
  },
  mounted () {
    console.log('Index组件已挂载')
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.index-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 76px; // 为固定导航栏留出空间
}

.hero-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  
  .hero-stats {
    .stat-card {
      background: white;
      border-radius: $border-radius-lg;
      box-shadow: $box-shadow;
      transition: $transition-base;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: $box-shadow-lg;
      }
    }
  }
}

.feature-card {
  transition: $transition-base;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: $box-shadow-lg !important;
  }
  
  .feature-icon {
    width: 120px; /* 从80px增大50% */
    height: 120px; /* 从80px增大50% */
    border-radius: 50%;
    background: rgba(0, 123, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }
  
  /* 自定义图标大小类 */
  .icon-large {
    font-size: 2.5em !important; /* 从1.5em增大到2.5em，图标本身更大 */
  }
  
  /* Hero Section图标样式 */
  .icon-large-hero {
    font-size: 3em !important; /* Hero Section图标更大 */
  }
  
  /* 增大Hero Section统计卡片间距 */
  .hero-stats {
    .stat-card {
      padding: 2rem !important; /* 从p-3增大到更大的内边距 */
      margin: 0 1rem; /* 增加左右间距 */
      
      i {
        margin-bottom: 1.5rem !important; /* 增大图标与数字的间距 */
      }
    }
  }
}

.citation-content {
  box-shadow: $box-shadow;
}

.bibtex-section {
  pre {
    font-size: 1rem; /* 从0.875rem增大到1rem */
    line-height: 1.5;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
    overflow-x: hidden;
  }
  
  code {
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .hero-section {
    .display-4 {
      font-size: 2.5rem;
    }
    
    .lead {
      font-size: 1.2rem;
    }
    
    .hero-stats {
      .stat-card {
        margin-bottom: 1rem;
        
        h3 {
          font-size: 2rem;
        }
        
        p {
          font-size: 1rem;
        }
      }
    }
  }
  
  .feature-card {
    margin-bottom: 1rem;
    
    .card-title {
      font-size: 1.3rem;
    }
    
    .card-text {
      font-size: 1rem;
    }
  }
  
  .citation-links {
    .btn {
      display: block;
      width: 100%;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }
  }
  
  .bibtex-section {
    pre {
      font-size: 0.95rem; /* 从0.8rem增大到0.95rem */
    }
  }
}

@media (max-width: 576px) {
  .hero-section {
    .display-4 {
      font-size: 2rem;
    }
    
    .lead {
      font-size: 1.1rem;
    }
    
    .hero-stats {
      .stat-card {
        h3 {
          font-size: 1.75rem;
        }
        
        p {
          font-size: 0.9rem;
        }
      }
    }
  }
  
  .feature-card {
    .card-title {
      font-size: 1.2rem;
    }
    
    .card-text {
      font-size: 0.95rem;
    }
  }
  
  .citation-content {
    h5 {
      font-size: 1.1rem;
    }
    
    p {
      font-size: 0.95rem;
    }
  }
  
  .bibtex-section {
    pre {
      font-size: 0.9rem; /* 从0.75rem增大到0.9rem */
    }
  }
}

// 动画效果
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-section,
.about-section,
.features-section,
.citation-section {
  animation: fadeInUp 0.8s ease-out;
}
</style>
