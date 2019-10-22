<template>
  <div class="dropdown-container">
    <div class="top-container">
      <div class="entity-info">
        <h1>Information about the Tool</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Gravida in fermentum et sollicitudin
          ac orci phasellus egestas. Cras pulvinar mattis nunc sed blandit libero volutpat sed cras.
          Bibendum enim facilisis gravida neque. Arcu non odio euismod lacinia at.
          Faucibus in ornare quam viverra orci sagittis. Sapien et ligula ullamcorper malesuada proin.
          Tincidunt id aliquet risus feugiat in ante metus. Ullamcorper eget nulla facilisi etiam dignissim.
          Elementum curabitur vitae nunc sed velit dignissim sodales.
          Massa ultricies mi quis hendrerit dolor magna eget est lorem.
          Vel risus commodo viverra maecenas. Varius duis at consectetur lorem donec.
          Ut venenatis tellus in metus vulputate eu.
        </p>
        <h4> Select an Entity:</h4>
        <label
          for="search-dropdown"
          aria-label="Search Dropdown"
        >
          <select
            id="search-dropdown"
            v-model="selectedEntity"
            placeholder="Select an Entity"
          >
            <option
              v-for="entity in entitiesList"
              :key="`${entity.name}`"
              :value="entity.name"
            >{{ entity.name | entityDisplay }}</option>
          </select>
        </label>
        <router-link 
          :to="{name: 'categories', params : { entityName : selectedEntity }}"
        >
          <button 
            v-if="showConfirm"
          >
            Select Category
          </button>
        </router-link>
      </div>
      <div class="large-icon">
        <i class="fas fa-print-search fa-5x" />
        <!-- <img src="../assets/icons/Archive-search.svg"> -->
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

const endpoint =
  "https://dpd72vpwebapp01.city.phila.local:6453/api/v1/document-request/entities";

export default {
  name: "EntitiesDropdown",
  components: {},
  filters: {
    'entityDisplay' : function(val) {
      return val.replace(/_/g, ' ');
    },
  },
  data: function() {
    return {
      entitiesList: [],
      // entityNames: [],
      selectedEntity: "",
      showConfirm: false,
    };
  },
  computed: {},

  watch: {
    selectedEntity (val) {
      this.showConfirm = (val && val != "") ? true : false;
    },
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
          // this.makeDropdownList();
        });
    },

    makeDropdownList: function() {
      this.entitiesList.forEach(entity => {
        this.entityNames.push(entity.name);
      });
    },

    makeID() {
      return this.selectedEntity.replace(/\s+/g, "-").toLowerCase();
    },
  },
};
</script>

<style lang="scss" >
.dropdown-container {
  width: 85%;
  margin: 0 auto;
  padding: 50px;

  .top-container {
    display: flex;
    flex-direction: row;
    .large-icon {
      padding: 50px;
     i {
       font-size: 20em;
       color: black;
     }
    }
  }

  #search-dropdown {
    width: 50%;
  }
}
</style>