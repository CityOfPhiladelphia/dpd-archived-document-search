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
    <Search />
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
        <th><h5>Entity</h5></th>
        <th><h5>Document date</h5></th>
        <th><h5>Meeting number</h5></th>
        <th><h5>Page count</h5></th>
        <th><h5>Format</h5></th>
      </thead>

      <paginate
        v-if="documentsList.length"
        ref="paginator"
        name="documentsList"
        :list="documentsList"
        class="paginate-list"
        tag="tbody"
        :per="15"
      >
        <tr
          v-for="minutes in paginated('documentsList')"
          :key="minutes.id"
        >
          <td v-if="minutes.indexValues">
            {{ minutes.indexValues["DOCUMENT NAME"] }}
          </td>
          <td v-if="minutes.indexValues">
            {{ minutes.indexValues["BODY"] }}
          </td>
          <td v-if="minutes.indexValues">
            {{ minutes.indexValues["DOCUMENT DATE"] }}
          </td>
          <td v-if="minutes.indexValues">
            {{ minutes.indexValues["MEETING NUMBER"] }}
          </td>
          <td>{{ minutes.pageCount }}</td>
          <td>
            <a
              href="#"
              @click="requestFile(minutes.id, minutes.indexValues[&quot;DOCUMENT NAME&quot;])"
            >{{ minutes.indexValues["DOCUMENT NAME"] | documentType }} <i class="fas fa-download" /> </a>
          </td>
        </tr>
      </paginate>
    </table>
    <div class="table-pagination">
      <div class="documents number">
        Showing <b> {{ documentsList.length }} </b> documents.
      </div>
      <paginate-links
        class="app-pages"
        for="documentsList"
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
import Search from "./Search";

Vue.use(VueFuse);
Vue.use(VuePaginate);

const endpoint = "https://dpd72vpwebapp01.city.phila.local:6453/api/v1/document-request/filtered-document-list/";
const docEndpoint = "https://dpd72vpwebapp01.city.phila.local:6453/api/v1/document-request/get-document/";

export default {
  name: "DocumentsTable",
  components: {
    Search,
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
      paginate: [ "documentsList" ],
      category: "HISTORICAL_COMM-MEETING_MINUTES",
      requestedDocument: "",
    };
  },
  computed: {
  

  },

  watch: {

  },

  mounted: function() {
    this.requestDocumentsList();
  },

  methods: {
    requestFile: function(fileID, fileName) {
      console.log(docEndpoint + this.entityName + "/" + this.categoryObject.name + '/' + fileID);
      
      axios
        .get(docEndpoint + this.entityName + "/" + this.categoryObject.name + '/' + fileID , {
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
        .finally(() => {});
    },
  },
};
</script>

<style lang="scss" >
.documents-container {
  padding: 30px;
  width: 85%;
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
  }
  .table-pagination {
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
  }
}
</style>

