<template>
  <div>
    <Search />
    <MinutesTable />
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueFuse from "vue-fuse";

Vue.use(VueFuse);
import MinutesTable from "./components/MinutesTable";
import Search from "./components/Search";

export default {
  name: "ArchivedDocuments",
  components: { 
    MinutesTable,
    Search,
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
    // postMeetingMinutes: function() {
    //   var config = {
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded/",
    //       'Access-Control-Allow-Origin': '*',
    //     },
    //   };
    //   axios.post(endpoint, meetingMinutes, config
    //   ).then(response => {
    //     this.minutesList = response.data;
    //   }).catch(e => {
    //     console.log(e);
    //   }).finally(() => {

    //   });
    // },
  },
};
</script>

<style lang="scss" >

</style>