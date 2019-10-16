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
      </div>
      <div class="large-icon">
        <i class="fas fa-print-search fa-5x" />
      </div>
    </div>
    <label for="search-dropdown" aria-label="Search Dropdown">
      Select an Entity
      <select
        id="search-dropdown"
        v-model="selectedEntity"
        placeholder="Select an Entity"
        @change="addConfirmButton()"
      >
        <option v-for="entity in entityNames" :key="`${entity}`" :value="entity">{{ entity }}</option>
      </select>
    </label>
    <button v-if="showConfirm">Select Category</button>
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
  filters: {},
  data: function() {
    return {
      entitiesList: [],
      entityNames: ["Historical Commission"],
      selectedEntity: "",
      showConfirm: false
    };
  },
  computed: {},

  watch: {},

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
      this.entitiesList.forEach(entity => {
        this.entityNames.push(entity.displayName);
      });
    },

    addConfirmButton: function() {
      this.showConfirm = true;
    }
  }
};
</script>

<style lang="scss" >
.dropdown-container {
  width: 85%;
  margin: 0 auto;

  .top-container {
    display: flex;
    flex-direction: row;
    .large-icon {
      width: 25%;
      height: 100%;
    }
  }

  #search-dropdown {
    width: 50%;
  }
}
</style>