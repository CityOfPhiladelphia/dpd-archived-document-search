<template>
  <router-view />
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueFuse from "vue-fuse";

Vue.use(VueFuse);


export default {
  name: "ArchivedDocuments", 
  components: { 

  },
  filters: {
  
  },
  data: function() {
    return {
      // minutesList: {},
    };
  },
  computed: { 
    
  },

  watch: {
    

  },

  mounted: function() {
    // this.postMeetingMinutes();
  },

  methods: {

  },
};
</script>

<style lang="scss" >

</style>