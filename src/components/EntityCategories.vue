<template>
  <div>
    {{ categoryNames }}
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueFuse from "vue-fuse";
import VuePaginate from "vue-paginate";

Vue.use(VueFuse);
Vue.use(VuePaginate);

const endpoint = "https://dpd72vpwebapp01.city.phila.local:6453/api/v1/document-request/document-categories/";

export default {
  name: "EntityCategories",
  components: { 
    
  },
  filters: {
  
  },
  data: function() {
    return {
      categoriesList: [],
      categoryNames: [],
      entity: "Historical_Commission",
      selectedCategory: "HISTORICAL_COMM-MEETING_MINUTES",
      selectedCategoryObject: {},
     
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
        .get(endpoint + this.entity)
        .then(response => {
          this.categoriesList = response.data;
        })
        .catch(e => {
          console.log(e);
        })
        .finally(() => {
          this.makeCategoriesList();
        });
    },

    makeCategoriesList: function() {
     
      this.categoriesList.forEach((category) => {
        this.categoryNames.push(category.displayName);
      });

    },
  },
};
</script>

<style lang="scss" >


</style>