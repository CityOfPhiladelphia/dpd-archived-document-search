<template>
  <div>
    <Search />
  
    <EntitiesDropdown />
    <EntityCategories />
    <DocumentsTable />
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueFuse from "vue-fuse";

Vue.use(VueFuse);
import DocumentsTable from "./components/DocumentsTable";
import EntitiesDropdown from "./components/EntitiesDropdown";
import EntityCategories from "./components/EntityCategories";
import Search from "./components/Search";

export default {
  name: "ArchivedDocuments",
  components: { 
    DocumentsTable,
    Search,
    EntitiesDropdown,
    EntityCategories,
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