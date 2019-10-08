<template>
  <div>
    {{ entityNames }}
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueFuse from "vue-fuse";
import VuePaginate from "vue-paginate";

Vue.use(VueFuse);
Vue.use(VuePaginate);

const endpoint = "https://dpd72vpwebapp01.city.phila.local:6453/api/v1/document-request/entities";

export default {
  name: "EntitiesDropdown",
  components: { 
    
  },
  filters: {
  
  },
  data: function() {
    return {
      entitiesList: [],
      entityNames: [],
     
    };
  },
  computed: { 
    
  },

  watch: {
    

  },

  mounted: function() {
    this.getEntities();
  },

  methods: {
    getEntities: function() {
      axios
        .get(endpoint)
        .then(response => {
          this.entitiesList = response.data;
        })
        .catch(e => {
          console.log(e);
        })
        .finally(() => {
          this.makeDropdownList();
        });
    },

    makeDropdownList: function() {
     
      this.entitiesList.forEach((entity) => {
        this.entityNames.push(entity.displayName);
      });

    },
  },
};
</script>

<style lang="scss" >


</style>