<template>
  <footer class="footer bg-dark text-light py-5 mt-auto">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 mb-4">
          <div class="footer-brand mb-3">
            <img src="../assets/logo.svg" alt="CITEdb Logo" height="40" class="me-2">
            <span class="fw-bold fs-4">CITEdb</span>
          </div>
          <p class="text-light">
            A comprehensive database of cell-cell interactions at cell type level, 
            providing researchers with valuable insights into cellular communication.
          </p>
          <div class="social-links">
            <a href="https://github.com/citedb/citedb" target="_blank" class="text-light me-3" title="GitHub">
              <i class="fab fa-github fa-lg"></i>
            </a>
            <a href="mailto:linlin.yan@bioinfo.app" class="text-light" title="Email">
              <i class="fas fa-envelope fa-lg"></i>
            </a>
          </div>
        </div>
        
        <div class="col-lg-2 col-md-6 mb-4">
          <h6 class="fw-bold mb-3 text-light">Quick Links</h6>
          <ul class="list-unstyled">
            <li class="mb-2">
              <a href="/" class="text-light text-decoration-none">
                <i class="fas fa-home me-1"></i>Home
              </a>
            </li>
            <li class="mb-2">
              <a href="/search" class="text-light text-decoration-none">
                <i class="fas fa-search me-1"></i>Search
              </a>
            </li>
            <li class="mb-2">
              <a href="/statistics" class="text-light text-decoration-none">
                <i class="fas fa-chart-bar me-1"></i>Statistics
              </a>
            </li>
            <li class="mb-2">
              <a href="/download" class="text-light text-decoration-none">
                <i class="fas fa-download me-1"></i>Download
              </a>
            </li>
          </ul>
        </div>
        
        <div class="col-lg-2 col-md-6 mb-4">
          <h6 class="fw-bold mb-3 text-light">Resources</h6>
          <ul class="list-unstyled">
            <li class="mb-2">
              <a href="/team" class="text-light text-decoration-none">
                <i class="fas fa-users me-1"></i>Team
              </a>
            </li>
            <li class="mb-2">
              <a href="/help" class="text-light text-decoration-none">
                <i class="fas fa-question-circle me-1"></i>Help
              </a>
            </li>
            <li class="mb-2">
              <a href="#" class="text-light text-decoration-none">
                <i class="fas fa-book me-1"></i>Documentation
              </a>
            </li>
            <li class="mb-2">
              <a href="#" class="text-light text-decoration-none">
                <i class="fas fa-bug me-1"></i>Report Issue
              </a>
            </li>
          </ul>
        </div>
        
        <div class="col-lg-4 mb-4">
          <h6 class="fw-bold mb-3 text-light">Contact & Support</h6>
          <div class="contact-info">
            <p class="text-light mb-2">
              <i class="fas fa-envelope me-2"></i>
              <a href="mailto:linlin.yan@bioinfo.app" class="text-light text-decoration-none">
                linlin.yan@bioinfo.app
              </a>
            </p>
            <p class="text-light mb-2">
              <i class="fas fa-map-marker-alt me-2"></i>
              Beijing, China
            </p>
            <p class="text-light mb-3">
              <i class="fas fa-calendar me-2"></i>
              Last updated: {{ currentYear }}
            </p>
          </div>
          
          <div class="github-issues">
            <h6 class="fw-bold mb-2 text-light">Stay Updated</h6>
            <p class="text-light mb-3 small">
              Follow our GitHub repository for the latest updates and contribute to the project.
            </p>
            <a href="https://github.com/citedb/citedb/issues" target="_blank" class="btn btn-outline-light btn-sm">
              <i class="fab fa-github me-2"></i>
              GitHub Issues
            </a>
          </div>
        </div>
      </div>
      
      <hr class="my-4 border-secondary">
      
      <div class="row align-items-center">
        <div class="col-md-6 mb-3 mb-md-0">
          <p class="text-light mb-0">
            <small>&copy; {{ currentYear }} CITEdb Contributors. All rights reserved.</small>
          </p>
        </div>
        <div class="col-md-6 text-md-end">
          <a href="https://beian.miit.gov.cn/" target="_blank" class="text-light text-decoration-none me-3">
            <small>京ICP备18031542号-6</small>
          </a>
          <a href="https://github.com/citedb/citedb/blob/main/PRIVACY.md" target="_blank" class="text-light text-decoration-none me-3">
            <small>Privacy Policy</small>
          </a>
          <a href="https://github.com/citedb/citedb/blob/main/TERMS.md" target="_blank" class="text-light text-decoration-none">
            <small>Terms of Service</small>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      currentYear: new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  margin-top: auto;
  
  .footer-brand {
    display: flex;
    align-items: center;
    
    img {
      filter: brightness(1.1) contrast(1.1);
      transition: $transition-base;
      
      &:hover {
        filter: brightness(1.2) contrast(1.2);
        transform: scale(1.05);
      }
    }
  }
  
  .social-links {
    a {
      transition: $transition-base;
      
      &:hover {
        color: $primary !important;
        transform: translateY(-2px);
      }
    }
  }
  
  ul {
    li {
      a {
        transition: $transition-base;
        
        &:hover {
          color: $primary !important;
          padding-left: 5px;
        }
      }
    }
  }
  
  .github-issues {
    .btn {
      transition: $transition-base;
      
      &:hover {
        background-color: $primary;
        border-color: $primary;
        transform: translateY(-2px);
      }
    }
  }
}

/* 响应式字体大小调整 */
@media (max-width: 768px) {
  .footer {
    font-size: 1rem;
  }
  
  .footer-brand .fw-bold {
    font-size: 1.4rem;
  }
  
  h6 {
    font-size: 1.2rem;
  }
  
  .social-links a {
    font-size: 1.1rem;
  }
  
  .github-issues h6 {
    font-size: 1.2rem;
  }
  
  .github-issues .btn {
    font-size: 1rem;
  }
  
  small {
    font-size: 0.9rem;
  }
}

@media (max-width: 576px) {
  .footer {
    font-size: 0.95rem;
  }
  
  .footer-brand .fw-bold {
    font-size: 1.3rem;
  }
  
  h6 {
    font-size: 1.1rem;
  }
  
  .social-links a {
    font-size: 1rem;
  }
  
  .github-issues h6 {
    font-size: 1.1rem;
  }
  
  .github-issues .btn {
    font-size: 0.95rem;
  }
  
  small {
    font-size: 0.85rem;
  }
}
</style>

