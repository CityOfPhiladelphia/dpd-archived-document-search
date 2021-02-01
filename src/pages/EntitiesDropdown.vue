<template>
  <div class="dropdown-container">
    <div class="top-container">
      <div class="entity-info">
        <h1>About the archive</h1>
        <p>
          Use the archive to view documents created or collected by the <a href="https://www.phila.gov/departments/department-of-planning-and-development/"> Department of Planning and Development</a>. To begin, choose a division in the menu below.
          <br>
          <br>
          At this time, only select documents are included in the archive. You can search for <a href="https://www.phila.gov/documents/">recent publications</a> on phila.gov or use the <a href="https://www.phila.gov/departments/">City government directory</a> to contact your department of interest.
        </p>
        <br>
        <h4>  Select a division:</h4>
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
          :to="{name: 'categories', params : { selectedProp : selectedProp }}"
        >
          <button 
            v-if="showConfirm"
          >
            View Documents
          </button>
        </router-link>
      </div>
      <div class="large-icon">
        <!-- <i class="fas fa-print-search fa-5x" /> -->
        <img src="../assets/icons/Archive-search.png"> 
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

const HCProps = {
  entityName: "Historical_Commission",
  entityDescription: "<p> The <a href='https://www.phila.gov/departments/philadelphia-historical-commission/'>Philadelphia Historical Commission</a> identifies and protects the City’s historic resources. As part of their work, the commission collects information about historic structures and produces documentation of their meetings. For the latest agendas and nominations, see the commission's <a href='https://www.phila.gov/departments/philadelphia-historical-commission/public-meetings/'>public meetings</a> page. </p>",
  entityPrefix: "HISTORICAL_COMM",
  categories: [
    { 
      categoryName: "Meeting minutes",
      categoryDescription: "At their public meetings, the Philadelphia Historical Commission and its committees review building permit applications and matters relating to historic designation. The minutes outline the projects and nominations under review. They also summarize the discussion and report any decisions and recommendations.",
      categoryPageDescription: "<p> At their <a href='https://www.phila.gov/departments/philadelphia-historical-commission/public-meetings/'>public meetings</a>, the Philadelphia Historical Commission and its committees review building permit applications and matters relating to historic designation. The minutes outline the projects and nominations under review. They also summarize the discussion and report any decisions and recommendations.</p>",
      categoryIcon: "fa-hourglass-start",
      categoryURL: 'HISTORICAL_COMM-MEETING_MINUTES'
    },
  ],
};

const DHCDProps = {
  entityName: "DHCD",
  entityDescription: "the description on the DHCD  category selection page",
  entityPrefix: "DHCD",
  categories: [
    { 
      categoryName: "Reports",
      categoryDescription: "DHCD description for the button",
      categoryPageDescription: "DHCD description for the reports table page",
      categoryIcon: "fa-file",
      categoryURL: "DHCD_REPORTS"
    },
  ],
};

const endpoint = "https://api-test.phila.gov/dpd-docs-test/api/v1/document-request/entities";
const gkKey = "?gatekeeperKey=" + "81fb983218b1c837147c3c5334339e01";

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
      selectedProp: {},
      selectedEntity: "",
      showConfirm: false,
    };
  },
  computed: {},

  watch: {
    selectedEntity (val) {
      this.showConfirm = (val && val != "") ? true : false;
      if (val == "Historical_Commission") {
        this.selectedProp = HCProps;
      } else if 
        (val == "DHCD") {
          this.selectedProp = DHCDProps;
      }
    },
  },

  mounted: function() {
    this.getEntities();
  },

  methods: {
    getEntities: function() {
      axios
        .get(endpoint + gkKey)
        .then(response => {
          this.entitiesList = response.data;
        })
        .catch(e => {
          console.log(e);
        })
        .finally(() => {
          this.selectedEntity = this.entitiesList[0].name;
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
  max-width: 85rem;
  margin: 0 auto;
  padding: 30px;

  .top-container {
    display: flex;
    flex-direction: row;
    
    .large-icon {
      padding: 50px;
      max-width: 40%;
     i {
       font-size: 20em;
       color: black;
     }
    }
  }

  #search-dropdown {
    width: 50%;
  }

  button {
    cursor: pointer;
  }
}

@media only screen and (max-width: 700px) {
  .large-icon {
    display: none;
  }

  #search-dropdown {
    min-width: 100%;
  }

}

</style>