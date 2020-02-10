<template>
  <router-view />
</template>

<script>
import Vue from "vue";
import axios from "axios";

export default {
  name: "ArchivedDocuments", 
};
</script>

<style lang="scss" >

.site-header {
    position: sticky;
    position: -webkit-sticky;
    top: 0;
    z-index: 100;
    max-height: 72px;
} 

#application .site-header .logo img {
    max-width: 250px;
}
.app-nav {
    position: sticky;
    top: 72px;
    position: -webkit-sticky;
    z-index: 100;
}

@media (max-width:760px) {

   #application .site-header .logo img {
    //  max-height: 30px;
    display: none;
    }

    .app-nav {
        position: relative;
        top: 0px;
        z-index: 100;
    }
    
    .site-header {
        position: relative;
        top: 0px;
        z-index: 100;
        max-height: 300px;
    }
    
}

</style>