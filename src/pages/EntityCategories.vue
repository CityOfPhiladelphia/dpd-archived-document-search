<template>
  <div class="categories-wrap">
    <div class="bread-crumbs">
      <router-link 
        to="/"
      >
        <i class="fas fa-home" />
      </router-link>
      / {{ entityInformation.entityName | removeUnderscore }}
    </div>
    <div class="categories-title">
      <h1> {{ entityInformation.entityName | removeUnderscore }} documents</h1>
      <div 
        v-html="entityInformation.entityDescription"
      />
    </div>
    <div
      v-show="loading"
      class="mtm center"
    >
      <i class="fas fa-spinner fa-spin fa-3x" />
    </div>
    <div
      v-show="!loading && emptyResponse"
      class="h3 mtm center"
    >
      Sorry, there are no results.
    </div>
    <div
      v-show="failure"
      class="h3 mtm center"
    >
      Sorry, there was a problem. Please try again.
    </div>
    <div
      v-if="!loading && !emptyResponse && !failure"
      class="categories-list"
    >
      <div 
        v-for="category in entityInformation.categories"
        :key="category.categoryName"
        class="category-container"
      >
        <router-link 
          class="category-container"
          :to="{name: 'documents', 
                params: { entityName : entityInformation.entityName, categoryName: entityInformation.categories[0].categoryName } }"
        >
          <i
            class="fas fa-3x"
            :class="category.categoryIcon"
          />
          <div class="category-info">
            <div class="category-title">
              <h2>  {{ category.categoryName | sentenceCase }} </h2>
            </div>
            <div
              class="category-description"
              v-html="category.categoryDescription"
            />
          </div>
        </router-link>
        
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueFuse from "vue-fuse";
import historical_commission from "./historical_commission.json";
import dhcd from "./dhcd.json";

Vue.use(VueFuse);

const endpoint = "https://api-test.phila.gov/dpd-docs-test/api/v1/document-request/document-categories/";
const gkKey = "?gatekeeperKey=" + "81fb983218b1c837147c3c5334339e01";

export default {
  name: "EntityCategories",
  components: { 
    
  },
  filters: {
    'removeUnderscore': function(val) {
      return val.replace(/_/g, ' ');
    },

    'sentenceCase': function(val) {
      if (val) {
        let lowercase = val.toLowerCase();
        return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
      }

    },
  },

  props: {
   
    entityName: {
      type: String,
      default: "",
    },
  },
  data: function() {
    return {
      categoriesList: [],
      loading: false,
      emptyResponse: false,
      failure: false,
      entityInformation: {},
    };
  },
  computed: { 
    
  },

  watch: {
    

  },

  mounted: function() {
    if (this.$route.params.entityName === "Historical_Commission"){
      this.entityInformation = historical_commission;
      console.log(entit)
    } else if (this.$route.params.entityName === "DHCD") {
      this.entityInformation = dhcd;
    }
  },

  methods: {
    // getEntities: function() {
    //   axios
    //     .get(endpoint + this.$route.params.selectedProp.entityName + gkKey)
    //     .then(response => {
    //       this.categoriesList = response.data;
          
    //       this.loading = false;

    //       this.emptyResponse = (this.categoriesList.length === 0) ? true : false;

    //     })
    //     .catch(e => {
    //       console.log(e);
    //       this.failure = true;
    //       this.loading = false;
    //       this.emptyResponse = false;
    //     })
    //     .finally(() => {
    //       //comment this out to display the entire list
    //       this.makeCategoriesList();
    //     });
    // },

    // makeCategoriesList: function() {
    //   this.categoriesList = this.categoriesList.filter(category => category.displayName === "Meeting Minutes");
    // },

    makeID(val) {
      return val.replace(/\s+/g, "_");
    },
  },
};
</script>

<style lang="scss">

.categories-wrap {
  max-width: 85rem;
  margin: 0 auto;
  padding: 30px;
  padding-bottom:66px;

  .categories-list {
    display: flex;
    flex-wrap: wrap;

    .category-container {
      display: flex;
      width: 50%;
      padding: 20px;
      border-bottom: 1px solid lightgrey;

      .category-description {
        font-weight: 400;
      }
      
      &:nth-child(odd) {
         border-right: 1px solid lightgrey;
      }

      &:nth-last-child(1) {
       border-bottom: none;
       &:first-child {
         width: 100%;
         border-right: none;
       }
      }

      i {
        padding: 20px;
        color:rgb(15, 77, 144);
      }
    }
  }
}

</style>