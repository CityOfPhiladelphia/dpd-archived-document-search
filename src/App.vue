<template>
  <div>
    <AppHeader />
    <router-view />
    <AppFooter />
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';


export default {
  name: "ArchivedDocuments", 
  components: {
    AppHeader,
    AppFooter,
  },
};
</script>

<style lang="scss" >

</style>