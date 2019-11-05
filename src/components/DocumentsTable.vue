<template>
  <div class="documents-container">
    <div class="bread-crumbs">
      <router-link 
        to="/"
      >
        <i class="fas fa-home" />
      </router-link> / 
      <router-link 
        :to="{name: 'categories', params : { entityName : $route.params.entityName }}"
      >
        {{ $route.params.entityName | removeUnderscore }}
      </router-link> /
      {{ $route.params.categoryName | removeUnderscore | sentenceCase }}
    </div>
    <div class="page-title">
      <h1>  <i class="fas fa-hourglass-start blue-icon" /> {{ categoryName | removeUnderscore | sentenceCase }} </h1>
      <p>
        At their public meetings, the Philadelphia Historical Commission and its committees review building permit applications and matters relating to historic designation. The minutes outline the projects and nominations under review. They also summarize the discussion and report any decisions and recommendations. 
      </p>
    </div>
    <div class="search-wrapper">
      <div class="search">
        <input
          id="search-bar"
          v-model="search"
          class="search-field"
          type="text"
          placeholder="Search by document name, document date, or meeting number"
        ><input
          ref="archive-search-bar"
          type="submit"
          class="search-submit"
          value="Search"
        >
      </div>
      <!-- Advanced Search component -->
      <div class="accordion-wrap">
        <div
          v-show="true"
          :class="{open : showContent}"
          class="accordion-title bg-ghost-gray"
          tabindex="0"
          role="region"
          :aria-expanded="showContent"
          @click="toggle"
        >
          <slot name="title">
            Advanced Search
          </slot>
        </div>
        <div
          v-show="showContent"
          class="acc-content"
        >
          <div class="advanced-filters">
            <div class="full-search filter-category">
              Search contents of documents
              <div class="search">
                <input
                  type="text"
                  class="search-field"
                >
                <input
                  ref="archive-search-bar"
                  type="submit"
                  class="search-submit"
                  value="Search"
                >
              </div>
              <div class="entity-dropdown ">
                Filter by entity
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
                      :key="''"
                      :value="''"
                    >
                      Show all entities
                    </option>
                    <option
                      v-for="entity in entitiesList"
                      :key="`${entity }`"
                      :value="entity"
                    >{{ entity | entityName }}</option>
                  </select>
                </label>
              </div>
            </div>

           
            <div class="date-search filter-category">
              Show Results From
              <div class="date-filter">
                <datepicker
                  v-model="start"
                  name="start"
                  placeholder="Start date"
                  format="MMM. dd, yyyy"
                 
                  @closed="filterByDate"
                /> 
                <i class="fas fa-arrow-right" />
                <datepicker
                  v-model="end"
                  name="end"
                  placeholder="End date"
                  format="MMM. dd, yyyy"
                  
                  @closed="filterByDate"
                />
              </div>
              <div class="clear-button-wrap">
                <button
                  @click="clearAllFilters"
                >
                  Clear all filters
                </button>
                <button
                  @click="filterByDate"
                >
                  Apply Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    
    <table
      v-if="!loading && !emptyResponse && !failure"
      class="table-container"
    >
      <thead>
        <th><h5>Document Name</h5></th>
        <th>
          <h5>Entity</h5>
        </th>
        <th
          class="table-sort date"
          :class="sortDate"
          @click="sort('documentDate')"
        >
          <h5>Document date</h5>
        </th>
        <th
          class="table-sort minutes"
          :class="sortNumber"
          @click="sort('meetingNumber')"
        >
          <h5>Meeting number</h5>
        </th>
        <th><h5>Page count</h5></th>
        <th><h5>Format</h5></th>
      </thead>

      <paginate
        v-if="filteredDocs.length"
        ref="paginator"
        name="filteredDocs"
        :list="filteredDocs"
        class="paginate-list"
        tag="tbody"
        :per="15"
      >
        <tr
          v-for="minutes in paginated('filteredDocs')"
          :key="minutes.id"
        >
          <td v-if="minutes.indexValues">
            {{ minutes.indexValues["documentName"] }}
          </td>
          <td v-if="minutes.indexValues">
            {{ minutes.indexValues["BODY"] | entityName }}
          </td>
          <td v-if="minutes.indexValues">
            {{ minutes.indexValues["documentDate"] }}
          </td>
          <td v-if="minutes.indexValues">
            {{ minutes.indexValues["meetingNumber"] }}
          </td>
          <td>{{ minutes.pageCount }}</td>
          <td>
            <a
              class="download-link"
              @click="requestFile(minutes.id, minutes.indexValues['documentName'])"
            >{{ minutes.indexValues["documentName"] | documentType }} <i class="fas fa-download" /> </a>
          </td>
        </tr>
      </paginate>
    </table>
    <div class="table-pagination">
      <div class="documents-number">
        Showing <b> {{ filteredDocs.length }} </b> documents.
      </div>
      <paginate-links
        v-if="filteredDocs.length > 0"
        class="app-pages"
        for="filteredDocs"
        :async="true"
        :limit="3"
        :show-step-links="true"
        :hide-single-page="true"
        :step-links="{
          next: 'Next',
          prev: 'Previous'
        }"
      />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueFuse from "vue-fuse";
import VuePaginate from "vue-paginate";
import moment from "moment";
import Datepicker from 'vuejs-datepicker';

Vue.use(VueFuse);
Vue.use(VuePaginate);

const endpoint = "https://dpd72vpwebapp01.city.phila.local:6453/api/v1/document-request/filtered-document-list/";
const docEndpoint = "https://dpd72vpwebapp01.city.phila.local:6453/api/v1/document-request/get-document/";
const catEndpoint = "https://dpd72vpwebapp01.city.phila.local:6453/api/v1/document-request/document-categories/";
const fullListEndpoint = "https://dpd72vpwebapp01.city.phila.local:6453/api/v1/document-request/document-list/";

export default {
  name: "DocumentsTable",
  components: {
    Datepicker,
  },
  filters: {
    'documentType': function(val) {
      if (val) {
        return val.split('.').slice(-1).pop();
      }
    },

    'removeUnderscore': function(val) {
      return val.replace(/_/g, ' ');
    },

    'sentenceCase': function(val) {
      if (val) {
        let lowercase = val.toLowerCase();
        return lowercase.charAt(0).toUpperCase() + lowercase.slice(1);
      }
    },

    'entityName': function(val) {
      if (val ==='HC') {
        return 'Historical Commission';
      } else if (val === 'CHD') {
        return ' Committee on Historic Designation';
      } else if (val === 'CFH') {
        return 'Committee on Financial Hardship';
      } else if (val === 'AC') {
        return 'Architectural Committee';
      } else if (val === 'COC') {
        return 'Committee on Certification';
      } else if (val === 'HVC') {
        return 'Historical Values Committee';
      } 
      return val;
      
    },
  
  },
  props: {
    entityName: String,
    categoryName: String,
    categoryObject: Object,
  },
  data: function() {
    return {
      loading: true,
      emptyResponse: true,
      failure: false,
      documentsList:[],
      filteredDocs: [],
      paginate: [ "filteredDocs" ],
      category: "HISTORICAL_COMM-MEETING_MINUTES",
      requestedDocument: "",
      categoryList: [],
      currentSort:'documentDate',
      currentSortDir: 'desc',
      showContent: false,
      search: '',
      entitiesList: [],
      start: '',
      end: '',
      advancedSearch: '',
      
      selectedEntity: '',
      searchOptions: {
        threshold: 0.2,
        keys: [
          'indexValues.documentDate',
          'indexValues.documentName',
          'indexValues.meetingNumber',
        ],
      },
    };
  },
  computed: {
    endpointCategoryName: function() {
      if (this.$route.params.categoryName) {
        return  "HISTORICAL_COMM-" + this.$route.params.categoryName.toUpperCase();
      } 
      return this.category;
      
    },

    sortDate: function(){
      if (this.currentSort == 'documentDate'){
        return this.currentSortDir;
      } 
      return "";
    },

    sortNumber: function(){
      if (this.currentSort == 'meetingNumber'){
        return this.currentSortDir;
      } 
      return "";
    },

  },

  watch: {
    search (val) {
      if (val) {
        this.filterBySearch();
      } else {
        this.filteredDocs = this.documentsList; 
      }
    },

    selectedEntity(val) {
      this.filterByEntity();
    },
  },

  mounted: function() {
    this.requestFullDocumentsList();
    if (!this.$route.params.categoryObject) {
      this.requestCategoryObject();
      console.log(this.$route.params.categoryObject);
      console.log(this.$route.params.entityName);
    }
  },

  methods: {

    filterBySearch: function() {
      if (this.search) {
        this.filteredDocs = [];
        
        this.$search(this.search, this.documentsList, this.searchOptions).then(documents => {
          // console.log(this.search);
          this.filteredDocs = documents;
        });
      }
    
    },

    requestFile: function(fileID, fileName) {
      console.log(docEndpoint + this.$route.params.entityName + "/" + this.endpointCategoryName + '/' + fileID);
      
      axios
        .get(docEndpoint + this.$route.params.entityName + "/" + this.endpointCategoryName + '/' + fileID , {
          headers: {
            'Accept': 'application/pdf',
          }, responseType : "blob",
        })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([ response.data ]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
        })
        .catch(e => {
          console.log(e);
        })
        .finally(() => {
          
        });
    },

    requestDocumentsList: function() {
      axios
        .post(endpoint, this.categoryObject)
        .then(response => {
          this.documentsList = response.data.entries;
          // console.log(response.data.entries);
          this.loading = false;

          this.emptyResponse = (this.documentsList.length === 0) ? true : false;

        })
        .catch(e => {
          console.log(e);
          this.failure = true;
          this.loading = false;
          this.emptyResponse = false;
        })
        .finally(() => {
        
        });
    },

    makeEntitiesList: function() {
      
      let tempList =[];
      this.documentsList.forEach((document)=> {
        let val = document.indexValues["BODY"];
        // console.log(val);
        if (!tempList.includes(val)) {
          tempList.push(val);
        }
      });

      this.entitiesList = tempList.sort();

    },
    requestFullDocumentsList: function() {
      axios
        .get(fullListEndpoint + this.$route.params.entityName + "/" + this.endpointCategoryName)
        .then(response => {
          this.documentsList = response.data.entries;
          
          this.documentsList.forEach(document => {
            let o = document;
            //replacing keys with spaces to camelCase to make searching etc easier
            delete Object.assign(o.indexValues, { ["documentName"]: o.indexValues["DOCUMENT NAME"] })["DOCUMENT NAME"];
            delete Object.assign(o.indexValues, { ["meetingNumber"]: o.indexValues["MEETING NUMBER"] })["MEETING NUMBER"];
            delete Object.assign(o.indexValues, { ["documentDate"]: o.indexValues["DOCUMENT DATE"] })["DOCUMENT DATE"];
          });

          this.filteredDocs = this.documentsList;
          // console.log(response.data.entries);
          this.loading = false;

          this.emptyResponse = (this.documentsList.length === 0) ? true : false;

        })
        .catch(e => {
          console.log(e);
          this.failure = true;
          this.loading = false;
          this.emptyResponse = false;
        })
        .finally(() => {
          this.sortPosts();
          this.makeEntitiesList();
        });
    },

    requestCategoryObject: function() {

      console.log(catEndpoint + this.$route.params.entityName);

      axios.get(catEndpoint + this.$route.params.entityName)
        .then(response =>{
          this.categoryList = response.data;
        })
        .catch(e => {
          
        })
        .finally(() => {});
    },

    filter() {
      

    },

    filterByDate: function () {
      if ((this.start !== '' ) && (this.end !== '')) {
        let queryStart = moment(this.start.setHours(0,0,0,0)).unix(); //convert to 12:00AM of the start date
        let queryEnd = moment(this.end.setHours(23,59,59,0)).unix(); //convert to 11:59pm of the end date

        if (queryEnd < queryStart) {
          this.failure = true;
          this.filteredDocs = [];
        } else {
          this.failure = false;
          let dateDocs = [];
          this.filteredDocs.forEach((document) => {
            let docDate = moment(document.indexValues['documentDate']).unix();
            if ((docDate >= queryStart) && (docDate <= queryEnd )) {
              dateDocs.push(document);
            }
          });
          this.filteredDocs = dateDocs;
        }
      } else {
        this.filteredDocs = this.documentsList;
      }
    },
    
    filterByEntity : function()  {
      if (this.selectedEntity) {
        let tempDocs = [];
        console.log('here');
        this.documentsList.forEach((document)=> {
          if (document.indexValues["BODY"] === this.selectedEntity) {
            tempDocs.push(document);
          }
        });
        this.filteredDocs = tempDocs; 
      } else {
        this.filteredDocs = this.documentsList;
      }
    },

    clearAllFilters : function() {
      this.selectedEntity = '';
      this.start = '';
      this.search = '';
      this.end = '';
      this.advancedSearch - '';
    }, 

    sort: function(column) {
      //if column == current sort, reverse
      if(column === this.currentSort) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
      }
      this.currentSort = column;
      this.loading = true;
      this.sortPosts();
    },

    sortPosts: function() {
      
      if (this.currentSort === "documentDate") {
         
        this.filteredDocs = this.filteredDocs.sort((a,b) => {
          let modifier = 1;
          if(this.currentSortDir === 'desc') {
            modifier = -1;
          }
          if(moment(a.indexValues[this.currentSort]).unix() < moment(b.indexValues[this.currentSort]).unix()) {
            return -1 * modifier;
          }
          if(moment(a.indexValues[this.currentSort]).unix() > moment(b.indexValues[this.currentSort]).unix()) {
            return 1 * modifier;
          }
          return 0;
        });
      } else if (this.currentSort === "meetingNumber") {
        let modifier = 1;
        this.filteredDocs = this.filteredDocs.sort((a,b) => {
          if(this.currentSortDir === 'desc') {
            modifier = -1;
          }
          console.log(Number.parseInt(a.indexValues[this.currentSort], 10));
          console.log(Number.parseInt(b.indexValues[this.currentSort], 10));
     
          if(!isNaN(Number.parseInt(a.indexValues[this.currentSort], 10)) < !isNaN(Number.parseInt(b.indexValues[this.currentSort], 10))) {
            return -1 * modifier;
          }
          if(!isNaN(Number.parseInt(a.indexValues[this.currentSort], 10))  > !isNaN(Number.parseInt(b.indexValues[this.currentSort], 10))) {
            return 1 * modifier;
          }
          return 0;
        });
      }
      this.loading = false;
    },

    toggle() {
      this.showContent = !this.showContent;
    },
  
    
  },
};
</script>

<style lang="scss" >

.search-wrapper {
  padding-bottom: 1rem;
  
  .accordion-title {
    cursor: pointer;
    text-transform: uppercase;
    color: #444;
    font-size: 17px;
    font-weight: 700;
    padding: 1.15rem 1rem;
    border-bottom: 1px solid #ccc;
    position: relative;

    &:after {
      font-family: "Font Awesome 5 Pro";
      font-weight: 900;
      position: absolute;
      top: calc(50% - 13px);
      right: 2rem;
    }
  }
  .acc-content {
    background-color:#f0f0f0 ;
    padding: 1rem;

    .advanced-filters {
      display: flex;
      justify-content: space-between;

      .filter-category{
        width: 50%;
        padding: 10px;
      
        
        .date-filter {
          height: 50%;
          padding: 10px;
          display: flex;
          justify-content: space-between;

         
          .vdp-datepicker [type='text'] {
            height: 2.4rem;
           
          }
          .vdp-datepicker input:read-only{
            background: white;
            cursor: pointer;
          }
        }

        .clear-button-wrap {
            height: 50%;
            

            button {
              float: right;
              margin-left: 10px;
            }
          
        }
        .entity-dropdown {
          width: 100%;
        }
      }
    }
  }
}

.documents-container {
  padding: 30px;
  width: 85rem;
  margin: 0 auto;
  padding-bottom: 66px;



  .blue-icon {
     color:rgb(15, 77, 144);
  }

  table {
    // width: 85%;
    margin: 0 auto;
    h5 {
      margin: 0;
    }

    .download-link {
      font-weight: bold;
    }
  }
  .table-pagination {
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
  }
}
</style>
