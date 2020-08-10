<template>
  <header class="site-header">
    <div class="row expanded">
      <div class="columns">
        <a 
          href="//www.phila.gov" 
          class="logo"
        >
          <!--TODO: make local + svg -->
          <img 
            src="//www.phila.gov/media/logo/city-of-philadelphia.svg" 
            alt="City of Philadelphia logo"
          >
        </a>
        <div class="app-divide" />
        <div class="page-title-container">
          <a href="/">
            <h1 class="page-title">Document Archive</h1>
            <h5>Explore publications and other records from the Department of Planning and Development.</h5>
          </a>
          <div class="beta-tag">
            Beta
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {


};
</script>
<style lang="scss">

  .site-header {
    border-bottom: 5px solid #25cef7;
    position: sticky;
    top: 0;
    z-index: 1000;
  }
  .page-title-container a {
    text-decoration: none !important;
  }

  .page-title {
    font-size: 2rem;
  }
  .beta-tag {
    display: inline-block;
    font-size: 12px;
    font-weight: 800;
    vertical-align: middle;
    margin-left: 8px;
    margin-bottom: 5px;
    padding: 1px;
    padding-left: 6px;
    padding-right: 6px;
    border-radius: 1px;
    color: #000;
    background: #ff8d00;
    text-transform: uppercase;
  }
</style>