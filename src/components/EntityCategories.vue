<template>
  <div class=categories-wrap>
    <div class="categories-title">
      <h1> Historical Commission document types</h1>
    </div>
    <div class="categories-list">
      <div 
        v-for="category in categoryNames"
        :key="category"
        class="category-container"
      >
        <i class="fas fa-hourglass-start fa-3x" />
        <div class="category-info">
          <div class="category-title">
            <router-link 
            :to="{name: 'documents', params: { entityName : entityName , selectedCategory : makeID(category) }}"
            >
              <h2>  {{ category }} </h2>
            </router-link>
          </div>
          <div class="category-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Gravida in fermentum et sollicitudin
            ac orci phasellus egestas. Cras pulvinar mattis nunc sed blandit libero volutpat sed cras.
            Bibendum enim facilisis gravida neque. Arcu non odio euismod lacinia at.
            Faucibus in ornare quam viverra orci sagittis. 
          </div>
        </div>
      </div>
    </div>
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
      categoryNames: [ "Meeting Minutes" ],
      entity: "Historical_Commission",
      selectedCategory: "HISTORICAL_COMM-MEETING_MINUTES",
      selectedCategoryObject: {},
      selectedCategory: "Meeting Minutes",
    };
  },

  props : {
    entityName: "" 
  },
  computed: { 
    
  },

  watch: {
    

  },

  mounted: function() {
    // this.getEntities();
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

     makeID(val) {
      return val.replace(/\s+/g, "-").toLowerCase();
    }
  },
};
</script>

<style lang="scss">

.categories-wrap {
  width: 85%;
  margin: 0 auto;
  padding: 50px 100px;
  
  .category-container {
    display: flex;

    i {
      padding: 20px;
      color:rgb(15, 77, 144);
    }
  }
}

</style>