<template>
  <div class="dropdown-container">
    <div
    v-if="$route.params.entityName === 'Historical_Commission'">
   <HCDocumentsTable />
    </div>
     <div
    v-if="$route.params.entityName === 'DHCD'">
   <DHCDDocumentsTable />
  </div>
  </div>
</template>

<script>

import DHCDDocumentsTable from "./DHCDDocumentsTable.vue";
import HCDocumentsTable from "./HCDocumentsTable.vue";

export default {
  name: "TableDecider",
  components: {
    DHCDDocumentsTable,
    HCDocumentsTable,
  },
  filters: {
    
  },
  data: function() {
    return {
      
    };
  },
  computed: {},

  watch: {
  
  },

  mounted: function() {
   
  },

  methods: {
   
  },
};
</script>

<style lang="scss" >

</style>