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
      <p>
        Use the advanced search to filter your results by date or entity. You can also search the contents of the available documents.
      </p>
    </div>
    <div class="search-wrapper">
      <div class="search">
        <input
          id="search-bar"
          v-model="search"
          class="search-field"
          type="text"
          placeholder="Search by document name or meeting number"
        ><input
          ref="archive-search-bar"
          type="submit"
          class="search-submit"
          value="Search"
        >
        <button
          v-if="search.length > 0"
          class="clear-search-btn"
          @click="clearSearchBar"
        >
          <i class="fas fa-times " />
        </button>
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
          @keyup.enter="toggle"
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
                  v-model="advancedSearch"
                  type="text"
                  class="search-field"
                  placeholder=" Enter a keyword or phrase (ex. “City Hall”)"
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
                    tabindex="0"
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
              Show results from
              <div class="date-filter">
                <input
                  v-model="start"
                  type="date"
                  min="1956-01-01"
                  max="2019-12-31"
                >
                <p> to </p>
                <input
                  v-model="end"
                  type="date"
                  min="1956-01-01"
                  max="2019-12-31"
                >
              </div>
              <div class="clear-button-wrap">
                <button
                  class="clear-button"
                  @click="clearAllFilters"
                >
                  Clear all filters
                </button>
                <button
                  class="button filter-button"
                  :disabled="applyDisabled"
                  @click="filter()"
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
      v-show="downloading"
      class="mtm mbl center"
    >
      <div>
        Downloading {{ fileName }}
      </div>
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
        <th><h5>Document name</h5></th>
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
        <th>
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
            {{ minutes.indexValues["documentDate"] | dateDisplay }}
          </td>
          <td v-if="minutes.indexValues">
            {{ minutes.indexValues["meetingNumber"] }}
          </td>
          <td>{{ minutes.pageCount }}</td>
          <td>
            <a
              class="download-link"
              tabindex="0"
              @click="requestFile(minutes.id, minutes.indexValues['documentName'])"
              @keyup.enter="requestFile(minutes.id, minutes.indexValues['documentName'])"
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

Vue.use(VueFuse);
Vue.use(VuePaginate);
Vue.use(moment);

const endpoint = "https://api.phila.gov/dpd-docs/api/v1/document-request/filtered-document-list/";
const docEndpoint = "https://api.phila.gov/dpd-docs/api/v1/document-request/get-document/";
const catEndpoint = "https://api.phila.gov/dpd-docs/api/v1/document-request/document-categories/";
const fullListEndpoint = "https://api.phila.gov/dpd-docs/api/v1/document-request/document-list/";

const gkKey = "?gatekeeperKey=" + "81fb983218b1c837147c3c5334339e01";

const fullBodyFilter = {
  "id": 7,
  "name": "HISTORICAL_COMM-MEETING_MINUTES",
  "displayName": "Meeting Minutes",
  "attributes": [
    {
      "fieldNumber": 8,
      "name": "FULL_TEXT",
      "filterValue1": null,
      "filterValue2": null,
      "type": {
        "name": "FULL_TEXT",
        "filterTypes": [
          {
            "name": "FULL_TEXT",
          },
        ],
      },
      "selectedFilterType": {
        "name": "FULL_TEXT",
      },
    },
  ],
  "entityId": 1,
};

export default {
  name: "DocumentsTable",
  components: {
  },
  filters: {
    dateDisplay: function(val) {
      var year =  moment().year(); //get current year
      let parsedDate =  moment(val , "MM-DD-YYYY");
      return parsedDate.format("MMMM D, YYYY") ;
    },
    
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
      switch (val) {
      case 'HC':
        return 'Historical Commission';
      case 'CHD' :
        return 'Committee on Historic Designation';
      case 'CFH' :
        return 'Committee on Financial Hardship';
      case 'AC' :
        return 'Architectural Committee';
      case 'COC' :
        return 'Committee on Certification';
      case 'HVC' :
        return 'Historical Values Committee';
      default:
        return val;
      }
    },
  },
  props: {
    entityName: {
      type: String,
      default: 'Historical_Commission',
    },
    categoryName: {
      type: String,
      default: 'Meeting_Minutes', //TODO make default obj
    },
  },
  data: function() {
    return {
      loading: true,
      emptyResponse: false,
      failure: false,
      downloading: false,
      fileName: "",
      documentsList:[],
      filteredDocs: [],
      fullTextDocs: [],
      entityDocs:[],
      dateDocs:[],
      searchDocs: [],
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

    applyDisabled: function() {
      if (this.start || this.end || this.selectedEntity || this.advancedSearch) {
        return false;
      }   
      return true;  
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

  },

  mounted: function() {
    this.requestFullDocumentsList();
  },

  methods: {

    filterBySearch: function() {
      if (this.search) {
        let tempDocs = [];
        this.filteredDocs = [];
        
        this.$search(this.search, this.entityDocs, this.searchOptions).then(documents => {
          // console.log(this.search);
          this.filteredDocs = documents;
        });
      } else {
        this.filteredDocs = this.entityDocs;
      }
    
    },

    requestFile: function(fileID, fileName) {
      console.log(docEndpoint + this.$route.params.entityName + "/" + this.endpointCategoryName + '/' + fileID + gkKey);
      this.downloading = true;
      this.fileName = fileName;
      axios
        .get(docEndpoint + this.$route.params.entityName + "/" + this.endpointCategoryName + '/' + fileID + gkKey, {
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
          this.downloading = false;
        });
    },

    requestDocumentsList: function(postObj) {
      this.loading = true;
      axios
        .post(endpoint + gkKey, postObj)
        .then(response => {
          if (response.data.entries) {
            this.fullTextDocs = response.data.entries;
            // console.log(response.data.entries);
          

            this.fullTextDocs.forEach(document => {
              let o = document;
              //replacing keys with spaces to camelCase to make searching etc easier
              delete Object.assign(o.indexValues, { ["documentName"]: o.indexValues["DOCUMENT NAME"] })["DOCUMENT NAME"];
              delete Object.assign(o.indexValues, { ["meetingNumber"]: o.indexValues["MEETING NUMBER"] })["MEETING NUMBER"];
              delete Object.assign(o.indexValues, { ["documentDate"]: o.indexValues["DOCUMENT DATE"] })["DOCUMENT DATE"];
            });

          }

        })
        .catch(e => {
          console.log(e);
          this.loading = false;
          this.emptyResponse = true;
         
        })
        .finally(() => {
          this.filterOnFullText();
          this.loading = false;
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
        .get(fullListEndpoint + this.$route.params.entityName + "/" + this.endpointCategoryName + gkKey) 
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
          this.fullTextDocs = this.documentsList;
          this.entityDocs = this.documentsList;
          // console.log(response.data.entries);
          this.loading = false;

          this.emptyResponse = (this.documentsList.length) ? false : true;

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

      // console.log(catEndpoint + this.$route.params.entityName);

      axios.get(catEndpoint + this.$route.params.entityName + gkKey)
        .then(response =>{
          this.categoryList = response.data;
        })
        .catch(e => {
          
        })
        .finally(() => {
          // this.props.categoryObject
        });
    },

    filter: function(){
      if (this.advancedSearch) {
        let postObject = fullBodyFilter;
        postObject.attributes[0].filterValue1 = this.advancedSearch;
        console.log(postObject);
        this.requestDocumentsList(postObject);
      
      } else {
        this.fullTextDocs = this.documentsList;
        this.filterOnFullText();
      }
    },

    filterOnFullText: async function() {
      await this.filterByDate();
      await this.filterByEntity();
      await this.filterBySearch();
      await this.sortPosts();
    }, 

    filterByDate: function () {
      if ((this.start) && (this.end)) {
        let queryStart = moment(this.start).unix(); 
        let queryEnd = moment(this.end).unix(); 

        if (queryEnd < queryStart) {
          this.failure = true;
          this.filteredDocs = [];
        } else {
          this.failure = false;
          let tempDocs = [];
          this.fullTextDocs.forEach((document) => {
            let docDate = moment(document.indexValues['documentDate']).unix();
            if ((docDate >= queryStart) && (docDate <= queryEnd )) {
              tempDocs.push(document);
            }
          });
          this.dateDocs = tempDocs;
        }
      } else {
        // console.log(this.fullTextDocs);

        this.dateDocs = this.fullTextDocs;
      }
    },
    
    filterByEntity : function()  {
      if (this.selectedEntity) {
        let tempDocs = [];
        console.log('here');
        this.dateDocs.forEach((document)=> {
          if (document.indexValues["BODY"] === this.selectedEntity) {
            tempDocs.push(document);
          }
        });
        this.entityDocs = tempDocs; 
      } else {
        this.entityDocs = this.dateDocs;
      }
    },

    clearAllFilters : async function() {
      this.selectedEntity = '';
      this.start = '';
      this.search = '';
      this.end = '';
      this.advancedSearch = '';
      this.emptyResponse = false;

      await this.filter();
    }, 

    clearSearchBar: function () {
      this.search = "";
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

.documents-container {
  max-width: 85rem;
}

.search-wrapper {
  padding-bottom: 1rem;

     .clear-search-btn {
      position: absolute;
      top:16px;
      right: 70px;
      padding: 0;
      font-size: 20px;
      background-color: #fff;
      opacity: 0.8;
      z-index: 999;
      cursor: pointer;
      color: rgba(60, 60, 60, 0.5);
      }
  
  .accordion-title {
    cursor: pointer;
    text-transform: uppercase;
    // color: #444;
    font-size: 17px;
    font-weight: 700;
    padding: 1.15rem 1rem;
    border-bottom: 1px solid #ccc;
    position: relative;
  }

  .open.accordion-title::before {
    content: '-';
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
          // padding: 10px 0px;
          display: flex;
          justify-content: space-between;

         
          input[type='date'] {
            background-color: white;
           width: 33%;
          }
        }

        .clear-button-wrap {
            height: 50%;
            float: right;
            

            button {
              margin-left: 10px;
            }

            .clear-button {
              background-color: transparent;
              text-decoration: underline;
              color: #0f4d90;
              //color: white;
              &:hover {
                background-color: transparent;
              }
            }
          
        }

        .filter-button {
          &:disabled {
            background-color: #BABABA;
            color: #9B9B9B;
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
    margin: 0 auto;

    .table-sort.asc h5:after {
        content: '   \25B2';
        font-size: 10px;
      }
    .table-sort.desc h5:after {
      content: '   \25BC';
      font-size: 10px;
    }

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

    .paginate-links {
      user-select: none;
    }
  }
}
</style>