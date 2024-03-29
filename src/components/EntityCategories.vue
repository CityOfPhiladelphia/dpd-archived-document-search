<template>
  <div class="categories-wrap">
    <div class="bread-crumbs">
      <router-link 
        to="/"
      >
        <i class="fas fa-home" />
      </router-link>
      / {{ $route.params.entityName | removeUnderscore }}
    </div>
    <div class="categories-title">
      <h1> {{ entityName | removeUnderscore }} documents</h1>
      <p>
        The <a href="https://www.phila.gov/departments/philadelphia-historical-commission/">Philadelphia Historical Commission</a> identifies and protects the City’s historic resources. As part of their work, the commission collects information about historic structures and produces documentation of their meetings. For the latest agendas and nominations, see the commission's <a href="https://www.phila.gov/departments/philadelphia-historical-commission/public-meetings/">public meetings</a> page.
      </p>
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
        v-for="category in categoriesList"
        :key="category.name"
        class="category-container"
      >
        <router-link 
          class="category-container"
          :to="{name: 'documents', 
                params: { entityName : entityName , 
                          categoryName : makeID(category.displayName) } }"
        >
          <i 
            v-if="category.displayName === 'Meeting Minutes'"
            class="fas fa-hourglass-start fa-3x"
          />
          <i
            v-if="category.displayName !== 'Meeting Minutes'"
            class="fas fa-archive fa-3x"
          />
          <div class="category-info">
            <div class="category-title">
              <h2>  {{ category.displayName | sentenceCase }} </h2>
            </div>
            <div
              v-if="category.displayName === 'Meeting Minutes'"
              class="category-description"
            >
              At their public meetings, the Philadelphia Historical Commission and its committees review building permit applications and matters relating to historic designation. The minutes outline the projects and nominations under review. They also summarize the discussion and report any decisions and recommendations.
            </div>
         
            <div
              v-if="category.displayName !== 'Meeting Minutes'"
              class="category-description"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lobortis mattis aliquam faucibus purus in. Libero id faucibus nisl tincidunt eget nullam non nisi. Nisl condimentum id venenatis a condimentum vitae sapien pellentesque habitant.
            </div>
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

Vue.use(VueFuse);

const endpoint = "https://api.phila.gov/dpd-docs/api/v1/document-request/document-categories/";
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
    entityName : {
      type: String,
      default: "Historical_Commission",
    },
  },
  data: function() {
    return {
      categoriesList: [],
      // categoryNames: [],
      selectedCategoryObject: {},
      loading: true,
      emptyResponse: true,
      failure: false,
    };
  },
  computed: { 
    
  },

  watch: {
    

  },

  mounted: function() {
    this.getEntities();
    // console.log(this.$route);
  },

  methods: {
    getEntities: function() {
      axios
        .get(endpoint + this.$route.params.entityName + gkKey)
        .then(response => {
          this.categoriesList = response.data;
          
          this.loading = false;

          this.emptyResponse = (this.categoriesList.length === 0) ? true : false;

        })
        .catch(e => {
          console.log(e);
          this.failure = true;
          this.loading = false;
          this.emptyResponse = false;
        })
        .finally(() => {
          //comment this out to display the entire list
          this.makeCategoriesList();
        });
    },

    makeCategoriesList: function() {
      this.categoriesList = this.categoriesList.filter(category => category.displayName === "Meeting Minutes");
    },

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